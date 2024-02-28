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

async function callPrompt(prompt, input) {
  let prePrompt;
  switch(prompt) {
    case 'opposite': 
      prePrompt = "Come up with an object that's the opposite of: ";
      break;
    case 'summarize': 
      prePrompt = "Summarize down to half the word-count: ";
      break;
    case 'expand': 
      prePrompt = "Expand up to 50 words: ";
      break;
    case 'surprise': 
      prePrompt = "Respond in no longer than 10 words. Surprise me with a random concept, drawing inspiration from: ";
      break;
    default:
      prePrompt = "Regenerate: ";
      break;
  }
  
  let content = prePrompt + " " + input;
  // return content;

  // API usage
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
  console.log(req.body);
  const input = req.body.label;
  const prompt = req.body.prompt;
  let result = await callPrompt(prompt, input);
  result = result.message.content; // UNCOMMENT ME FOR API USAGE
  console.log("called gpt with prompt: " + prompt + " " + input + " got result:" + result);
  res.send(result);
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
