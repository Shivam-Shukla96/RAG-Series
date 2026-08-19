import { Ollama } from 'ollama';
import { OLLAMA_API_KEY, OLLAMA_HOST } from './config.js';

const ollama = new Ollama({
    host: OLLAMA_HOST,
    headers: { 'Authorization': 'Bearer ' + OLLAMA_API_KEY },

});

export default ollama;