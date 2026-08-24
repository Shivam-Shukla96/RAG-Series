import { cloudOllama } from './client.js';
import { embed } from './embedder.js';
import { getOrCreateCollection, queryCollection } from './vectorstore.js';

async function webSearch(query, numResults = 3) {
    try {
        const result = await cloudOllama.webSearch({
            query,
            maxResults: numResults,
            sort: 'relevance',
            time: '1w',
            safe: 'active',
            lang: 'en'
        });

        if (!result || !Array.isArray(result.results)) return [];
        return result.results;
    } catch (error) {
        console.warn("Web search error:", error.message);
        return [];
    }
}

async function vectorSearch(query, numResults = 3) {
    try {
        const collection = await getOrCreateCollection("my-docs");
        const queryEmb = await embed(query);
        const results = await queryCollection(collection, queryEmb, numResults);
        return results.documents?.[0] || [];
    } catch (error) {
        console.warn("Vector search error:", error.message);
        return [];
    }
}

async function getContext(query) {
    // Run both searches in parallel
    const [localResult, webResult] = await Promise.allSettled([
        vectorSearch(query, 3),
        webSearch(query, 3)
    ]);

    const localDocs = localResult?.status === 'fulfilled' ? localResult.value : [];
    const webSources = webResult?.status === 'fulfilled' ? webResult.value : [];

    let context = "";

    // 1. Append Local Document Context
    if (localDocs && localDocs.length > 0) {
        context += "=== Local Document Context ===\n";
        localDocs.forEach((doc, idx) => {
            context += `[Doc ${idx + 1}]:\n${doc}\n\n`;
        });
    }

    // 2. Append Web Search Context
    if (webSources && webSources.length > 0) {
        context += "=== Web Search Results ===\n";
        for (const src of webSources) {
            if (typeof src === 'string') {
                context += `${src}\n\n`;
            } else {
                context += src.title ? `Title : ${src?.title}\n` : "";
                context += src.url ? `URL : ${src?.url}\n` : "";
                context += src.content ? `Content : ${src?.content}\n\n` : "";
                context += src.snippet ? `Snippet : ${src?.snippet}\n\n` : "";
            }
        }
    }
    return context;
}

export { getContext, webSearch, vectorSearch };