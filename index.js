import ollama from "./client.js";
import { getContext } from "./retriever.js";
import { printResponse } from "./helper.js";
import { buildMessage } from "./augmenter.js";
import { MODEL_NAME } from "./config.js";

async function getResponse(query) {

  // 1. get the relevant context from DB, file, webSearch etc. (Retrieval)
  const context = await getContext(query);

  // 2. building final msg to be sent to the LLM (Augmentation)
  const message = buildMessage(query, context)
  

  // 3. call ollama chat to get the response in streams. (Generation)
  const stream = await ollama.chat({
    model: MODEL_NAME,
    messages: message,
    stream: true
  });

  // 4. print the response in streams
  await printResponse(stream)

}

// later we will receive this query from frontend
const userQuery = "tell me about the current indian cricket team and their current form"

// call the function getResponse() to get the response for the query
getResponse(userQuery).catch(console.error);