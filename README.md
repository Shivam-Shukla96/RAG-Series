# RAG with Ollama (JavaScript) — Phase 3

A production-grade Retrieval-Augmented Generation (RAG) implementation in Node.js featuring **Semantic Chunking**, **Dense Vector Search (ChromaDB)**, **Sparse Keyword Search (BM25 / TF-IDF)**, **Reciprocal Rank Fusion (RRF)**, **Reranking**, and **Live Web Search Fallback** with **Ollama**.

---

## 🎯 Phase 3 — Advanced Hybrid Search, Semantic Chunking & Rank Fusion

Phase 3 upgrades the RAG pipeline with state-of-the-art information retrieval techniques to solve vocabulary mismatch and score calibration problems:

1. **Semantic Chunking (`chunker.js`)**: Splits text at natural topic shift boundaries using consecutive sentence embedding cosine similarities rather than arbitrary fixed token counts.
2. **Hybrid Retrieval (Dense + Sparse)**:
   - **Dense Retrieval**: Semantic similarity matching in vector space via ChromaDB and `nomic-embed-text`.
   - **Sparse Retrieval**: Exact keyword and acronym matching via TF-IDF / BM25 (`natural` library).
3. **Reciprocal Rank Fusion (RRF)**: Merges dense and sparse ranked lists into a single calibrated ranking using position-based harmonic scoring ($k=60$).
4. **Reranking (`reranker.js`)**: Two-stage retrieval pattern (Retrieve Top-K candidates $\rightarrow$ Rerank for high-precision context selection).
5. **Parallel Live Web Search**: Fallback and supplementary web context powered by Cloud Ollama.

---

## 🏛️ Pipeline Architecture

### 1. Ingestion Phase (Semantic Chunking)
![Ingestion Phase Diagram](assets/ingestion-phase.png)

### 2. Hybrid Retrieval, Rank Fusion & Generation Phase
![Retrieval and Generation Phase Diagram](assets/retrieval-generation-phase.png)

```
                              ┌────────────────────────┐
                              │  User Query / Prompt   │
                              └───────────┬────────────┘
                                          │
                  ┌───────────────────────┼───────────────────────┐
                  ▼                       ▼                       ▼
       ┌────────────────────┐  ┌────────────────────┐  ┌────────────────────┐
       │ Dense Vector Search│  │ Sparse BM25 Search │  │  Live Web Search   │
       │    (ChromaDB)      │  │  (TF-IDF / natural)│  │   (Cloud Ollama)   │
       └──────────┬─────────┘  └──────────┬─────────┘  └──────────┬─────────┘
                  │                       │                       │
                  └───────────┬───────────┘                       │
                              ▼                                   │
                 ┌─────────────────────────┐                      │
                 │ Reciprocal Rank Fusion  │                      │
                 │      (RRF with k=60)    │                      │
                 └────────────┬────────────┘                      │
                              │                                   │
                              └─────────────────┬─────────────────┘
                                                ▼
                                   ┌────────────────────────┐
                                   │ Augmented Context Prep │
                                   └────────────┬───────────┘
                                                ▼
                                   ┌────────────────────────┐
                                   │ LLM Stream Generation  │
                                   │  (Thinking + Answer)   │
                                   └────────────────────────┘
```

---

## 📁 Project Structure

```
├── assets/
│   ├── ingestion-phase.png            # Ingestion & semantic chunking architecture
│   └── retrieval-generation-phase.png # Hybrid retrieval & RRF architecture
├── docs/
│   └── sample.txt                     # Source document for ingestion
├── client.js                          # Ollama clients (Local & Cloud instances)
├── config.js                          # Environment variable configuration
├── embedder.js                        # Vector embedding generator (nomic-embed-text)
├── chunker.js                         # Semantic chunker & cosine similarity calculator
├── vectorstore.js                     # ChromaDB client, collection manager & queries
├── ingest.js                          # Document ingestion pipeline
├── retriever.js                       # Hybrid retriever (Vector + BM25 + RRF + Web search)
├── reranker.js                        # Cross-encoder reranking utilities
├── augmenter.js                       # Prompt builder combining context & query
├── helper.js                          # Stream handler for reasoning (<think>) & output
├── index.js                           # Main application entry point
├── concpets.md                        # Theoretical guide (TF-IDF, BM25, Cosine Sim, RRF)
├── Quiz.md                            # Phase 3 interview & concept questions
├── RAG_LEARNING_ROADMAP.md            # Comprehensive learning progression guide
└── .env                               # Environment variables & API keys
```

