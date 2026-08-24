import { cloudOllama } from './client.js';
import { embed } from './embedder.js';
import { getOrCreateCollection, queryCollection } from './vectorstore.js';
import natural from 'natural';

const TfIdf = natural.TfIdf;

// --- BM25-style keyword search using TF-IDF from the `natural` package ---
function bm25Search(query, documents, k = 10) {
    const tfidf = new TfIdf();
    documents.forEach(doc => tfidf.addDocument(doc));

    const scores = [];
    tfidf.tfidfs(query, (i, measure) => {
        scores.push({ index: i, score: measure, document: documents[i] });
    });


    return scores
        .sort((a, b) => b.score - a.score)
        .slice(0, k);
}


// --- Reciprocal Rank Fusion: merges two ranked lists into one ---
function reciprocalRankFusion(vectorDocs, bm25Results, k = 60) {
    const scores = new Map();

    // Score vector search results by rank position
    vectorDocs.forEach((doc, rank) => {
        scores.set(doc, (scores.get(doc) || 0) + 1 / (k + rank + 1));
    });

    // Score BM25 results by rank position
    bm25Results.forEach((item, rank) => {
        const doc = item.document;
        scores.set(doc, (scores.get(doc) || 0) + 1 / (k + rank + 1));
    });

    return [...scores.entries()]
        .sort(([, a], [, b]) => b - a)
        .map(([document, score]) => ({ document, score }));
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

export async function hybridSearch(query, k = 60) {
    // 1. Vector search — semantic similarity
    const vectorResults = await vectorSearch(query, 3);

    // 2. BM25 keyword search over retrieved documents
    const bm25Results = bm25Search(query, vectorResults);
    // 3. Reciprocal Rank Fusion to merge scores
    return reciprocalRankFusion(vectorResults, bm25Results, k);
}


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

async function getContext(query) {
    // Run both searches in parallel
    const [localResult, webResult] = await Promise.allSettled([
        hybridSearch(query),
        webSearch(query, 3)
    ]);

    const localDocs = localResult?.status === 'fulfilled' ? localResult.value : [];
    const webSources = webResult?.status === 'fulfilled' ? webResult.value : [];

    if (!localDocs) throw new Error("Local search failed");
    let context = "";

    // 1. Append Local Document Context
    if (localDocs && localDocs.length > 0) {
        context += "=== Local Document Context ===\n";
        localDocs.forEach((doc, idx) => {
            const text = typeof doc === 'string' ? doc : doc.document;
            context += `[Doc ${idx + 1}]:\n${text}\n\n`;
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