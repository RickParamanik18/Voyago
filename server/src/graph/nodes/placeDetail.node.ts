import z from "zod";
import llm from "../llm/index.js";
import { TravelState } from "../state.js";
import {
    tavilyExtractTool,
    tavilySearchTool,
} from "../tools/tavilySearchTool.js";
import { AIMessage } from "@langchain/core/messages";
import { cleanAndJoinStringArray } from "../utils/utility.js";

export const placeDetailNode = async (state: typeof TravelState.State) => {
    const userMessages = state.messages;
    const lastMsg = userMessages[userMessages.length - 1];

    const llmWithPlaceQueryOutput = llm.withStructuredOutput(
        z
            .object({
                place: z
                    .string()
                    .describe(
                        "This is the name of the place for which user wants to know something"
                    ),
                query: z
                    .string()
                    .describe("this is the query user has about the place"),
            })
            .describe(
                "extract the place and qusery from the given user message"
            )
    );

    const result = await llmWithPlaceQueryOutput.invoke([
        {
            role: "system",
            content: `You are a location intent and web-search query generator.

                From the user's message, extract:
                1. The exact PLACE NAME.
                2. A WEB-SEARCH-OPTIMIZED QUERY related to that place.

                The query MUST:
                - Be optimized for Google/Bing-style web search.
                - Use short, high-intent keywords.
                - Remove filler words like: "show me", "tell me", "please", "can you".
                - Prefer noun phrases over full sentences.
                - Include the place name only if it improves search clarity.
                - Be suitable for scraping articles, blogs, and listings.

                Rules:
                - No markdown.
                - No explanations.
                - No extra text.
                - If place is missing but implied, infer it.
                - If intent is missing, infer the most likely search intent.`,
        },
        lastMsg,
    ]);

    const tavilySearchOutput = await tavilySearchTool.invoke({
        query: result.query,
    });
    const urls = tavilySearchOutput.results.map((result: any) => result.url);

    const tavilyExtractOutput = await tavilyExtractTool.invoke({ urls });
    const webSearchResult = cleanAndJoinStringArray(
        tavilyExtractOutput.results.map(
            (webContent: any) => webContent.raw_content
        )
    );

    const llmWithFinalOutputStructure = llm.withStructuredOutput(
        z
            .object({
                answer: z
                    .string()
                    .describe(
                        "this is the final answer of the llm based on the user query"
                    ),
            })
            .describe(
                "extract the response for the given user query from the webscraped data"
            )
    );

    const answer = await llmWithFinalOutputStructure.invoke([
        {
            role: "system",
            content: `You are a factual information assistant.

                You will be given:
                1. A user query about a specific place.
                2. Web-scraped data related to that place.

                Your task is to answer the user's question by using ONLY the information present in the provided web-scraped data.

                STRICT RULES:
                - Do NOT use any external knowledge.
                - Do NOT assume or guess any information.
                - Do NOT fill missing details with general knowledge.
                - If the scraped data does NOT clearly contain the answer, you MUST reply ONLY with:
                "I don't know based on the available data."
                - If the question is partially answerable, answer ONLY the part that is supported by the data.
                - Do NOT add extra explanations, opinions, or summaries unless explicitly asked.
                - Keep the answer clear, short, and directly relevant to the question.

                You must behave like a strict data-grounded answer engine.
                here is the scraped data : ${webSearchResult}
                `,
        },
        lastMsg,
    ]);

    console.log({ lastMsg: lastMsg.content });
    console.log(answer);
    return {
        messages: [new AIMessage(answer.answer)],
    };
};
