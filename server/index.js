var express = require("express");
var cors = require("cors");
var OpenAI = require("openai");
var bodyParser = require("body-parser");

let first = true; //?

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


async function callButtonPrompt(sourceLabels, targetLabels, prompt, input, brief, nodes) {
  let prePrompt;
  switch(prompt) {
    case 'opposite': 
      prePrompt = "Respond with a single sentence product idea (max 10 words). " +  "The brief is: " + brief + ". Make opposite: ";
      break;
    case 'summarize': 
      prePrompt = "Respond with a single sentence product idea (max 10 words). " +  "The brief is: " + brief + ". Summarize: ";
      break;
    case 'expand': 
      prePrompt = "Respond with a single sentence product idea (max 10 words). " +  "The brief is: " + brief + ". Expand: ";
      break;
    case 'surprise': 
      prePrompt = "Respond with a single sentence product idea (max 10 words). " +  "The brief is: " + brief + ". Surprise me, drawing inspiration from: ";
      break;
    case 'merge': 
      prePrompt = "Respond with a single sentence product idea (max 10 words). " +  "The brief is: " + brief + ". Merge: ";
      break;
    case 'feed': 
      prePrompt = "Respond with a single sentence product idea (max 10 words). " +  "The brief is: " + brief + ". Feed: " + "'" + sourceLabels + "'" + " into " + "'" + targetLabels + "'";
      break;
    case 'group': 
      let nodedata = extractNodesData(nodes);
      prePrompt = `GROUP ideas in association with one another. Given a list of the concepts (the idea itself in text and their unique ID), arrange them in groups that are most similar to one another. Respond with a list of lists (using square brackets) identifying the ideas via their unique IDs. 
      E.g. 
        [ 
          [ "c_xM2Z", "IOxNzE" ], 
          [ "R7AN_z" , "koPZrd" ],
          [ "5UZhRp" , "Ved8xX", "Q9tbOx" ] 
        ]` + JSON.stringify(nodedata);
      break;
    default:
      prePrompt = "Respond with a single sentence product idea (max 10 words). " +  "The brief is: " + brief + ". Come up with a random product idea: ";
      break;
  }


  let content;
  if (prompt!= 'feed') {
    content = prePrompt + " " + input;
  } else {
    content=prePrompt;
  }

  let sources = "";
  if (sourceLabels.length > 0) {
    sources = sourceLabels.join(". ");
    content += '. Remember to feed the following concepts into the output: ' + sources;
  }

  return content;

  // API usage
  const instruction = `You are a brainstorming assistant. You will be given a design brief and will be asked to assist with ideas in the given context. You will be asked to edit user-created ideas or create new ideas. These are how you will be asked to edit:

  - Expand; elaborate on the given idea, making sure to stay within the overall context.
  - Summarize; draw out core components of the given idea and express concisely.
  - Make Opposite; come up with an object or concept that is the polar opposite of the given idea.
  - Regenerate; rephrase the given idea.
  - Surprise; surprise the user with a random concept, drawing inspiration from the given idea. Make sure to stay within the context of the design brief.
  - Merge; given two ideas, semantically merge them to create a novel concept.
  -Feed; given a core idea, feed components of (a) child idea(s) into it.

  You will also be asked to GROUP ideas in association with one another. Given a list of the concepts (the idea itself in text and their unique ID), arrange them in groups that are most similar to one another. Respond with a list of lists (using square brackets) identifying the ideas via their unique IDs. 
  E.g. 
    [ 
      [ "c_xM2Z", "IOxNzE" ], 
      [ "R7AN_z" , "koPZrd" ],
      [ "5UZhRp" , "Ved8xX", "Q9tbOx" ] 
    ]

  Except for when you're asked to GROUP, respond in ONE sentence (max 20 words) outlining the product or concept ideea, and make sure to always stay within the context.
  Respond concisely, e.g. "A wearable AI band that adapts and composes music based on the wearer's heart rate and mood.", "A compact, voice-controlled kitchen robot that cooks, cleans and also orders groceries based on your diet and budget preferences."

  The design brief is: ${brief}`

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
    const completion = await openai.chat.completions.create({
      messages: [{role: "user", content: content}],
      model: "gpt-4",
    });
    console.log("Called gpt with: " + content);
    console.log("Got back: " + JSON.stringify(completion.choices[0]));
    return completion.choices[0];
  }
}

const app = express();
app.use(bodyParser.json());
// const allowedOrigins = 'https://guai-client.vercel.app'
const allowedOrigins = 'http://localhost:5173'
const corsOptions = {
  origin: allowedOrigins,
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));

app.post("/buttons", async (req, res) => {
  const sources = req.body.sourceLabels;
  const targets = req.body.targetLabels;
  const input = req.body.nodeLabel;
  const prompt = req.body.prompt;
  const brief = req.body.brief;
  const nodes = req.body.nodes;
  console.log(`Calling button prompt! [${sources}] [${targets}]`)
  let result = await callButtonPrompt(sources, targets, prompt, input, brief, nodes);
  // result = result.message.content; // UNCOMMENT ME FOR API USAGE
  res.send(result);
});

const port = process.env.PORT || 8000;

// Landing Page
app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
