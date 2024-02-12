import React from 'react';
import ReactFlow, { Background } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { useStore } from './store';
import PostItNode from './nodes/PostItNode.jsx';
import './index.css'

const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  addEdge: store.addEdge,
});
 
const nodeTypes = { postIt: PostItNode };

export default function App() {
  const store = useStore(selector, shallow);
 
  return (
    <ReactFlow
      nodes={store.nodes}
      edges={store.edges}
      onNodesChange={store.onNodesChange}
      onEdgesChange={store.onEdgesChange}
      onConnect={store.addEdge}
      nodeTypes={nodeTypes}
    >
      <Background />
    </ReactFlow>
  );
}