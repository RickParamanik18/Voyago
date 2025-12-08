import { StateGraph, START, END } from "@langchain/langgraph";
import { TravelState } from "./state.js";
import { placeDetailNode } from "./nodes/placeDetail.node.js";
import { hotelDetails } from "./nodes/hotelDetails.js";
import { MemorySaver } from "@langchain/langgraph";
const checkpointer = new MemorySaver();

// export const agent = new StateGraph(TravelState)
//     .addNode("placeDetailNode", placeDetailNode)
//     .addEdge(START, "placeDetailNode")
//     .addEdge("placeDetailNode", END)
//     .compile();

export const agent = new StateGraph(TravelState)
    .addNode("hotelDetails", hotelDetails)
    .addEdge(START, "hotelDetails")
    .addEdge("hotelDetails", END)
    .compile({ checkpointer });
