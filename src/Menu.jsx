// https://codesandbox.io/p/sandbox/dazzling-wright-hledhi?file=%2Fsrc%2FSidebar.tsx%3A1%2C1-77%2C1
import { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import './index.css'
import axios from "axios";
import { useStore } from './store';

export function Menu({ node, deselect }) {
  const { setNodes } = useReactFlow();
  const updateNodeLabel = useStore(state => state.updateNodeLabel);
  const brief = useStore(state => state.brief);
  const nodes = useStore(state => state.nodes);
  const rearrangeNodes = useStore(state => state.rearrangeNodes);
  const selectedNodesData = useStore(state => state.selectedNodesData);
  const addNode = useStore(state => state.addNode);

  node = node ? node : {'id': 'x', 'data':{'label': ''}};
  // console.log(node);

  const [label, setLabel] = useState(node.data.label);

  useEffect(() => {
    setNodes((nodes) =>
      nodes.map((n) => {
        if (node.id === n.id) {
          return {
            ...n,
            data: {
              ...n.data,
              label
            }
          };
        }
        return n;
      })
    );
  }, [label, setNodes]);

  function getSelectedNodesDataLabels(list) {
    let labels = [];
    for (let l of list) {
      for (let node of l) {
        labels.push(node.data.label);
      }
    }
    console.log(labels);
    return labels;
  }

  function artificial (node, prompt, brief, nodes) {
  if (prompt == "merge") {
    const nodelabel = getSelectedNodesDataLabels(selectedNodesData);
    axios.post("http://localhost:8000/buttons", {nodeLabel, prompt, brief, nodes})
    // axios.post("https://guai-server.onrender.com/buttons", {nodelabel, prompt, brief, nodes}) // the var names here matter! nodelabel and prompt are referred to in index.js
    .then((res) => {
      addNode(false, res.data);
    })
    .catch((err => {
        console.error(err);
    }))
  } else {
    for (let data of selectedNodesData) {
      for (let n of data) {
        console.log("n: " + JSON.stringify(n));
        const nodelabel = n.data.label;
        console.log(nodelabel);
        axios.post("http://localhost:8000/buttons", {nodelabel, prompt, brief, nodes})
        // axios.post("https://guai-server.onrender.com/buttons", {nodelabel, prompt, brief, nodes}) // the var names here matter! nodelabel and prompt are referred to in index.js
        .then((res) => {
            if (prompt == "group") {
              rearrangeNodes(res.data);
            } else {
              setLabel(res.data);
              updateNodeLabel(n.id, res.data);
            }
        })
        .catch((err => {
            console.error(err);
        }))
      }
    }
    }
  };

  return (
    <aside className="menu">
      <div className='close-menu' onClick={() => deselect?.()}> X (deselect node) </div>
      <h1> Menu </h1>
      <div>
        <h4>Selected note(s)</h4>
        {/* CUSTOM REACT COMPONENT HERE TO DISPLAY SELECTIONS WELL */}
        <div style={{'backgroundColor': node.data.color}} className="post-it-node curr-node"> 
        <textarea className="post-it-text curr-node-text" value={node.data.label || "Select a node to edit."}> </textarea>
        </div>
        <h4>Supercharge Post-its</h4>
        <div className="art-buttons">
        <button name="opposite" onClick={e => artificial(node, e.target.name, brief, nodes)}> Make-Opposite </button>
        <button name="summarize" onClick={e => artificial(node, e.target.name, brief, nodes)}> Summarize </button>
        <button name="expand" onClick={e => artificial(node, e.target.name, brief, nodes)}> Expand </button>
        <button name="merge" onClick={e => artificial(node, e.target.name, brief, nodes)}> Merge </button>
        <button name="surprise" onClick={e => artificial(node, e.target.name, brief, nodes)}> Surprise Me! </button>
        <button name="group" onClick={e => artificial(node, e.target.name, brief, nodes)}> Group Em'! </button>
        <br></br>
        </div>
      </div>
    </aside>
  );
}

export default Menu;