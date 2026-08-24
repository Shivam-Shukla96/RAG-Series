import { embed } from './embedder.js';

function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, v) => sum + v * v, 0));
    const magB = Math.sqrt(b.reduce((sum, v) => sum + v * v, 0));
    return dot / (magA * magB);
}

export async function semanticChunk(text, threshold = 0.75) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const embeddings = await Promise.all(sentences.map(embed));
    const chunks = [];
    let currentChunk = [sentences[0]];

    for (let i = 1; i < sentences.length; i++) {
        const sim = cosineSimilarity(embeddings[i - 1], embeddings[i]);
        if (sim < threshold) {
            chunks.push(currentChunk.join(' '));
            currentChunk = [];
        }
        currentChunk.push(sentences[i]);
    }
    if (currentChunk.length) chunks.push(currentChunk.join(' '));
    return chunks;
}