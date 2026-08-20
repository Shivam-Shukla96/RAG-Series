Quiz:

Why can't you just use keyword search (like CTRL+F) instead of vector similarity search?
If two chunks from different documents return similar embeddings — is that a problem or a feature?
What happens if your chunk size is too small? Too large?
What embedding model does your code use, and why does the choice of embedding model matter?



--- Answers ---

### **Q1: Why can't you just use keyword search (like CTRL+F) instead of vector similarity search?**

* **Semantic Understanding vs. Exact String Matching**:
  * Keyword search (CTRL+F / lexical search) only matches literal words and characters. If a user asks *"What is a neural network?"*, keyword search will miss chunks in `sample.txt` that discuss *"deep learning architectures"*, *"perceptrons"*, or *"brain-inspired AI models"* unless those exact words appear.
  * Vector similarity search (via `embed(query)` in [embedder.js](file:///c:/Users/himanshu%20shukla/Desktop/my-projects/ollama-js/embedder.js) and ChromaDB in [vectorstore.js](file:///c:/Users/himanshu%20shukla/Desktop/my-projects/ollama-js/vectorstore.js)) projects concepts into a high-dimensional mathematical space (cosine / euclidean distance). It captures the **meaning and intent** behind queries, handling synonyms, typos, paraphrasing, and cross-lingual concepts.

---

### **Q2: If two chunks from different documents return similar embeddings — is that a problem or a feature?**

* **It is a fundamental Feature!**
  * Similar embeddings mean the two chunks discuss **semantically related topics**, even if they come from separate source files (e.g., a documentation file vs. a web search result).
  * In your project, when [retriever.js](file:///c:/Users/himanshu%20shukla/Desktop/my-projects/ollama-js/retriever.js) queries ChromaDB, vector similarity groups all chunks addressing the user's question together, regardless of which document or chunk index they originated from. This allows the LLM in [augmenter.js](file:///c:/Users/himanshu%20shukla/Desktop/my-projects/ollama-js/augmenter.js) to synthesize information across multiple sources.

---

### **Q3: What happens if your chunk size is too small? Too large?**

In [ingest.js](file:///c:/Users/himanshu%20shukla/Desktop/my-projects/ollama-js/ingest.js), you chunk documents (`chunkSize = 100` characters):

* **If Chunk Size is Too Small (e.g., 20–50 chars)**:
  * **Loss of Semantic Context**: Chunks get fragmented mid-sentence (e.g., losing subject-verb context or qualifiers).
  * **Isolated meaning**: When embedded, individual phrases lack sufficient context, making embeddings noisy or ambiguous.
  * **Incomplete context for LLM**: ChromaDB returns tiny snippets that don't contain enough information for the LLM to formulate a full answer.

* **If Chunk Size is Too Large (e.g., 4000+ chars)**:
  * **Diluted Embeddings**: The vector embedding tries to average out multiple different topics in a single vector, lowering similarity scores for specific queries.
  * **Context Window Waste & Noise**: Injecting oversized chunks into `buildMessage()` fills the LLM prompt with irrelevant text, increasing token costs and raising the risk of hallucinations.

*(Optimal practice: 300–800 tokens / 500–1500 characters with overlapping boundaries, e.g. 50–100 char overlap).*

---

### **Q4: What embedding model does your code use, and why does the choice of embedding model matter?**

* **Model Used in this Project**:
  * Your code uses **`nomic-embed-text`** (running locally on `localOllama` via port `11434`).

* **Why the Choice of Embedding Model Matters**:
  1. **Dimensionality & Vector Space Consistency**: Every model produces vectors of a specific fixed dimension (e.g., 768 dimensions for `nomic-embed-text`). You **must use the exact same model** for both ingestion (`ingest.js`) and retrieval (`embedder.js`); otherwise vector distances in ChromaDB become meaningless.
  2. **Context Length**: `nomic-embed-text` supports up to an 8192-token context window, allowing longer text chunks to be embedded without truncation.
  3. **Domain & Task Performance**: Specialized embedding models excel at semantic retrieval, code retrieval, or multilingual data. Matching the model to your data domain dramatically improves search accuracy.
  4. **Latency & Resource Usage**: Local models like `nomic-embed-text` run fast on local CPU/GPU and incur zero API cost or rate limits.