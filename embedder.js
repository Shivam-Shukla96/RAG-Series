import { localOllama } from "./client.js";
import { MODEL_NAME_EMBED } from "./config.js";

export async function embed(text) {
    const res = await localOllama.embed({
        model: MODEL_NAME_EMBED,
        input: text,
    });

    return res.embeddings[0]; // returns the embedding vector for the input text
}
