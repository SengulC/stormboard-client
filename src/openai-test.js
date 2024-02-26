// import os from 'os';
// import process from 'process';
// import OpenAI from "openai";

// const key = import.meta.env.VITE_OPENAI_KEY;

// const openai = new OpenAI({
//   apiKey: key
// });

// let prompt = "yellow basketball"
// async function callPrompt(prompt) {
//   let content = "Come up with an object that's the opposite of: " + prompt;
//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "system", content: content }],
//     model: "gpt-3.5-turbo",
//   });

//   return completion.choices[0];
// }

// async function main(){
//   let result = await callPrompt(prompt);
//   console.log(result);
// }

// // export default callPrompt;