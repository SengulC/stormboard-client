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
  const selectedNodes = useStore(state => state.selectedNodes);
  const addNode = useStore(state => state.addNode);

  node = node ? node : {'id': 'x', 'data':{'label': ''}};

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

  function getSelectedNodesLabels(selectedNodes) {
    let labels = [];
    for (let node of selectedNodes) {
      labels.push(node.data.label);
    }
    return labels;
  }

  function getLabelsFromIDs(ids, nodes) {
    let labels = [];
    for (let node of nodes) {
      for (let id of ids) {
        if (node.id === id) {
          labels.push(node.data.label);
        }
      }
    }
    return labels;
  }

  function artificial (prompt, brief, nodes) {
    //sourceLabels, targetLabels, 
    if (prompt == "merge") {
      const nodeLabel = getSelectedNodesLabels(selectedNodes).join(" ");
      console.log("joined labels: " + nodeLabel);
      axios.post("http://localhost:8000/buttons", {nodeLabel, prompt, brief, nodes})
      // axios.post("https://guai-server.onrender.com/buttons", {nodeLabel, prompt, brief, nodes}) // the var names here matter! nodeLabel and prompt are referred to in index.js
      .then((res) => {
        addNode(false, res.data);
      })
      .catch((err => {
          console.error(err);
      }))
    } else if (prompt == "group") {
      axios.post("http://localhost:8000/buttons", {prompt, brief, nodes})
      // axios.post("https://guai-server.onrender.com/buttons", {nodeLabel, prompt, brief, nodes}) // the var names here matter! nodeLabel and prompt are referred to in index.js
      .then((res) => {
          rearrangeNodes(res.data);
      })
      .catch((err => {
          console.error(err);
      }))
    } else {
      for (let n of selectedNodes) {
        let nodeLabel = n.data.label ? n.data.label : "";
        const sourceLabels = n.data.source ? getLabelsFromIDs(n.data.source, nodes) : [];
        const targetLabels = n.data.target ? getLabelsFromIDs(n.data.target, nodes) : [];
        axios.post("http://localhost:8000/buttons", {nodeLabel, sourceLabels, targetLabels, prompt, brief, nodes})
        // axios.post("https://guai-server.onrender.com/buttons", {nodeLabel, prompt, brief, nodes}) // the var names here matter! nodeLabel and prompt are referred to in index.js
        .then((res) => {
            setLabel(res.data);
            updateNodeLabel(n.id, res.data);
        })
        .catch((err => {
            console.error(err);
        }))
        
        for (let targetId of n.data.target) {
          // if current selected node has targets, trigger regen for each target/child node
          nodeLabel = getLabelsFromIDs(targetId, nodes) // get current target/child's labelc
          prompt="regen";
          axios.post("http://localhost:8000/buttons", {nodeLabel, prompt, brief})
          // axios.post("https://guai-server.onrender.com/buttons", {nodeLabel, prompt, brief}) // the var names here matter! nodeLabel and prompt are referred to in index.js
          .then((res) => {
              updateNodeLabel(targetId, res.data);
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
          //prompt, brief, nodes
        <button name="opposite" onClick={e => artificial(e.target.name, brief, nodes)}> Make-Opposite </button>
        <button name="summarize" onClick={e => artificial(e.target.name, brief, nodes)}> Summarize </button>
        <button name="expand" onClick={e => artificial(e.target.name, brief, nodes)}> Expand </button>
        <button name="merge" onClick={e => artificial(e.target.name, brief, nodes)}> Merge </button>
        <button name="surprise" onClick={e => artificial(e.target.name, brief, nodes)}> Surprise Me! </button>
        <button name="group" onClick={e => artificial(e.target.name, brief, selectedNodes)}> Group Em'! </button>
        <br></br>
        </div>
      </div>
    </aside>
  );
}

export default Menu;