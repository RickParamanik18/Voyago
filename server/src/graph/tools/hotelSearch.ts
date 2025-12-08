import { getJson } from "serpapi";
type searchParams = {
    q: string | null;
    check_in_date: string | null;
    check_out_date: string | null;
    adults: string | null;
};
export const hotelSearch = async ({
    q = null,
    check_in_date = null,
    check_out_date = null,
    adults = null,
}: searchParams) => {
    return new Promise((resolve, reject) => {
        getJson(
            {
                engine: "google_hotels",
                q,
                check_in_date,
                check_out_date,
                adults,
                currency: "INR",
                gl: "in",
                hl: "en",
                api_key: process.env.SERP_API_KEY,
            },
            (json: any) => {
                if (!json) {
                    reject("No data received from SerpAPI");
                } else {
                    resolve(json);
                }
            }
        );
    });
};
