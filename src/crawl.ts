function normalizeUrl(url: string): string | Error {
	if (!url) return new Error("URL is empty");

	try {
		const newObj = new URL(url);
		const normalizedUrl = url.slice(newObj.protocol.length + 2);

		if (normalizedUrl.endsWith("/")) {
			return normalizedUrl.slice(0, -1);
		}

		return normalizedUrl;
	} catch (error) {
		console.error(error);
		return new Error("URL is invalid");
	}
}

const a = normalizeUrl("https://www.google.com");
console.log(a);
