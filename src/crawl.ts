import * as cheerio from "cheerio";

const $ = cheerio.load(`<div><a href="://www.google.com">Google</a></div>`);
const url = $("a").attr("href") as string;

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

if (url) {
	const normalizedUrl = normalizeUrl(url);
	console.log(normalizedUrl);
} else {
	console.error("No URL found in the HTML.");
}
