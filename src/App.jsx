import React from 'react';
import ReactFlow, { Background, Panel } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { nanoid } from 'nanoid';
import { useStore } from './store';
import PostItNode from './nodes/PostItNode.jsx';
import './index.css'

const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  addEdge: store.addEdge,
  addNode: store.addNode,
});

const nodeTypes = { postIt: PostItNode };

export default function App() {
  const store = useStore(selector, shallow);
  const addNode = useStore(state => state.addNode);
   
  return (
    <ReactFlow
      nodes={store.nodes}
      edges={store.edges}
      onNodesChange={store.onNodesChange}
      onEdgesChange={store.onEdgesChange}
      onConnect={store.addEdge}
      nodeTypes={nodeTypes}
    >
      <Panel>
        <button onClick={addNode}>Add Node</button>
      </Panel>
      <Background />
    </ReactFlow>
  );
}