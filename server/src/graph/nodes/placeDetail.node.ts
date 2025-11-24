import { placeDetailPrompt } from "../templates/placeDetail.template.js";
import llm from "../llm/index.js";

export const placeDetailNode = async (state: any) => {
    const prompt = await placeDetailPrompt.invoke({
        query: "is there trum in bangalore?",
    });

    const result = await llm.invoke(prompt);
    return {
        call: result.content,
    };
};
