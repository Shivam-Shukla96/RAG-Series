import { Ollama } from 'ollama';
import { OLLAMA_API_KEY, OLLAMA_HOST_CLOUD, OLLAMA_HOST_LOCAL } from './config.js';

// Local client for embeddings & local models
const localOllama = new Ollama({
    host: OLLAMA_HOST_LOCAL,
});

// Cloud client for Web Search and Cloud LLMs
const cloudOllama = new Ollama({
    host: OLLAMA_HOST_CLOUD,
    headers: OLLAMA_API_KEY ? { 'Authorization': `Bearer ${OLLAMA_API_KEY}` } : {},
});

export { cloudOllama, localOllama };