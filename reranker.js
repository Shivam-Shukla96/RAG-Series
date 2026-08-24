import { ollama } from './client.js';

/**
 * Reranks candidate documents using the LLM as a cross-encoder.
 * Scores each (query, document) pair for relevance, then sorts by score.
 * Call this AFTER hybrid search returns top-N candidates.
 */
export async function rerank(query, documents, topK = 5) {
    const scored = await Promise.all(
        documents.map(async (doc, i) => {
            const prompt = `On a scale of 1-10, rate how relevant this document is to the query.
Query: "${query}"
Document: "${doc}"
Reply with ONLY a single number from 1 to 10.`;

            const res = await ollama.chat({
                model: 'gpt-oss:120b-cloud',
                messages: [{ role: 'user', content: prompt }]
            });
            const score = parseInt(res.message.content.trim()) || 0;
            return { index: i, document: doc, score };
        })
    );

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, topK);
}