import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash",
    temperature: 0,
    // maxRetries: 2,
    streaming: true,
});

export default llm as any;
