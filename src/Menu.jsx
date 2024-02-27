// https://codesandbox.io/p/sandbox/dazzling-wright-hledhi?file=%2Fsrc%2FSidebar.tsx%3A1%2C1-77%2C1
import { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import './index.css'
import axios from "axios";

export function Menu({ node, onClose }) {
  const { setNodes } = useReactFlow();

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

    function artificial (prompt) {
        // e.preventDefault();
        console.log(prompt);

        axios.post("http://localhost:8000/gpt", {label, prompt})
        .then((res) => {
            setLabel(res.data);
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
        <h4>Change post-it</h4>
        <input value={/*node.data.*/label} type="text" onChange={(e) => {setLabel(e.currentTarget.value);}}/>
        <h4>Supercharge post-it</h4>
        <ul className="art-buttons">
        <button name="opposite" onClick={e => artificial(e.target.name)}> Make-Opposite </button>
        <button name="summarize" onClick={e => artificial(e.target.name)}> Summarize </button>
        <button name="expand" onClick={e => artificial(e.target.name)}> Expand </button>
        </ul>
      </div>
    </aside>
  );
}

export default Menu;