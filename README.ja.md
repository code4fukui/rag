# rag

[Ollama](https://ollama.com/) APIと[Deno](https://deno.com/)を使用した、シンプルな[Retrieval-Augmented Generation (RAG)](https://en.wikipedia.org/wiki/Retrieval-augmented_generation)の実装です。

このプロジェクトは、カスタム知識ベース（この場合は「Wirth」という架空のプログラミング言語）に関する質問ができるコマンドラインインターフェースを提供します。ローカルの埋め込みモデルを使用して関連するコンテキストを検索し、ローカルの言語モデルを使用して回答を生成します。

## デモ

`data.txt` の知識ベースには「Wirth」プログラミング言語について記述されており、以下のインタラクティブなプレイグラウンドが用意されています。

- **[Wirth Playground](https://code4fukui.github.io/Wirth/)**

## セットアップ

1. **[Deno](https://deno.com/) のインストール**

2. **[Ollama](https://ollama.com/download) をインストールし、必要なモデルをプル（取得）します:**
    ```sh
    ollama run gemma3:4b
    ollama run nomic-embed-text:latest
    ```

## 使い方

処理は、データの準備、埋め込み（Embedding）の生成、クエリの実行の3つのステップで行われます。

**1. 知識ベースの準備**

RAGシステムの情報源（Source of truth）となるのは `data.txt` です。このファイルを編集することで、知識ベースを変更できます。

**2. 埋め込みの生成**

以下のスクリプトは `data.txt` を読み込み、テキストのベクトル埋め込みを生成して `data.csv` に保存します。

```sh
deno run --allow-read --allow-net --allow-import --allow-write addembed.js data.txt
```

**3. 質問する**

質問を引数としてRAGスクリプトを実行します。スクリプトは `data.csv` から関連するコンテキストを見つけ出し、回答を生成します。

```sh
deno run --allow-read --allow-net --allow-import rag.js "Wirthで文字列の足し算できる？"
```

### 出力例

スクリプトはまず、検索されたコンテキストを含む、LLMに送信されるプロンプト全体を出力し、その後モデルの回答をストリーミング出力します。

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

## 仕組み

- **`data.txt`**: 情報源となる知識ベースを含むプレーンテキストファイル。
- **`addembed.js`**: `nomic-embed-text` モデルを使用して、`data.txt` 内のテキストをベクトル埋め込みに変換するDenoスクリプト。
- **`data.csv`**: 元のテキストチャンクと、それに対応するベクトル埋め込みを含む出力ファイル。
- **`rag.js`**: 以下の処理を行うメインのDenoスクリプト。
    1. ユーザーのクエリを受け取る。
    2. クエリの埋め込みを生成する。
    3. `data.csv` から最も類似したテキストチャンクを検索する。
    4. クエリと検索されたコンテキストを含むプロンプトを構築する。
    5. プロンプトを `gemma3:4b` モデルに送信し、最終的な回答を生成する。

## ライブラリ

- [ask](https://github.com/code4fukui/ask) - チャットモデルとの対話に使用。
- [embed](https://github.com/code4fukui/embed) - ベクトル埋め込みの作成と検索に使用。
