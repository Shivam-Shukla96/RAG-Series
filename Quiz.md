# 🧪 RAG Quiz & Answers

---

### Q1: What is the key difference between BM25 and vector search? When does each perform better?

**Answer:**
- **Key Difference**:
  - **BM25 (Sparse / Lexical Retrieval)**: Matches exact words and keywords. It calculates scores based on Term Frequency (TF), Inverse Document Frequency (IDF), and document length normalization. It does not understand the meaning or context of words.
  - **Vector Search (Dense / Semantic Retrieval)**: Converts queries and text into high-dimensional vector embeddings. It measures the cosine similarity or distance between concepts in semantic vector space, capturing meaning and context regardless of exact wording.

- **When BM25 Performs Better**:
  - Exact keyword matching (e.g., error codes like `ERR_CONNECTION_REFUSED`, product SKUs, specific function names like `reciprocalRankFusion`).
  - Acronyms, rare domain-specific terms, and numbers/dates.
  - Short, precise search terms where semantic ambiguity isn't an issue.

- **When Vector Search Performs Better**:
  - Semantic and conceptual search (e.g., "ways to stay healthy" matching "tips for balanced diet and exercise").
  - Queries with synonyms, paraphrasing, or varying sentence structures.
  - Long, conversational queries where the overall intent matters more than specific keyword overlap.

---

### Q2: If a user searches "ML model training", should the query match a chunk that says "fitting a neural network"? Why would BM25 fail here but vector search succeed?

**Answer:**
- **Should it match?**: **Yes**. Conceptually and technically, "fitting a neural network" is a core form of "ML model training".
- **Why BM25 fails**:
  - BM25 relies strictly on exact token overlap.
  - The query terms `["ML", "model", "training"]` share **zero** vocabulary overlap with the chunk text `["fitting", "a", "neural", "network"]`.
  - Because no query terms appear in the document, BM25 assigns a score of `0`.
- **Why Vector Search succeeds**:
  - Modern embedding models are pre-trained on large language corpora where "machine learning", "neural network", "fitting", and "training" appear in identical contextual neighborhoods.
  - Their generated high-dimensional dense vectors point in very similar directions in embedding space, yielding a high cosine similarity score despite completely different vocabulary.

---

### Q3: What metadata fields would you add to chunks from a news article to enable useful filtering?

**Answer:**
To support structured filtering (pre-filtering and post-filtering) in a RAG pipeline, the following metadata fields are recommended:

1. **Temporal & Recency Metadata**:
   - `published_at` (ISO timestamp, e.g. `2026-08-25T00:00:00Z`): Filter by recency (e.g. "news from the past 7 days").
   - `updated_at`: To handle retractions or updated breaking news.
2. **Source & Provenance**:
   - `source_url`: Link to the original article for citation and verification.
   - `publisher` / `domain` (e.g., `reuters.com`, `techcrunch.com`): Filter by trusted news sources.
   - `author`: Filter by specific journalists or columnists.
3. **Categorization & Topic**:
   - `category` (e.g., `Technology`, `Politics`, `Economy`): Narrow queries down to specific sections.
   - `tags` / `keywords` (e.g., `["AI", "LLM", "OpenAI"]`): Quick tag-based exact matching.
4. **Structural & Chunk Context**:
   - `article_id`: Groups chunks belonging to the same article.
   - `chunk_index` & `total_chunks`: Identifies position (e.g. chunk 1 of 5) to know if context is in the headline/lead vs. body.
   - `section_type` (e.g., `headline`, `lead_paragraph`, `body`, `editorial`).
5. **Language & Access**:
   - `language` (e.g., `en`, `es`): Multi-lingual routing.
   - `is_paywalled` (boolean): Filter accessible content.

---

### Q4: Why is reranking done after retrieval rather than as part of the initial retrieval step?

**Answer:**
Reranking is separated into a two-stage retrieval pipeline (**Retrieve $\rightarrow$ Rerank**) due to the trade-off between **computational speed (latency)** and **scoring accuracy (precision)**:

1. **Bi-Encoder (Initial Retrieval) vs. Cross-Encoder (Reranker)**:
   - **Stage 1 (Bi-Encoder / Vector & BM25 Search)**:
     - Query and documents are embedded *independently* ahead of time.
     - Fast vector similarity (using ANN algorithms like HNSW) can search through **millions of documents in single-digit milliseconds**.
     - *Limitation*: Because query and document are embedded separately, subtle cross-token interactions are lost.
   - **Stage 2 (Cross-Encoder / Reranker)**:
     - The query and candidate chunk are passed *together* into a transformer model (`[CLS] Query [SEP] Document [SEP]`).
     - Full cross-attention evaluates how every word in the query interacts with every word in the document, producing a much higher quality relevance score.
     - *Limitation*: Extremely computationally expensive ($O(L^2)$ transformer forward pass per query-document pair).

2. **Why they are combined sequentially**:
   - Running a Cross-Encoder over 100,000+ chunks in a database for every user query would take minutes and is computationally infeasible.
   - **Two-Stage Strategy**:
     1. **Retrieval**: High recall, low compute $\rightarrow$ quickly narrow down 1,000,000 items to top 25–50 candidates.
     2. **Reranking**: High precision, higher compute $\rightarrow$ re-score only those top 25–50 candidates with a Cross-Encoder to pick the absolute best top 3–5 chunks for LLM context.
