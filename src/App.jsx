import React, {useState, useEffect, TextInput} from 'react';
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
  const updateBrief = useStore(state => state.updateBrief);
  // useEffect(() => { {
    const [currentNode, setCurrentNode] = useState(null);
    const [brief, setBrief] = useState("");
  // }});

  function changeBrief(value) {
    setBrief(value);
    updateBrief(brief);
  }

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
        <form>
        <input name="brief" onChange={(e) => changeBrief(e.target.value)} value={brief} size="50" placeholder='Write your design brief here '></input>
        </form>
        <hr></hr>
        <button className="add-node-button" onClick={addNode}>Add Node</button>
      </Panel>
      <Background />
    </ReactFlow>
  );
}