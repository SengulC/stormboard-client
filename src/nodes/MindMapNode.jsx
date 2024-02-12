import { Handle, NodeProps, Position } from 'reactflow';
 
import useStore from '../store';
 
const selector = (id) => (store) => ({
  updateNodeLabel: (e) => store.updateNodeLabel(id, { type: e.target.value }),
});

export default function MindMapNode({ id, data }) {
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
 
  return (
    <div className='bg'>
    <Handle type="target" position="top" />
      <input
        // from now on we can use value instead of defaultValue
        // this makes sure that the input always shows the current label of the node
        value={data.label}
        onChange={() => updateNodeLabel(id, data.value)}
        className="input"
      />
      <Handle type="source" position="bottom" />
    </div>
  );
}
 
