# rag

[RAG](https://en.wikipedia.org/wiki/Retrieval-augmented_generation) by ollama API with [ollama](https://ollama.com/) and [Deno](https://deno.com/).

## Setup

setup [ollama](https://ollama.com/download)

```sh
ollama run gemma3:4b
ollama run nomic-embed-text:latest
```

## Usage

1. make [data.txt](data.txt)

2. add embeding
```sh
deno --allow-read --allow-net --allow-import --allow-write addembed.js data.txt
```

3. rag
```sh
deno --allow-read --allow-net --allow-import rag.js Wirthで文字列の足し算できる？
```

## Library

- [ask](https://github.com/code4fukui/ask)
- [embed](https://github.com/code4fukui/embed)
