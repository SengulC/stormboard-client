import { useCallback, useRef } from 'react';
import { Handle, Position } from 'reactflow';
import '../index.css'
import ReactDOM from 'react-dom/client';

function PostIt({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    // console.log('changing node... ' + evt.target.value);
  }, []);

  const inputRef = useRef(null);

  function artificial() {
    inputRef.current.innerHTML = "This is AI generated text.";
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