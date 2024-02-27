import express from "express";
import cors from "cors";
import OpenAI from "openai";
import bodyParser from "body-parser";

const key = process.env.VITE_OPENAI_KEY;
const openai = new OpenAI({
  apiKey: key
});

//https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

async function callPrompt(prompt) {
  let content = "Come up with an object that's the opposite of: " + prompt;
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: content }],
    model: "gpt-3.5-turbo",
  });

  return completion.choices[0];
}

const app = express();
app.use(bodyParser.json());
app.use(cors());
// app.use(express.json());

app.post("/gpt", async (req, res) => {
  const prompt = req.body.label;
  let result = await callPrompt(prompt);
  // let result = makeid(5) + " " + prompt;
  result = result.message.content;
  console.log("called gpt with prompt: " + prompt + "got result:" + result);
  res.send(result);
});

// app.get("/message", (req, res) => {
//   res.json({ message:  result});
// });

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
