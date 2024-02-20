import { useCallback, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import '../index.css'
import '../openai-test'

function PostIt({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    // console.log('changing node... ' + evt.target.value);
  }, []);

  const inputRef = useRef(null);

  async function artificial() {
    // let result = await callPrompt("football");
    inputRef.current.innerHTML = "result";
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