---

## 🛠️ Prerequisites

1. **[Node.js](https://nodejs.org/)** (v18 or higher)
2. **[Docker](https://www.docker.com/)** (to run the ChromaDB vector database container)
3. **[Ollama](https://ollama.com/)** installed and running locally

---

## ⚙️ Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
OLLAMA_API_KEY=your_ollama_api_key_here
OLLAMA_HOST_CLOUD=https://ollama.com
OLLAMA_HOST_LOCAL=http://127.0.0.1:11434

MODEL_NAME_CLOUD=gpt-oss:120b-cloud
MODEL_NAME_LOCAL=qwen2.5-coder:3b
MODEL_NAME_EMBED=nomic-embed-text
```

### 3. Pull Required Models in Ollama
Make sure Ollama is running, then pull the embedding model and your local LLM:
```bash
# Pull embedding model
ollama pull nomic-embed-text

# Pull local language model
ollama pull qwen2.5-coder:3b
```

### 4. Start ChromaDB (Vector Store)
Run ChromaDB using Docker:

**Standard run (ephemeral / in-memory):**
```bash
docker run -p 8000:8000 chromadb/chroma
```

**Persistent run (persists embeddings to disk):**
```bash
# Windows PowerShell
docker run -p 8000:8000 -v ${PWD}/chroma-data:/chroma/chroma chromadb/chroma

# Windows CMD
docker run -p 8000:8000 -v "%cd%/chroma-data:/chroma/chroma" chromadb/chroma
```

---

## ▶️ Running the Application

### Step 1: Ingest Documents into ChromaDB
Reads `docs/sample.txt`, chunks the content, computes `nomic-embed-text` embeddings, and stores them in the `my-docs` collection:
```bash
node ingest.js
```
*Output: `Documents ingested successfully!`*

### Step 2: Run the Hybrid RAG Pipeline
Executes hybrid vector + BM25 keyword search, fuses scores with RRF, augments the prompt, and streams the answer:
```bash
npm start
```
or
```bash
node index.js
```

---

## 📚 Deep-Dive Documentation

- 📖 **[`concpets.md`](concpets.md)**: Comprehensive guide covering the mathematical theory and code implementations of:
  - Cosine Similarity & Vector Norms
  - Semantic Chunking & Dynamic Breakpoint Detection
  - TF-IDF vs. BM25 (Term frequency saturation & length normalization)
  - Reciprocal Rank Fusion (RRF) & score calibration
- 🧪 **[`Quiz.md`](Quiz.md)**: Detailed answers to core engineering questions (Bi-Encoder vs Cross-Encoder reranking, sparse vs dense search, metadata filtering schemas).
- 🗺️ **[`RAG_LEARNING_ROADMAP.md`](RAG_LEARNING_ROADMAP.md)**: Full progression roadmap across all phases.

---

## 📌 Key Phase 3 Highlights

- 🧠 **Semantic Chunking**: Context-aware chunk boundaries based on embedding divergence ($\text{threshold} = 0.75$).
- 🔀 **Hybrid Search (Dense + Sparse)**: Overcomes vocabulary mismatch using both semantic embeddings and BM25 keyword indexing.
- ⚖️ **Reciprocal Rank Fusion**: Rank-based score normalization avoiding raw score scale distortions.
- 🌐 **Parallel Web Search Fallback**: Seamless integration of live web sources via `Promise.allSettled`.
- 💭 **Reasoning & Stream Separation**: Real-time token streaming supporting `<think>` tags and final responses.
