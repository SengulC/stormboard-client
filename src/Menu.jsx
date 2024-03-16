// https://codesandbox.io/p/sandbox/dazzling-wright-hledhi?file=%2Fsrc%2FSidebar.tsx%3A1%2C1-77%2C1
import { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import './index.css'
import axios from "axios";
import { useStore } from './store';

export function Menu({ node, onClose }) {
  const { setNodes } = useReactFlow();
  const updateNodeLabel = useStore(state => state.updateNodeLabel);

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

  function artificial (node, prompt) {
    // e.preventDefault();
    const nodelabel = node.data.label;
    axios.post("http://localhost:8000/gpt", {nodelabel, prompt}) // the var names here matter! nodelabel and prompt are referred to in index.js
    .then((res) => {
        setLabel(res.data);
        console.log(label);
        updateNodeLabel(node.id, res.data);
        // DOESNT PROPERLY UPDATE NODE LABEL?
        // need to send data to post it node too
    })
    .catch((err => {
        console.error(err);
    }))
  };

  return (
    <aside className="menu">
      <div className='close-menu' onClick={() => onClose?.()}> X </div>
      <h1> Menu </h1>
      <div>
        <h3>Trigger a change in the node</h3>
        <h3>Current node</h3>
        <div> {node.data.label} </div>
        <h4>Supercharge post-it</h4>
        <ul className="art-buttons">
        <button name="opposite" onClick={e => artificial(node, e.target.name)}> Make-Opposite </button>
        <button name="summarize" onClick={e => artificial(node, e.target.name)}> Summarize </button>
        <button name="expand" onClick={e => artificial(node, e.target.name)}> Expand </button>
        <button name="surprise" onClick={e => artificial(node, e.target.name)}> Surprise Me! </button>
        </ul>
      </div>
    </aside>
  );
}

export default Menu;