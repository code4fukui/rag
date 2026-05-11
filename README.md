# rag

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

A simple [Retrieval-Augmented Generation (RAG)](https://en.wikipedia.org/wiki/Retrieval-augmented_generation) implementation using the [Ollama](https://ollama.com/) API and [Deno](https://deno.com/).

This project provides a command-line interface to ask questions about a custom knowledge base (in this case, a fictional programming language called "Wirth"). It uses a local embedding model to find relevant context and a local language model to generate answers.

## Demo

The knowledge base in `data.txt` describes the "Wirth" programming language, which has an interactive playground:

- **[Wirth Playground](https://code4fukui.github.io/Wirth/)**

## Setup

1.  **Install [Deno](https://deno.com/)**

2.  **Install [Ollama](https://ollama.com/download) and pull the required models:**
    ```sh
    ollama run gemma3:4b
    ollama run nomic-embed-text:latest
    ```

## Usage

The process involves three steps: preparing the data, generating embeddings, and running a query.

**1. Prepare the Knowledge Base**

The source of truth for the RAG system is `data.txt`. You can modify this file to change the knowledge base.

**2. Generate Embeddings**

This script reads `data.txt`, generates vector embeddings for the text, and saves them to `data.csv`.

```sh
deno run --allow-read --allow-net --allow-import --allow-write addembed.js data.txt
```

**3. Ask a Question**

Run the RAG script with your question as an argument. The script will find relevant context from `data.csv` and generate an answer.

```sh
deno run --allow-read --allow-net --allow-import rag.js "Wirthで文字列の足し算できる？"
```

### Example Output

The script first prints the full prompt sent to the LLM, including the retrieved context, and then streams the model's answer.

```
あなたは根拠に基づき回答するアシスタントです。
以下の根拠を使って端的に答えてください。
文脈に沿わない根拠は使う必要はありません。

# 質問
Wirthで文字列の足し算できる？

# 根拠
[1] 文字列の算術演算は「+」のみ使用することができます。
[2] 算術演算の前後のいずれかが文字列の場合、文字列として連結します。
[3] 加減乗除の四則演算は、「+」、「-」、「*」、「/」で指定します。

# 回答
はい、できます。「+」演算子を使用して文字列を連結することができます。[1][2]
```

## How It Works

-   **`data.txt`**: A plain text file containing the source knowledge base.
-   **`addembed.js`**: A Deno script that uses the `nomic-embed-text` model to convert the text in `data.txt` into vector embeddings.
-   **`data.csv`**: The output file containing the original text chunks and their corresponding vector embeddings.
-   **`rag.js`**: The main Deno script that:
    1.  Takes a user's query.
    2.  Generates an embedding for the query.
    3.  Finds the most similar text chunks from `data.csv`.
    4.  Constructs a prompt containing the query and the retrieved context.
    5.  Sends the prompt to the `gemma3:4b` model to generate a final answer.

## Libraries

-   [ask](https://github.com/code4fukui/ask) - For interacting with the chat model.
-   [embed](https://github.com/code4fukui/embed) - For creating and querying vector embeddings.