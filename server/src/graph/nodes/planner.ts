import z from "zod";
import llm from "../llm/index.js";
import { TravelState } from "../state.js";
import { AIMessage } from "@langchain/core/messages";

export const planner = async (state: typeof TravelState.State) => {
    const userMessages = state.messages;
    const lastMsg = userMessages[userMessages.length - 1];

    const result = await llm.invoke([
        {
            role: "system",
            content: `You are the Planner Agent.  
                Your task is to understand the user's travel-related request and generate clear, structured, and actionable travel planning output.

                The user may ask for:
                - Planning a trip
                - Creating a full or partial itinerary
                - Transportation options and routes
                - Budget estimation
                - Attraction or activity recommendations
                - Food, stay, and local tips
                - Best time to visit or general destination guidance
                - Any open-ended travel help

                Guidelines:
                1. Always ask clarifying questions if the user’s query is incomplete.
                2. Break down complex tasks into structured steps.
                3. Provide information in a concise, practical, and helpful way.
                4. If the user already specified location(s), dates, group size, or budget, use them directly without asking again.
                5. Maintain a friendly, knowledgeable travel-expert tone.
                6. The output must always be returned as a plain text message (no JSON).
                7. Do NOT route to any other node. Handle all travel-planning queries yourself unless explicitly asked for place details or hotel booking.

                Your goal: give the user the most useful, organized, and actionable travel plan or guidance possible.
                here are the details of the user preferences: 
                1. Place - ${state.place || "Not specified"}
                2. participant details - ${
                    state.participants?.join(", ") || "Not specified"
                }
                3. Trip start date - ${state.trip_start_date || "Not specified"}
                4. Trip end date - ${state.trip_end_date || "Not specified"}
                5. Hotel preferences - ${
                    state.hotelResults?.length
                        ? JSON.stringify(state.hotelResults[0])
                        : "Not specified"
                }
                `,
        },
        ...userMessages,
    ]);

    return {
        messages: [new AIMessage(result.content)],
    };
};
