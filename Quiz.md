
🧪 Exercise & Quiz
Exercise: Modify retriever.js to also accept a timeFilter parameter ('1d', '1w', '1m') and pass it to webSearch. Test with a query that would return different results for different time filters.

Quiz (answer mentally or in comments):

1. What does the R in RAG stand for, and what does it do in your pipeline?
2. Why do we use process.stdout.write() instead of console.log() for streaming?
3. If the model hallucinates an answer not present in the retrieved context, what prompt engineering technique can reduce this?
4. What is the difference between ollama.chat() and ollama.chat({ stream: true })?




✅ Answers to Quiz
Q1: What does the R in RAG stand for, and what does it do in your pipeline?
RAG = Retrieval-Augmented Generation. The R (Retrieval) fetches relevant documents from a knowledge source (web search in this case) and provides them as context to the LLM, allowing it to answer questions based on that specific information instead of only its training data.

Q2: Why do we use process.stdout.write() instead of console.log() for streaming?
process.stdout.write() writes directly to the standard output stream without adding an automatic newline character, allowing tokens to appear immediately as they arrive from the model. console.log() buffers output and adds a newline, which would break the continuous streaming effect.

Q3: If the model hallucinates an answer not present in the retrieved context, what prompt engineering technique can reduce this?
Using a strict system prompt that instructs the model to answer ONLY from the provided context and to say "I don't know" if the answer isn't there is the key technique. Explicitly limiting the model's knowledge source reduces hallucinations. Strict Context Grounding (Negative Constraint), Source Citation / Grounding Verification, Role & Persona Framing.

Q4: What is the difference between ollama.chat() and ollama.chat({ stream: true })?
ollama.chat() waits for the complete response from the model before returning it (non-streaming). ollama.chat({ stream: true }) returns an async iterator that yields response chunks as they become available, enabling real-time streaming of the model's output.