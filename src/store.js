import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import axios from "axios";

async function artificial (node, prompt, brief) {
  const nodelabel = node.data.label;
  return await axios.post("http://localhost:8000/buttons", {nodelabel, prompt, brief}).then(response => response.data)
};
 
export const useStore = create((set, get) => ({
  nodes: [
    { id: 'b', type: 'postIt', data: { label: 'After school clubs' }, position: { x: 150, y: 150 } },
    { id: 'c', type: 'postIt', data: { label: 'House competitions' }, position: { x: 200, y: 300 } }
  ],
  edges: [],
  selectedNodes: [],
  brief: '',
 
  onNodesChange(changes) {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
 
  onEdgesChange(changes) {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
 
  addEdge(data) {
    const id = nanoid(6);
    const edge = { id, ...data };
 
    set({ edges: [edge, ...get().edges] });
  },

  async addNode(surprise) {
    var id = nanoid(6);
    let xPos = Math.random() * (500 - 20) + 20;
    let yPos = Math.random() * (300 - 20) + 20;
    let node = { id: id, type: 'postIt', data: { label: '' }, position: { x: xPos, y: yPos } };
    let label = "";
    if (surprise) {
      console.log("The brief is: " + get().brief);
      label = await artificial(node, "Surprise me!", get().brief);
      console.log("Got back: " + label);
    }
    node = { id: id, type: 'postIt', data: { label: label }, position: { x: xPos, y: yPos } };
    set({ nodes: [node, ...get().nodes] });
  },

  onNodeClick(node) {
    // console.log(node.target.getAttribute("id"));
    // console.log(node.target.getElementsByTagName('textarea')[0].value);

    // if node not already in selectedNodes...
    set({ selectedNodes: [node, ...get().selectedNodes] });
    console.log(get().selectedNodes[0].target.getElementsByTagName('div')[1]);
    console.log(get().selectedNodes[0].target.getElementsByTagName('textarea')[0].value);
  },

  updateNodeLabel(nodeId, label) {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { label };
        }
        return node;
      }),
    });
  },

  updateBrief(newBrief) {
    set( {brief: newBrief} );
    // console.log("updating brief to:" + newBrief);
    return;
  }
}));

