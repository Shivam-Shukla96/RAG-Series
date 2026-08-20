import { ChromaClient } from "chromadb";

const chromaClient = new ChromaClient({
    host : "localhost",
    port : 8000
});



export async function getOrCreateCollection(name) {
    return await chromaClient.getOrCreateCollection({
        name: name,
        embeddingFunction: null,
    });
}   

export async function addDocuments(collection, ids, embeddings, documents, metadatas) {
    await collection.upsert({ ids, embeddings, documents, metadatas });
}

export async function queryCollection(collection, queryEmbedding, nResults = 5) {
    return await collection.query({ queryEmbeddings: [queryEmbedding], nResults });
}

export async function deleteCollection(name) {
    return await chromaClient.deleteCollection({ name });
}

