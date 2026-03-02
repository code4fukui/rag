import { Embed } from "https://code4fukui.github.io/embed/Embed.js";
import { chat } from "https://code4fukui.github.io/ask/chat.js";
import { showChat } from "https://code4fukui.github.io/ask/showChat.js";

const streaming = true;

const embed = await Embed.create("./data.csv");

const q = Deno.args[0];
const top = await embed.getSimilar(q);
//console.log(top);

/*
const system = `あなたは根拠に基づき回答するアシスタントです。
以下の「根拠」だけを使って答えてください。
参照した根拠番号[1]のように引用し、根拠を末尾に列挙してください。
根拠にない場合「推測ですが」と前置きしてください。`;
*/
const system = `あなたは根拠に基づき回答するアシスタントです。
以下の根拠を使って端的に答えてください。
文脈に沿わない根拠は使う必要はありません。`;

const prompt = `${system}

# 質問
${q}

# 根拠
${top.map((i, idx) => `[${idx + 1}] ${i.text}`).join("\n")}

# 回答
`.trim();

console.log(prompt);

if (streaming) {
  await showChat(prompt);
} else {
  const res = await chat(prompt);
  console.log(res);
}
