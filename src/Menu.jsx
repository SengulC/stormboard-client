// https://codesandbox.io/p/sandbox/dazzling-wright-hledhi?file=%2Fsrc%2FSidebar.tsx%3A1%2C1-77%2C1
import { useEffect, useState } from "react";
import { useReactFlow } from "reactflow";
import './index.css'

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

    const artificial = (e) => {
    setLabel(label + " change");
    // e.preventDefault();

    // axios.post("http://localhost:8000/gpt", {prompt})
    // .then((res) => {
    //   setResponse(res.data);
    //   setPrompt(res.data);
    // })
    // .catch((err => {
    //   console.error(err);
    // }))
  };

  return (
    <aside className="menu">
      <div className='close-menu' onClick={() => onClose?.()}> X </div>
      <h1> Menu </h1>
      <div>
        <h2>Trigger a change in the node</h2>
        <h3>Change post-it</h3>
        <input
          value={label}
          type="text"
          onChange={(e) => {
            setLabel(e.currentTarget.value);
          }}
        />
        <h3>Supercharge post-it</h3>
        <button onClick={artificial}> Make-Opposite </button>
      </div>
    </aside>
  );
}

export default Menu;