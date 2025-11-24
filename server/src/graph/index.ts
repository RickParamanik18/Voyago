import { StateGraph, START, END } from "@langchain/langgraph";
import { TravelState } from "./state.js";
import { placeDetailNode } from "./nodes/placeDetail.node.js";

export const agent = new StateGraph(TravelState)
    .addNode("placeDetailNode", placeDetailNode)
    .addEdge(START, "placeDetailNode")
    .addEdge("placeDetailNode", END)
    .compile();
