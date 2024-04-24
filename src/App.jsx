import React, {useState, useEffect, TextInput, useRef} from 'react';
import ReactFlow, { Background, Panel } from 'reactflow';
import { shallow } from 'zustand/shallow';
import { useStore } from './store';
import PostItNode from './nodes/PostItNode.jsx';
import ReactDOM from 'react-dom/client';
import './index.css'
import Menu from './Menu.jsx'
import Loader from './Loader.jsx'
import Brief from './Brief.jsx'

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
  const nodes = useStore(state => state.nodes);
  const loadingState = useStore(state => state.loadingState);
  const charTone = useStore(state => state.charTone);
  const userTime = useStore(state => state.userTime);
  const callButtonForNodes = useStore(state => state.callButtonForNodes);
  const [currentNode, setCurrentNode] = useState(null);
  let num = 0;

  function getRandomInterval () {
    return Math.floor(Math.random() * (60000 - 30000 + 1) + 30000);
  };

  useEffect(() => {
    if (charTone == 'abstract') {
      const intervalId = setInterval(() => {
        if(loadingState=='hidden'){callButtonForNodes('random', nodes);}
        // if(loadingState=='hidden'){addNode(true, "", false);}
        }, getRandomInterval());
        return () => {
          clearInterval(intervalId);
        };
    } else if (charTone == 'realistic') {
      const intervalId = setInterval(() => {
        if(loadingState=='hidden'){callButtonForNodes('summarize', nodes);}
        }, userTime);
        return () => {
          clearInterval(intervalId);
        };    
    }
  }, [charTone, nodes]);

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
      <Brief/>
        {/* <input name="brief" onChange={(e) => changeBrief(e.target.value)} value={brief} size="90" placeholder='  Write your design brief here '></input> */}
        <button title="add a new blank Post-it note!" className="add-node-button" onClick={(e) => addNode(false, "", false)}>Add Note</button>
        <button title="add an AI-filled Post-it note!" className="add-node-button" onClick={(e) => addNode(true, "", false)}>Add Surprise Note</button>
      </Panel>
      <Loader loadingState={loadingState}/>
      {/* <Background/> */}
    </ReactFlow>
  );
}

