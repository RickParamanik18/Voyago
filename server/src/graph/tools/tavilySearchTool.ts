import { TavilyCrawl, TavilyExtract, TavilySearch } from "@langchain/tavily";

export const tavilySearchTool = new TavilySearch({
    maxResults: 3,
    includeImages: true,
});

export const tavilyExtractTool = new TavilyExtract({
    extractDepth: "basic",
    // includeImages: false
});
