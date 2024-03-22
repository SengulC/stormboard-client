import express from "express";
import cors from "cors";
import OpenAI from "openai";
import bodyParser from "body-parser";
import { useStore } from '../src/store.js';

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

function getBrief() {
  console.log("before")
  const brief = useStore(state => state.brief);
  console.log("after")
  return brief;
}

async function callButtonPrompt(prompt, input, brief) {
  // const brief = getBrief();

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
  const instruction = `You are a brainstorming assistant. You will be given a design brief and asked to assist with ideas that may come about in the given context. You will be asked to edit pre-existing or create new ideas. These are how you will be asked to edit:

  - Expand; elaborate on the given idea, making sure to stay within the overall context.
  - Summarize; draw out core components of the given idea and express concisely.
  - Make Opposite; come up with an object or concept that is the polar opposite of the given idea.
  - Regenerate; rephrase the given idea.
  - Surprise; surprise the user with a random concept, drawing inspiration from the given idea, make sure the concept is still within the context of the design brief.
  
  Respond in a single sentence, describing the product, no longer than 30 words. Do not add beginners like "Create/Design/Develop etc"

  The design brief is: ${brief}`  
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: instruction},
               {role: "user", content: content}],
    model: "gpt-3.5-turbo",
  });
  return completion.choices[0];
}

const app = express();
app.use(bodyParser.json());
app.use(cors());
// app.use(express.json());

app.post("/buttons", async (req, res) => {
  const input = req.body.nodelabel;
  const prompt = req.body.prompt;
  const brief = req.body.brief;
  let result = await callButtonPrompt(prompt, input, brief);
  result = result.message.content; // UNCOMMENT ME FOR API USAGE
  console.log("Called gpt with brief: " + brief + ", and prompt: " + prompt + ": " + input + ". Got result: " + result);
  res.send(result);
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
