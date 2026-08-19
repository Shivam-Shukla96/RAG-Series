import 'dotenv/config';


const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;
const OLLAMA_HOST = process.env.OLLAMA_HOST;
const MODEL_NAME = process.env.MODEL_NAME;

export { OLLAMA_API_KEY, OLLAMA_HOST, MODEL_NAME }; 