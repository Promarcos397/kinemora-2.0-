import { streamService } from './services/stream/StreamService.js';

async function test() {
    console.log("Testing StreamService with Fallback Logic...");

    // 1. Search
    console.log("Searching for 'Inception'...");
    // This should try Goku first, then FlixHQ, etc.
    const results = await streamService.search("Inception");
    console.log(`Found ${results.length} results.`);

    if (results.length > 0) {
        const firstResult = results[0];
        console.log("First result provider:", firstResult.provider); // Should be 'Goku' or 'FlixHQ'
        console.log("First result title:", firstResult.title);

        // 2. Get Info (passing provider)
        const firstId = firstResult.id;
        const providerName = firstResult.provider;

        console.log(`Fetching info for ${firstId} using ${providerName}...`);
        const info = await streamService.getInfo(firstId, providerName);
        console.log("Info title:", info?.title);

        // 3. Get Stream (passing provider)
        if (info && info.episodes && info.episodes.length > 0) {
            const episodeId = info.episodes[0].id;
            console.log(`Fetching stream for episode ${episodeId} using ${providerName}...`);
            const stream = await streamService.getStreamLink(episodeId, firstId, providerName);

            if (stream) {
                console.log("Stream found!");
                console.log("URL:", stream.sources[0]?.url);
                console.log("Headers:", stream.headers);
            } else {
                console.log("Stream NOT found.");
            }
        } else {
            console.log("No episodes found.");
        }
    } else {
        console.log("No results found from ANY provider.");
    }
}

test();
