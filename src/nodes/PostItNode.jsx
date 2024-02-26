import { useCallback, useRef, useState, useEffect} from 'react';
import { Handle, Position } from 'reactflow';
import '../index.css'
import '../openai-test'
import axios from 'axios';

function PostIt({ data, isConnectable }) {
  const inputRef = useRef(null);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const artificial = (e) => {
    e.preventDefault();

    axios.post("http://localhost:8000/gpt", {prompt})
    .then((res) => {
      setResponse(res.data);
      setPrompt(res.data);
    })
    .catch((err => {
      console.error(err);
    }))
  };

  return (
    <div className='post-it-node'>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
        <textarea ref={inputRef} className='nodrag post-it-text' name="text" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
        <button onClick={artificial}> Make-Opposite  </button>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

export default PostIt;