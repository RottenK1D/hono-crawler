import * as cheerio from "cheerio";

// crawlPage fetches the html body of the url and returns it as a string
export async function crawlPage(url: string) {
	console.log(`Crawling: ${url}`);

	try {
		const response = await fetch(url);

		//check response status and exit if not ok
		if (!response.ok) {
			console.error(`Failed to crawl: ${url}. Status: ${response.status}`);
			return null;
		}

		//check content type and exit if not html
		const contentType = response.headers.get("content-type");
		if (!contentType || !contentType.includes("text/html")) {
			console.error(`Failed to crawl: ${url}. Content-Type: ${contentType}`);
			return null;
		}

		return await response.text();
	} catch (error) {
		console.error(`Error while fetching: ${url}. Error: ${error}`);
		return null;
	}
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

//exmaple usage of getUrls and normalizeUrl
const htmlBody = `<div><a href="/hello">Relative Link</a><a href="invalid">Google</a></div>`;
const baseUrl = "http://example.com";

// getUrls returns an array of urls
const urls = getUrls(htmlBody, baseUrl) as string[];

// normalizeUrl returns a normalized url or null if the url is invalid
for (const url of urls) {
	const normalizedUrl = normalizeUrl(url);
	if (normalizedUrl) {
		console.log(normalizedUrl);
	}
}
