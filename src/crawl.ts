import * as cheerio from "cheerio";

interface Pages {
	[key: string]: number;
}

// MAX_DEPTH is the maximum depth of the crawler
const MAX_DEPTH = 3;

// crawlPage fetches the html body of the url and returns it as a string
export async function crawlPage(
	baseUrl: string,
	currentUrl: string,
	pages: Pages,
	depth = 0,
): Promise<Pages> {
	// validate baseUrl and currentUrl and exit if invalid
	function validateBaseUrl(baseUrl: string, currentUrl: string): boolean {
		const baseUrlObj = new URL(baseUrl);
		const currentUrlObj = new URL(currentUrl);
		return baseUrlObj.hostname === currentUrlObj.hostname;
	}

	if (!validateBaseUrl(baseUrl, currentUrl)) {
		console.error("Invalid base url");
	}

	// check if currentUrl is already crawled and exit if true
	const normalizedUrl = normalizeUrl(currentUrl);
	if (normalizedUrl !== null && pages[normalizedUrl] > 0) {
		pages[normalizedUrl] += 1;
		return pages;
	}

	if (normalizedUrl !== null) {
		pages[normalizedUrl] = 1;
	}

	console.log(`Crawling: ${currentUrl}`);

	try {
		const response = await fetch(currentUrl);

		//check response status and exit if not ok
		if (!response.ok) {
			console.error(
				`Failed to crawl: ${currentUrl}. Status: ${response.status}`,
			);
		}

		//check content type and exit if not html
		const contentType = response.headers.get("content-type");
		if (!contentType || !contentType.includes("text/html")) {
			console.error(
				`Failed to crawl: ${currentUrl}. Content-Type: ${contentType}`,
			);
		}

		//get all urls from html body and crawl them
		const htmlBody = await response.text();
		const urls = getUrls(htmlBody, baseUrl) as string[];

		// recursively crawl all urls
		if (depth < MAX_DEPTH)
			for (const url of urls) {
				pages = await crawlPage(baseUrl, url, pages, depth + 1);
			}
	} catch (error) {
		console.error(`Error while fetching: ${currentUrl}. Error: ${error}`);
	}

	return pages;
}

// getUrls returns all urls from htmlBody with baseUrl
function getUrls(htmlBody: string, baseUrl: string): string[] | null {
	const $ = cheerio.load(htmlBody);
	const urls = $("a")
		.map((i, link) => {
			const href = $(link).attr("href");
			if (!href) {
				return null;
			}

			try {
				// Check if it's a full valid URL or a valid relative path
				return new URL(href, baseUrl).href;
			} catch {
				return null;
			}
		})
		.get()
		.filter((url) => url !== null); //Filter out null values

	return urls;
}

// normalizeUrl returns a normalized url or null if the url is invalid
function normalizeUrl(url: string): string | null {
	if (!url) {
		console.error("URL is empty");
		return null;
	}

	try {
		const newObj = new URL(url);
		const normalizedUrl = url.slice(newObj.protocol.length + 2);

		if (normalizedUrl.endsWith("/")) {
			return normalizedUrl.slice(0, -1);
		}

		return normalizedUrl;
	} catch (error) {
		console.error("URL is invalid: ", error);
		return null;
	}
}
