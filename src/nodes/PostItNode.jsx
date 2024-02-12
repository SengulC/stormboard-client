import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

function PostIt({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    console.log(evt.target.value);
  }, []);

  return (
    <div className="post-it-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <label htmlFor="text">Text:</label>
        <input id="text" name="text" onChange={onChange} className="nodrag" />
      </div>
      <Handle type="source" position={Position.Bottom} id="b" isConnectable={isConnectable} />
    </div>
  );
}

export default PostIt;