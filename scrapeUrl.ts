import { serve } from "https://deno.land/std/http/server.ts";

/**
 * Scrapes the content of a given URL and returns it as a string.
 * Uses Deno's standard library server functions.
 * @param url The URL to scrape
 * @returns Promise<string> The content of the URL
 * @throws Error if the URL is invalid or the request fails
 */
export async function scrapeUrl(url: string): Promise<string> {
    try {
        const response = await fetch(url, {
            headers: {
                "User-Agent": "Deno/1.0",
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
        }

        const content = await response.text();
        return content;
    } catch (error) {
        console.error(`Error scraping URL ${url}:`, error);
        throw error;
    }
}
