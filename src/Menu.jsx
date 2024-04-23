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
  const setLoadingState = useStore(state => state.setLoadingState);
  const setCharTone = useStore(state => state.setCharTone);
  const charTone = useStore(state => state.charTone);
  const userTime = useStore(state => state.userTime);
  const setUserTime = useStore(state => state.setUserTime);
  const setBriefStructure = useStore(state => state.setBriefStructure);
  const briefStructure = useStore(state => state.briefStructure);

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

  function artificialCharacter (charTone) {
    setLoadingState(null);
    axios.post("http://localhost:8000/buttons", {charTone})
    // axios.post("https://guai-server.onrender.com/buttons", {nodeLabel, prompt, brief, nodes}) // the var names here matter! nodeLabel and prompt are referred to in index.js
    .then((res) => {
      setLoadingState('hidden');
      setCharTone(charTone);
      setBriefStructure(res.data);
      // setBriefStructure({preWhat: 'Crafting a', preWho: 'within', preWhere: 'amidst', preWhy: 'pursuing'});
    })
    .catch((err => {
        console.error(err);
    }))
  }

  function artificial (prompt, brief, nodes, charTone) {
    setLoadingState(null);
    //sourceLabels, targetLabels, 
    if (prompt == "merge") {
      const nodeLabel = getSelectedNodesLabels(selectedNodes).join(" ");
      axios.post("http://localhost:8000/buttons", {nodeLabel, prompt, brief, nodes, charTone})
      // axios.post("https://guai-server.onrender.com/buttons", {nodeLabel, prompt, brief, nodes}) // the var names here matter! nodeLabel and prompt are referred to in index., charTonejs
      .then((res) => {
        addNode(false, res.data, true);
        setLoadingState('hidden');
      })
      .catch((err => {
          console.error(err);
      }))
    } else if (prompt == "group") {
      axios.post("http://localhost:8000/buttons", {prompt, brief, nodes, charTone})
      // axios.post("https://guai-server.onrender.com/buttons", {nodeLabel, prompt, brief, nodes}) // the var names here matter! nodeLabel and prompt are referred to in index., charTonejs
      .then((res) => {
          rearrangeNodes(res.data);
          setLoadingState('hidden');
      })
      .catch((err => {
          console.error(err);
      }))
    } else {
      for (let n of selectedNodes) {
        let nodeLabel = n.data.label ? n.data.label : "";
        const sourceLabels = n.data.source ? getLabelsFromIDs(n.data.source, nodes) : [];
        const targetLabels = n.data.target ? getLabelsFromIDs(n.data.target, nodes) : [];
        updateNodeLabel(n.id, "...");
        axios.post("http://localhost:8000/buttons", {nodeLabel, sourceLabels, targetLabels, prompt, brief, nodes, charTone})
        // axios.post("https://guai-server.onrender.com/buttons", {nodeLabel, prompt, brief, nodes}) // the var names here matter! nodeLabel and prompt are referred to in index., charTonejs
        .then((res) => {
            setLabel(res.data);
            updateNodeLabel(n.id, res.data);
            setLoadingState('hidden');
        })
        .catch((err => {
            console.error(err);
        }))
        
        if (n.data.target) {for (let targetId of n.data.target) {
          // if current selected node has targets, trigger regen for each target/child node
          nodeLabel = getLabelsFromIDs(targetId, nodes) // get current target/child's labelc
          prompt="regen";
          let sourceLabels = [n.data.label];
          updateNodeLabel(targetId, "...");
          axios.post("http://localhost:8000/buttons", {nodeLabel, prompt, brief, sourceLabels, charTone})
          // axios.post("https://guai-server.onrender.com/buttons", {nodeLabel, prompt, brief}) // the var names here matter! nodeLabel and prompt are referred to in index., charTonejs
          .then((res) => {
              updateNodeLabel(targetId, res.data);
              setLoadingState('hidden');
          })
          .catch((err => {
              console.error(err);
          }))
        }}
      }
    }
    return;
  };

  return (
    <aside className="menu">
      <div className='close-menu' onClick={() => deselect?.()}> X (deselect node) </div>
      <h1> Menu </h1>
        <h4>Selected note(s)</h4>
        {(selectedNodes.length)>1 ? <div style={{'backgroundColor': selectedNodes[1].data.color}} className="post-it-node child curr-node"/> : <></>}
        <div style={{'backgroundColor': node.data.color}} className="post-it-node curr-node"> 
          <textarea readOnly className="post-it-text curr-node-text" value={node.data.label || "Select or type into nodes to begin editing!" }> </textarea>
          {(selectedNodes.length)>1 ? <p className="multipleSelection"> + {selectedNodes.length-1} more </p> : <></>}
        </div>
        <h4>Supercharge Post-its</h4>
        <div className="art-buttons">
          <button name="opposite" onClick={e => artificial(e.target.name, brief, nodes, charTone)}> Make-Opposite </button>
          <button name="summarize" onClick={e => artificial(e.target.name, brief, nodes, charTone)}> Summarize </button>
          <button name="expand" onClick={e => artificial(e.target.name, brief, nodes, charTone)}> Expand </button>
          <button name="merge" onClick={e => artificial(e.target.name, brief, nodes, charTone)}> Merge </button>
          <button name="surprise" onClick={e => artificial(e.target.name, brief, nodes, charTone)}> Surprise Me! </button>
          <button name="group" onClick={e => artificial(e.target.name, brief, selectedNodes, charTone)}> Group Em'! </button>
          <div id='realistic' onClick={e => artificialCharacter(e.target.id)}> Realistic </div>
            <input onChange={e => setUserTime(e.target.value)} value={userTime} min='000' max='600000' type="range"></input>
            <p>{userTime}</p>
          <div id='abstract' onClick={e => artificialCharacter(e.target.id)}> Abstract </div>
          <div id='off' onClick={e => artificialCharacter(e.target.id)}> Off </div>
          <br></br>
        </div>
    </aside>
  );
}

export default Menu;