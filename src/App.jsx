import React, {useState, useEffect, TextInput, useRef} from 'react';
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
  onNodeClick: store.onNodeClick,
  selectedNodes: store.selectedNodes,
  updateParent: store.updateParent
});

const nodeTypes = { postIt: PostItNode };

export default function App() {
  const store = useStore(selector, shallow);
  const addNode = useStore(state => state.addNode);
  const updateBrief = useStore(state => state.updateBrief);
  const [currentNode, setCurrentNode] = useState(null);
  const [brief, setBrief] = useState("");

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
      onNodeClick={(_, node) => {
        setCurrentNode(node);
      }}
      nodeTypes={nodeTypes}
    >
      <Menu node={currentNode} deselect={() => setCurrentNode(null)} />
      <Panel className='panel'>
        <input name="brief" onChange={(e) => changeBrief(e.target.value)} value={brief} size="90" placeholder='  Write your design brief here '></input>
        <button className="add-node-button" onClick={(e) => addNode(false, "")}>Add Note</button>
        <button className="add-node-button" onClick={(e) => addNode(true, "")}>Add Surprise Note</button>
      </Panel>
      {/* <Background/> */}
    </ReactFlow>
  );
}

{/* <br></br>
I am creating a new <input placeholder='(what)'></input> to help <input placeholder='(who)'></input> 
<br></br>
in <input placeholder='(where)'></input> for <input placeholder='(why)'></input>. */}