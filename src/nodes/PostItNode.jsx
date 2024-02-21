import { useCallback, useRef, useState, useEffect} from 'react';
import { Handle, Position } from 'reactflow';
import '../index.css'
import '../openai-test'

function PostIt({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    // console.log('changing node... ' + evt.target.value);
  }, []);

  const inputRef = useRef(null);

  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/message")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  async function artificial() {
    // let result = await callPrompt("football");
    inputRef.current.innerHTML = message;
  }

  return (
    <div className='post-it-node'>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
        <div ref={inputRef} className='nodrag post-it-text' name="text" contentEditable onChange={onChange} />
        <button onClick={artificial}> Click </button>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}



export default PostIt;