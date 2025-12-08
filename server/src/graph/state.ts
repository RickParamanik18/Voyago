import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

interface ParticipantSchema {
    id: string;
    name: string;
}

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

export const TravelState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (prev, next) => [...prev, ...next],
        default: () => [],
    }),
    place: Annotation<string>,
    participants: Annotation<ParticipantSchema[]>,
    trip_start_date: Annotation<string>,
    trip_end_date: Annotation<string>,
    hotelResults: Annotation<RefinedHotel[]>,
});
