import { useCallback, useRef, useState, useEffect} from 'react';
import { Handle, Position } from 'reactflow';
import '../index.css'
import '../openai-test'
import { nanoid } from 'nanoid';
import { useStore } from '../store';
import axios from "axios";

function PostIt({ data, isConnectable }) {
  const [prompt, setPrompt] = useState(data.label);
  const updateNodeLabel = useStore(state => state.updateNodeLabel);
  const brief = useStore(state => state.brief);
  const nodes = useStore(state => state.nodes);

  function trigger(e) {
    setPrompt(e.target.value);
    data.label=e.target.value;
    return;
  }

  function getNodeLabel(id, nodes) {
    for (let node of nodes) {
      if (node.id == id) {
        return node.data.label;
      }
    }
  }

  function artificial(e, data) {
    for (let cTarget of data.target) {
      let prompt = "regen";
    let nodeLabel = getNodeLabel(cTarget, nodes);
    let sourceLabels = [e.target.value];
    updateNodeLabel(cTarget, "...");
    // axios.post("http://localhost:8000/buttons", {sourceLabels, nodeLabel, prompt, brief})
    axios.post("https://guai-server.onrender.com/buttons", {sourceLabels, nodeLabel, prompt, brief})
    .then((res) => {
      updateNodeLabel(cTarget, res.data); // not updating?
    })
    .catch((err => {
        console.error(err);
    }))
  }
  }

  return (
    <div id={data.id} style={{'backgroundColor': data.color}} className={`post-it-node`}>
      <Handle style={{'backgroundColor': data.handleColor}} type="target" position={Position.Top} isConnectable={isConnectable} />
        <textarea id={nanoid(6)} className={`nopan nodrag post-it-text`} name="text" value={data.label} onBlur={(e) => {if(data.target) {artificial(e, data)}}} onChange={(e) => trigger(e)} />
        <Handle style={{'backgroundColor': data.handleColor}} type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}

// need the textarea value to be something within PostIt (data, data.label...)
// also need useState to render quickly

export default PostIt;