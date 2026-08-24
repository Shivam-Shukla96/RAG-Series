import 'dotenv/config';

export const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
export const OLLAMA_HOST_CLOUD = process.env.OLLAMA_HOST_CLOUD || 'https://ollama.com';
export const OLLAMA_HOST_LOCAL = process.env.OLLAMA_HOST_LOCAL || 'http://127.0.0.1:11434';

export const MODEL_NAME_LOCAL = process.env.MODEL_NAME_LOCAL || 'qwen2.5-coder:3b';
export const MODEL_NAME_EMBED = process.env.MODEL_NAME_EMBED || 'nomic-embed-text';
