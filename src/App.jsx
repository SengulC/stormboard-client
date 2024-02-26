import React, {useState, useEffect} from 'react';
import ReactFlow, { Background, Panel } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { useStore } from './store';
import PostItNode from './nodes/PostItNode.jsx';
import ReactDOM from 'react-dom/client';
import './index.css'

const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  addEdge: store.addEdge,
  onNodeClick: store.onNodeClick,
  addNode: store.addNode,
  selectedNodes: store.selectedNodes,
  updateNodeLabel: store.updateNodeLabel,
});

const nodeTypes = { postIt: PostItNode };

export default function App() {
  const store = useStore(selector, shallow);
  const addNode = useStore(state => state.addNode);
  
  // credit
  function artificial() {
    // Loop through each selected node
    store.selectedNodes.forEach(selectedNode => {
      const nodeId = selectedNode.target.querySelector('[data-nodeid]').getAttribute("data-nodeid");
      // Get the current textarea value for this node
      const currentTextareaValue = selectedNode.target.querySelector('textarea').value;
      // Now you can update the textarea value for this node by updating the label in the nodes array in your store
      store.updateNodeLabel(nodeId, currentTextareaValue + " changed");
    });
  }

  return (
    <ReactFlow
      nodes={store.nodes}
      edges={store.edges}
      onNodesChange={store.onNodesChange}
      onEdgesChange={store.onEdgesChange}
      onConnect={store.addEdge}
      onNodeClick={store.onNodeClick}
      // updateNodeLabel={store.updateNodeLabel}
      nodeTypes={nodeTypes}
    >
      <Panel>
        <button className="add-node-button" onClick={addNode}>Add Node</button>
        <hr></hr>
        <div className='menu'>
          <button onClick={artificial} className='add-node-button'> Make-Opposite </button>
        </div>
      </Panel>
      <Background />
    </ReactFlow>
  );
}