import React, {useState, useEffect} from 'react';
import ReactFlow, { Background, Panel } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { useStore } from './store';
import PostItNode from './nodes/PostItNode.jsx';
import ReactDOM from 'react-dom/client';
import './index.css'
import Menu from './Menu.jsx'

const selector = (store) => ({
  nodes: store.nodes,
  edges: store.edges,
  onNodesChange: store.onNodesChange,
  onEdgesChange: store.onEdgesChange,
  addEdge: store.addEdge,
  addNode: store.addNode,
  selectedNodes: store.selectedNodes,
});

const nodeTypes = { postIt: PostItNode };

export default function App() {
  const store = useStore(selector, shallow);
  const addNode = useStore(state => state.addNode);
  const [currentNode, setCurrentNode] = useState(null);

  // function changeBrief() {
    
  // }

  return (
    <ReactFlow
      nodes={store.nodes}
      edges={store.edges}
      onNodesChange={store.onNodesChange}
      onEdgesChange={store.onEdgesChange}
      onConnect={store.addEdge}
      onNodeDoubleClick={(_, node) => {
        setCurrentNode(node);
      }}
      nodeTypes={nodeTypes}
    >
      <Menu node={currentNode} deselect={() => setCurrentNode(null)} />
      <Panel className='panel'>
        {/* <input name="brief" onchange={changeBrief} value={brief} size="50" placeholder='Write your design brief here '></input> */}
        <input></input>
        <hr></hr>
        <button className="add-node-button" onClick={addNode}>Add Node</button>
      </Panel>
      <Background />
    </ReactFlow>
  );
}