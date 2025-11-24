import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

export type ParticipantSchema = {
    id: string;
    name: string;
    preference: string[];
};

export type DestinationSchema = {
    name: string;
    dates: string[];
    description: string;
    weather: string;
};

export const TravelState = Annotation.Root({
    call: Annotation<String>(),
    messages: Annotation<BaseMessage[]>({
        reducer: (prev, next) => [...prev, ...next],
        default: () => [],
    }),

    participants: Annotation<ParticipantSchema[]>({
        reducer: (prev, next) => [...prev, ...next],
        default: () => [],
    }),

    destination: Annotation<DestinationSchema>({
        reducer: (_, next) => next,
        default: () => ({
            name: "",
            dates: [],
            description: "",
            weather: "",
        }),
    }),
});
