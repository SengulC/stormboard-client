import express from "express";
import cors from "cors";
import OpenAI from "openai";
import bodyParser from "body-parser";
import { useStore } from '../src/store.js';

let first = true;

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

function extractNodesData (nodes) {
  let extractedNodes = [];
  for (let node of nodes) {
    extractedNodes.push({id: node.id, text: node.data.label});
  }
  return extractedNodes;
}


async function callButtonPrompt(prompt, input, brief, nodes) {
  let prePrompt;
  switch(prompt) {
    case 'opposite': 
      prePrompt = "Make opposite: ";
      break;
    case 'summarize': 
      prePrompt = "Summarize: ";
      break;
    case 'expand': 
      prePrompt = "Expand: ";
      break;
    case 'surprise': 
      prePrompt = "Surprise me, drawing inspiration from: ";
      break;
    case 'group': 
      let nodedata = extractNodesData(nodes);
      prePrompt = `GROUP Post-its in association with one another. Given a list of the Post-its (the idea in text and their unique ID), arrange them in groups that are most similar to one another. Respond with a list of lists (using square brackets) identifying the Post-its via their unique IDs. 
      Make sure to respond in proper formatting. E.g. 
        [ 
          [ "c_xM2Z", "IOxNzE" ], 
          [ "R7AN_z" , "koPZrd" ],
          [ "5UZhRp" , "Ved8xX", "Q9tbOx" ] 
        ]` + "GROUP: " + JSON.stringify(nodedata)/*+ list of all nodes*/;
      break;
    default:
      prePrompt = "Do not respond in longer than 20 words. Come up with a random product idea: ";
      break;
  }
  
  let content = prePrompt + " " + input;

  // API usage
  const instruction = `You are a Post-it note brainstorming assistant. You will be given a design brief and asked to assist with ideas that may come about in the given context. You will be asked to edit pre-existing or create new ideas. These are how you will be asked to edit:

  - Expand; elaborate on the given idea, making sure to stay within the overall context.
  - Summarize; draw out core components of the given idea and express concisely.
  - Make Opposite; come up with an object or concept that is the polar opposite of the given idea.
  - Regenerate; rephrase the given idea.
  - Surprise; surprise the user with a random concept, drawing inspiration from the given idea, make sure the concept is still within the context of the design brief.
  
  Respond in a single sentence, describing the product, no longer than 20 words. Do not add beginners like "Create/Design/Develop" or "Expand:"/"Opposite:" etc.

  You may also be asked to GROUP Post-its in association with one another. Given a list of the Post-its (the idea in text and their unique ID), arrange them in groups that are most similar to one another. Respond with a list of lists (using square brackets) identifying the Post-its via their unique IDs. 
  E.g. 
    [ 
      [ "c_xM2Z", "IOxNzE" ], 
      [ "R7AN_z" , "koPZrd" ],
      [ "5UZhRp" , "Ved8xX", "Q9tbOx" ] 
    ]

  The design brief is: ${brief}.`

  if (first) {
    first = false;
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: instruction},
                 {role: "user", content: content}],
      model: "gpt-4",
    });
    console.log("Sent init instructions. Called gpt with brief: " + brief + ", and: " + content);
    console.log("Got back: " + JSON.stringify(completion.choices[0]));
    return completion.choices[0];
  } else {
    // maybe add brief
    const completion = await openai.chat.completions.create({
      messages: [{role: "user", content: brief + " " + content}],
      model: "gpt-4",
    });
    console.log("Called gpt with: " + brief + " " + content);
    console.log("Got back: " + JSON.stringify(completion.choices[0]));
    return completion.choices[0];
  }
}

const app = express();
app.use(bodyParser.json());
app.use(cors());
// app.use(express.json());

app.post("/buttons", async (req, res) => {
  // const rearrangeNodes = useStore(state => state.rearrangeNodes); // can't do this unfortunately! need socket.io
  const input = req.body.nodelabel;
  const prompt = req.body.prompt;
  const brief = req.body.brief;
  const nodes = req.body.nodes;
  let result = await callButtonPrompt(prompt, input, brief, nodes);
  result = result.message.content; // UNCOMMENT ME FOR API USAGE
  // console.log("Called gpt with brief: " + brief + ", and prompt: " + prompt + ": " + input + ". Got result: " + result);
  res.send(result);
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
