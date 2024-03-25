import { useCallback, useRef, useState, useEffect} from 'react';
import { Handle, Position } from 'reactflow';
import '../index.css'
import '../openai-test'
import { nanoid } from 'nanoid';
import { useStore } from '../store';

function PostIt({ data, isConnectable }) {
  const [prompt, setPrompt] = useState(data.label);
  const updateNodeLabel = useStore(state => state.updateNodeLabel);

  function trigger(e) {
    setPrompt(e.target.value);
    data.label=e.target.value;
    return;
  }
  
  return (
    <div style={{'backgroundColor': data.color}} className='post-it-node'>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
        <textarea id={nanoid(6)} className='nodrag post-it-text' name="text" value={data.label} onChange={(e) => trigger(e)} />
        <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

// need the textarea value to be something within PostIt (data, data.label...)
// also need useState to render quickly

export default PostIt;