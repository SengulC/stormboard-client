import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import '../index.css'

function PostIt({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    // console.log('changing node... ' + evt.target.value);
  }, []);

  return (
    <div className='post-it-node'>
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <textarea className='nodrag post-it-text' name="text" onChange={onChange} />
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

export default PostIt;