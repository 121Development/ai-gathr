/**
 * Scrapes the content of a given URL and returns it as a string.
 * @param url The URL to scrape
 * @returns Promise<string> The content of the URL
 * @throws Error if the URL is invalid or the request fails
 */
export async function scrapeUrl(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        return content;
    } catch (error) {
        console.error(`Error scraping URL ${url}:`, error);
        throw error;
    }
}
