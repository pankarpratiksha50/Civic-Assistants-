import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import OpenAI from "openai";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const knowledgeDir = path.join(__dirname, "../../knowledge");

function loadChunks() {
  const chunks = [];
  for (const name of fs.readdirSync(knowledgeDir).filter(n => n.endsWith(".md") || n.endsWith(".txt"))) {
    const content = fs.readFileSync(path.join(knowledgeDir, name), "utf8");
    const paragraphs = content.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
    paragraphs.forEach(text => chunks.push({ source: name, text }));
  }
  return chunks;
}
function keywordScore(query, text) {
  const words = query.toLowerCase().match(/[a-z]{3,}/g) || [];
  const hay = text.toLowerCase();
  return words.reduce((score, word) => score + (hay.includes(word) ? 1 : 0), 0);
}
export async function answerWithRag(question) {
  const chunks = loadChunks();
  const context = chunks.map(c => ({...c, score: keywordScore(question, c.text)}))
    .sort((a,b) => b.score-a.score).slice(0, 4);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return { answer: context[0]?.score
      ? `I found this information in the civic knowledge base:\n\n${context.map(c => c.text).join("\n\n")}\n\nThis is a starter guide. Please confirm current procedures with your local municipal corporation.`
      : "I can help with pothole reporting and civic services. Add verified municipal documents to the knowledge folder and configure OPENAI_API_KEY for AI-generated answers.",
      sources: context.map(c => c.source), mode: "retrieval_only" };
  }
  const client = new OpenAI({ apiKey });
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    temperature: 0.2,
    messages: [
      { role: "system", content: "You are Civic Assistants, a helpful civic information assistant. Answer only using the supplied context. If the context does not contain the answer, say so and recommend checking the official local municipal corporation. Do not invent phone numbers, deadlines, legal rules, or guarantees." },
      { role: "user", content: `Question: ${question}\n\nRetrieved civic knowledge:\n${context.map(c => `[${c.source}] ${c.text}`).join("\n\n")}` }
    ]
  });
  return { answer: completion.choices[0]?.message?.content || "I could not generate an answer.", sources: context.map(c => c.source), mode: "rag_llm" };
}
