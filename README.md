# RAG with Ollama (JavaScript) — Phase 2

A lightweight Retrieval-Augmented Generation (RAG) implementation in Node.js using **Ollama**, **ChromaDB**, and **Hybrid Retrieval** (Local Vector Database + Live Web Search).

---

## 🎯 Phase 2 — Local Vector Store + Embeddings

In Phase 1, retrieval was strictly web-based. **Phase 2 introduces semantic vector search**:
- Text chunking & document ingestion from local files.
- Local high-dimensional embeddings using `nomic-embed-text`.
- Vector similarity search using **ChromaDB**.
- Hybrid context merging (local documents + web search fallback).

```
                      ┌────────────────────────┐
                      │  User Query / Prompt   │
                      └───────────┬────────────┘
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
       ┌────────────────────┐          ┌────────────────────┐
       │ Local Vector Search│          │  Live Web Search   │
       │    (ChromaDB)      │          │   (Cloud Ollama)   │
       └──────────┬─────────┘          └──────────┬─────────┘
                  │                               │
                  └───────────────┬───────────────┘
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
├── docs/
│   └── sample.txt       # Source text document for vector store ingestion
├── client.js            # Ollama clients (Local Ollama & Cloud Ollama)
├── config.js            # Environment variable configuration
├── embedder.js          # Text embedding generator using local Ollama
├── vectorstore.js       # ChromaDB client, collection manager, and query helper
├── ingest.js            # Document chunker and vector store ingestion script
├── retriever.js         # Hybrid retriever (Vector Search + Web Search via Promise.allSettled)
├── augmenter.js         # Prompt builder combining context & user query
├── helper.js            # Stream handler separating reasoning/thinking & final answer
├── index.js             # Main application entry point running the RAG pipeline
├── Quiz.md              # Phase 2 interview & concept questions
├── RAG_LEARNING_ROADMAP.md # Detailed learning roadmap & progression guide
└── .env                 # API credentials & host configuration
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

### 3. Pull the Embedding Model in Ollama
Make sure local Ollama is running, then pull the embedding model:
```bash
ollama pull nomic-embed-text
```
*(Optional: also pull your local LLM, e.g. `ollama pull qwen2.5-coder:3b`)*

### 4. Start ChromaDB (Vector Store)
Run ChromaDB using Docker:

**Standard run (ephemeral / in-memory):**
```bash
docker run -p 8000:8000 chromadb/chroma
```

**Persistent run (saves embeddings to disk):**
```bash
# Windows PowerShell
docker run -p 8000:8000 -v ${PWD}/chroma-data:/chroma/chroma chromadb/chroma

# Windows CMD
docker run -p 8000:8000 -v "%cd%/chroma-data:/chroma/chroma" chromadb/chroma
```

---

## ▶️ Running the Application

### Step 1: Ingest Documents into ChromaDB
Read `docs/sample.txt`, create chunks, generate embeddings, and store them in the `my-docs` ChromaDB collection:
```bash
node ingest.js
```
*Output: `Documents ingested successfully!`*

### Step 2: Run the RAG Pipeline
Query the hybrid retrieval pipeline (searches both ChromaDB and Web in parallel, augments the prompt, and streams the answer):
```bash
npm start
```
or
```bash
node index.js
```

---

## 📌 Key Features

- 🧠 **Vector Similarity Search**: Semantic matching on custom local knowledge using `nomic-embed-text` and ChromaDB.
- 🌐 **Hybrid Retrieval**: Combines local vector documents and live web search with fallback handling.
- ⚡ **Document Ingestion Pipeline**: Configurable text chunking with metadata tracking.
- 💭 **Thinking & Stream Separation**: Live streaming supporting reasoning tokens (`<think>` blocks).
- 🧩 **Clean Modular ES Modules**: Decoupled architecture across embedding, storage, retrieval, augmentation, and generation.
