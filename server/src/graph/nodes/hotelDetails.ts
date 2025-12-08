import z from "zod";
import llm from "../llm/index.js";
import { TravelState } from "../state.js";
import { hotelSearch } from "../tools/hotelSearch.js";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";
import { interrupt, NodeInterrupt } from "@langchain/langgraph";
import { agent } from "../index.js";

interface RefinedHotel {
    name: string | null;
    type: string;
    price: number | null;
    rating: number | null;
    reviews: number | null;
    amenities: string[];
    latitude: number | null;
    longitude: number | null;
    image: string | null;
    bookingLink: string | null;
    freeCancellation: boolean;
}
interface SerpAdsHotel {
    name?: string;
    extracted_price?: number;
    overall_rating?: number;
    reviews?: number;
    amenities?: string[];
    gps_coordinates?: {
        latitude?: number;
        longitude?: number;
    };
    thumbnail?: string;
    link?: string;
    free_cancellation?: boolean;
}
interface SerpPropertyHotel {
    name?: string;
    type?: string;
    rate_per_night?: {
        extracted_lowest?: number;
    };
    overall_rating?: number;
    reviews?: number;
    amenities?: string[];
    gps_coordinates?: {
        latitude?: number;
        longitude?: number;
    };
    images?: {
        original_image?: string;
    }[];
    link?: string;
    serpapi_property_details_link?: string;
}
interface SerpApiHotelResponse {
    ads?: SerpAdsHotel[];
    properties?: SerpPropertyHotel[];
}

export function refineHotelResults(
    serpApiResponse: SerpApiHotelResponse
): RefinedHotel[] {
    const refinedResults: RefinedHotel[] = [];

    if (Array.isArray(serpApiResponse.properties)) {
        serpApiResponse.properties.forEach((property) => {
            refinedResults.push({
                name: property.name ?? null,
                type: property.type ?? "property",
                price: property.rate_per_night?.extracted_lowest ?? null,
                rating: property.overall_rating ?? null,
                reviews: property.reviews ?? null,
                amenities: property.amenities ?? [],
                latitude: property.gps_coordinates?.latitude ?? null,
                longitude: property.gps_coordinates?.longitude ?? null,
                image: property.images?.[0]?.original_image ?? null,
                bookingLink:
                    property.link ??
                    property.serpapi_property_details_link ??
                    null,
                freeCancellation: false,
            });
        });
    }

    if (Array.isArray(serpApiResponse.ads)) {
        serpApiResponse.ads.forEach((hotel) => {
            refinedResults.push({
                name: hotel.name ?? null,
                type: "hotel",
                price: hotel.extracted_price ?? null,
                rating: hotel.overall_rating ?? null,
                reviews: hotel.reviews ?? null,
                amenities: hotel.amenities ?? [],
                latitude: hotel.gps_coordinates?.latitude ?? null,
                longitude: hotel.gps_coordinates?.longitude ?? null,
                image: hotel.thumbnail ?? null,
                bookingLink: hotel.link ?? null,
                freeCancellation: hotel.free_cancellation ?? false,
            });
        });
    }

    return refinedResults.slice(0, 5);
}

const getHotelBookingParams = async (lastMsg: BaseMessage) => {
    const llmWithParamsOutput = llm.withStructuredOutput(
        z
            .object({
                place: z
                    .string()
                    .describe(
                        "this is the place name to be searched on the web "
                    ),
                check_in_date: z
                    .string()
                    .describe(
                        "this is the date user wants to check-out of hotel"
                    ),
                check_out_date: z
                    .string()
                    .describe(
                        "this is the date user wants to check-in in hotel"
                    ),
                adults: z
                    .string()
                    .describe(
                        "this is the number of people will be staying in hotel"
                    ),
            })
            .describe(
                "extract place name hotel booking, number of people will stay in hotel,check_in_date and check_out_date from the user input"
            )
    );

    return await llmWithParamsOutput.invoke([
        {
            role: "system",
            content: `You are a structured data extraction assistant. Your ONLY task is to read a single user message and output a JSON object with exactly these fields:
                {
                "place": "", 
                "check_in_date": "", 
                "check_out_date": "", 
                "adults": ""
                }
                Rules:
                1. place -> place name for hotels search.. If the user mentions location capture it here. If missing, set "".
                2. check_in_date and check_out_date -> MUST be in YYYY-MM-DD format when a date (or date range) can be parsed from the user's text. If the user gives no date information, set "".
                3. adults -> number of adults as a string (e.g. "2"). If missing, set "".
                4. You may interpret natural-language and relative date phrases into concrete dates. Supported patterns include:
                - explicit dates (e.g. "25th Dec 2025", "Dec 25", "2025-12-25")
                - ranges using "to", "until", "through", "till" (e.g. "25 Dec to 27 Dec")
                - durations phrased as "for N nights/days", "next N days", "N-day stay" (interpret duration as nights unless user explicitly says otherwise)
                - relative words: "today", "tomorrow", "day after tomorrow", "next week", "in N days"
                - ordinal words: "1st", "2nd", "3rd", "25th", etc.
                5. When the year is not given, assume the nearest future occurrence of that date (e.g., if today is 2025-12-06 and user requests "25 Dec", interpret as 2025-12-25).
                6. For phrases like "from <date> to the next N days" or "from <date> for N days":
                - treat <date> as check_in_date
                - treat check_out_date = check_in_date + N days
                - Example: "from 25 Dec for the next 2 days" → check_in_date = 2025-12-25, check_out_date = 2025-12-27
                7. For "for N nights" interpret check_out_date = check_in_date + N nights.
                8. Do NOT invent dates when none are present. If parsing fails or ambiguous, set the date fields to "".
                9. Do NOT output any text other than the single JSON object.
                10. Output must be valid JSON with exactly these four keys (order not important).`,
        },
        lastMsg,
    ]);
};

