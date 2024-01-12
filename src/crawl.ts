import * as cheerio from "cheerio";

// getUrls returns all urls from htmlBody with baseUrl
function getUrls(htmlBody: string, baseUrl: string): string[] {
	const $ = cheerio.load(htmlBody);
	const urls = $("a")
		.map((i, link) => new URL($(link).attr("href") || "", baseUrl).href)
		.get();

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
const htmlBody = `<div><a href="/path">Relative Link</a><a href="https://www.google.com">Google</a></div>`;
const baseUrl = "http://example.com";

const urls = getUrls(htmlBody, baseUrl);

for (const url of urls) {
	const normalizedUrl = normalizeUrl(url);
	if (normalizedUrl) {
		console.log(normalizedUrl);
	}
}
