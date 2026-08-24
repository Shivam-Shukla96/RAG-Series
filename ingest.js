import fs from "fs";
import { getOrCreateCollection, addDocuments, queryCollection, deleteCollection } from "./vectorstore.js";
import { embed } from "./embedder.js";

const filePath = "./docs/sample.txt";

const text = fs.readFileSync(filePath, "utf-8");

const chunkSize = 100;
const chunks = [];  

for (let i = 0; i < text.length; i += chunkSize) {
    chunks.push(text.slice(i, i + chunkSize));
}

const collection = await getOrCreateCollection("my-docs");
const embeddings = await Promise.all(chunks.map((chunk) => embed(chunk)));

const ids = chunks.map((_, i) => `chunk_${i}`);
const metadatas = chunks.map((_, i) => ({ chunkIndex: i, source: 'sample.txt' }));

await addDocuments(collection, ids, embeddings, chunks, metadatas);
console.log("Documents ingested successfully!");