export const hotelDetails = async (state: typeof TravelState.State) => {
    const userMessages = state.messages;
    const lastMsg = userMessages[userMessages.length - 1];

    const params = await getHotelBookingParams(lastMsg);

    let finalMsg = lastMsg.content;
    if (!params.place && state.place) {
        params.place = state.place;
        finalMsg += ` I want to book hotel in ${state.place}.`;
    }
    if (!params.adults && state.participants?.length) {
        params.adults = "" + state.participants?.length;
        finalMsg += ` There will be ${state.participants?.length} adults.`;
    }

    let missing = [];
    for (const [key, value] of Object.entries(params)) {
        if (!value) {
            missing.push(key);
        }
    }

    const hitlMsg = await llm.invoke([
        {
            role: "system",
            content: `You are a message generator for a human-in-the-loop step inside a hotel-booking workflow.

                You will be given an array of missing fields, for example:
                ["place", "check_in_date", "check_out_date", "adults"]

                Your job is to produce a single, clear, human-friendly message asking the user to provide ONLY those missing fields.

                Rules:
                - Ask for each missing field explicitly.
                - Use natural language, not JSON.
                - Do not add any extra fields.
                - Do not guess values.
                - If multiple fields are missing, combine them in one message.
                - Keep the tone polite and simple.

                Field meanings:
                - "place" → the place or location they want hotels in.
                - "check_in_date" → the date they will check in.
                - "check_out_date" → the date they will check out.
                - "adults" → how many adults will stay.

                Output format:
                - A single human-facing message asking for the missing information.
                - No JSON.
                - No explanations.`,
        },
        {
            role: "human",
            content: missing.join(", "),
        },
    ]);
    const humanResponse = await interrupt(hitlMsg.content);

    const updatedParams = await getHotelBookingParams(
        new HumanMessage(finalMsg + " " + humanResponse)
    );

    const hotelResults = [
        {
            name: "Spacious 3BHK House opp South City Mall",
            type: "vacation rental",
            price: 4541,
            rating: 4.4,
            reviews: 12,
            amenities: [
                "Air conditioning",
                "Balcony",
                "Ironing board",
                "Kitchen",
                "Microwave",
                "Oven stove",
                "Pet-friendly",
                "Smoke-free",
                "Cable TV",
                "Washer",
                "Free parking",
                "Paid Wi-Fi",
            ],
            latitude: 22.502609252929688,
            longitude: 88.35895538330078,
            image: "https://xx.bstatic.com/xdata/w/hotel/840x460_watermarked_standard/UlZBBopCc2ozhS09BZ6HMd7hekhZvuiqAXv41CB6V7cXIlGmURptUOJ67Xhvy8DvpKpLHzACQqqoXb1e5ODQd28G_lPBLKLPDR0cYMu8tM0PdhL91FwXGA==.jpg",
            bookingLink:
                "https://serpapi.com/search.json?adults=4&check_in_date=2025-12-25&check_out_date=2025-12-27&children=0&currency=INR&engine=google_hotels&gl=in&hl=en&property_token=ChkQnMGUrfHY4K4eGg0vZy8xMXhreDR4OXA0EAI&q=Hotels+in+kolkata",
            freeCancellation: false,
        },
    ];

    return {
        messages: [
            new AIMessage(hitlMsg.content),
            new HumanMessage(humanResponse),
            new AIMessage(
                `Found ${
                    hotelResults.length
                } hotels for your stay:\n ${JSON.stringify(hotelResults)}.`
            ),
        ],
        hotelResults,
    };
};
