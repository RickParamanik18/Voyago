import { StateGraph, START, END } from "@langchain/langgraph";
import { TravelState } from "./state.js";
import { placeDetailNode } from "./nodes/placeDetail.node.js";
import { hotelDetails } from "./nodes/hotelDetails.js";
import { MemorySaver } from "@langchain/langgraph";
import { routerNode } from "./nodes/routerNode.js";
import { planner } from "./nodes/planner.js";
const checkpointer = new MemorySaver();

export const agent = new StateGraph(TravelState)
    .addNode("placeDetail", placeDetailNode)
    .addNode("hotelDetails", hotelDetails)
    .addNode("planner", planner)
    .addConditionalEdges(START, routerNode, [
        "placeDetail",
        "hotelDetails",
        "planner",
    ])
    .addEdge("placeDetail", END)
    .addEdge("hotelDetails", END)
    .compile({ checkpointer });
