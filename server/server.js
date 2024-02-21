import express from "express";
import cors from "cors";
import OpenAI from "openai";

const key = process.env.VITE_OPENAI_KEY;
const openai = new OpenAI({
  apiKey: key
});

let prompt = "yellow basketball"
async function callPrompt(prompt) {
  let content = "Come up with an object that's the opposite of: " + prompt;
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: content }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0];
}

let result = await callPrompt(prompt);
result = result.message.content;

const app = express();

app.use(cors());
app.use(express.json());

app.get("/message", (req, res) => {
  res.json({ message:  result});
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
