# RAG with Ollama (JavaScript) - Phase 1

A lightweight Retrieval-Augmented Generation (RAG) implementation in Node.js using Ollama and web search retrieval.

## 🚀 Overview

This project demonstrates the core fundamentals of RAG:
1. **Retrieval**: Fetches relevant web search results for a user query (`retriever.js`).
2. **Augmentation**: Builds an augmented prompt containing the retrieved context (`augmenter.js`).
3. **Generation**: Queries the Ollama model with streaming response and thinking tokens support (`index.js` & `helper.js`).

---

## 📁 Project Structure

```
├── client.js      # Ollama client initialization
├── config.js      # Environment variable configuration
├── retriever.js   # Web search and context retriever
├── augmenter.js   # Prompt builder combining context & query
├── helper.js      # Stream handler for reasoning & answer display
├── index.js       # Main entry point running the RAG pipeline
└── .env           # API credentials & host configuration
```

---

## 🛠️ Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- An Ollama instance (local or remote/cloud)

---

## ⚙️ Setup

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Create a `.env` file in the root directory:**
   ```env
   OLLAMA_HOST=https://your-ollama-host-or-api
   OLLAMA_API_KEY=your_api_key_here
   ```

---

## ▶️ Usage

Run the main pipeline:

```bash
npm start
```
or
```bash
node index.js
```

---

## 📌 Features

- 🔍 **Live Web Search Retrieval** for real-time context.
- 🧠 **Thinking & Reasoning Stream** separation for reasoning models.
- ⚡ **Native ES Modules** and clean modular architecture.
