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

function extractNodesData (nodes) {
  /*
  nodes: [
    { id: 'b', type: 'postIt', data: { label: 'After school clubs' }, position: { x: 390, y: 300 } },
    { id: 'c', type: 'postIt', data: { label: 'House competitions' }, position: { x: 200, y: 300 } }
  ]
  */

  // ==>

  /*
  [ 
    [ [IOxNzE], [koPZrd] ], 
    [ [c_xM2Z] , [Ved8xX], [R7AN_z] ]
  ]
  */
  console.log("in grouping");
  let extractedNodes = [];
  for (let node of nodes) {
    extractedNodes.push({id: node.id, text: node.data.label});
  }

  // console.log(extractedNodes);

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
      console.log(nodedata);
      prePrompt = "Group: " + extractNodesData(nodes)/*+ list of all nodes*/;
      break;
    default:
      prePrompt = "Regenerate: ";
      break;
  }
  
  let content = prePrompt + " " + input;
  return content;

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
    ["c_xM2Z", "IOxNzE"], 
    ["R7AN_z", "koPZrd"],
    ["5UZhRp", "Ved8xX", "Q9tbOx"]
  ]

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
  // const rearrangeNodes = useStore(state => state.rearrangeNodes); // can't do this unfortunately! need socket.io
  const input = req.body.nodelabel;
  const prompt = req.body.prompt;
  const brief = req.body.brief;
  const nodes = req.body.nodes;
  let result = await callButtonPrompt(prompt, input, brief, nodes);
  if (prompt == "group") {
    result = [
      ["a", "b"], 
      ["c"]
  ]
  }
  // rearrangeNodes(result);
  // result = result.message.content; // UNCOMMENT ME FOR API USAGE
  // console.log("Called gpt with brief: " + brief + ", and prompt: " + prompt + ": " + input + "and nodes are: " + nodes + ". Got result: " + result);
  res.send(result);
});

app.listen(8000, () => {
  console.log(`Server is running on port 8000.`);
});
