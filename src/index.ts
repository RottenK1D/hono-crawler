import { crawlPage } from "./crawl";

async function main() {
	// validate arguments and exit if invalid number of arguments
	if (process.argv.length !== 3) {
		console.log("No URL provided");
		return process.exit(1);
	}

	if (process.argv.length > 3) {
		console.log("Too many arguments");
		return process.exit(1);
	}

	// validate url and exit if invalid
	const url = process.argv[2];

	// Call crawlPage and log the result
	try {
		const content = await crawlPage(url);
		if (content) {
			console.log(content);
		} else {
			console.log("No content found");
		}
	} catch (error) {
		console.error("Error while crawling: ", error);
	}
}

main();
