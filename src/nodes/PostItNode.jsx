import { useCallback } from 'react';
import { Handle, Position } from 'reactflow';

function PostIt({ data, isConnectable }) {
  const onChange = useCallback((evt) => {
    // console.log('changing node... ' + evt.target.value);
  }, []);

  return (
    <div className="post-it-node">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      <div>
        <p>Text:</p>
        <input name="text" onChange={onChange} className="nodrag" />
      </div>
      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

export default PostIt;