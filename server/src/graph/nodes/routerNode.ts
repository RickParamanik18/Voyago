import z from "zod";
import llm from "../llm/index.js";
import { TravelState } from "../state.js";

export const routerNode = async (state: typeof TravelState.State) => {
    const userMessages = state.messages;
    const lastMsg = userMessages[userMessages.length - 1];

    const llmWithNextNodeRoutingOutput = llm.withStructuredOutput(
        z
            .object({
                nextNode: z
                    .string()
                    .describe("This is the name of the next node to route to"),
            })
            .describe(
                "decide the next node to route to based on the user message and current state"
            )
    );

    const result = await llmWithNextNodeRoutingOutput.invoke([
        {
            role: "system",
            content: `You are a routing controller for a travel-planning workflow. 
                Your only job is to decide which node should run next based on the 
                user’s latest message and the current conversation state.

                There are ONLY three valid routing targets:

                1. "placeDetail" 
                - Trigger this when the user asks about a place, location, attraction, 
                    sightseeing spot, tourist place, what to visit, things to do, 
                    or place-specific details.

                2. "hotelDetails"
                - Trigger this when the user asks for hotels, stays, rooms, lodging, 
                    bookings, prices, amenities, check-in/check-out, or accommodation details.

                3. "planner"
                - Default route for EVERYTHING ELSE.
                - Use this when the user asks for planning a trip, generating an itinerary, 
                    transportation, budget estimation, recommendations, or general travel help.
                - Use this when the user message is unclear or does not match category 1 or 2.

                RULES:
                - Output ONLY a JSON object with this exact structure:
                {
                    "next_node": "placeDetail" | "hotelDetails" | "planner"
                }

                - Do NOT add explanations, reasons, or additional text.
                - Do NOT invent new nodes.
                - Classify the intent strictly based on the user message meaning.
                - If the message contains multiple intents, choose the MOST SPECIFIC one.
                - If the message references hotels or places even indirectly, route accordingly.
                - Otherwise, use "planner".`,
        },
        lastMsg,
    ]);

    console.log("Router Node decided next node:", result.nextNode);
    return result.nextNode;
};
