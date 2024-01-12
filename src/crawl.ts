function normalizeUrl(url: string) {
	const newObj = new URL(url);
	return url.slice(newObj.protocol.length + 2);
}

normalizeUrl("https://www.google.com");
