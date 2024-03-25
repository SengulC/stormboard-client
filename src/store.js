import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import axios from "axios";

async function artificial (node, prompt, brief) {
  const nodelabel = node.data.label;
  return await axios.post("http://localhost:8000/buttons", {nodelabel, prompt, brief}).then(response => response.data)
};

// chatgpt
function generateRandomColor() {
  // Generate random values for R, G, and B
  var r = Math.floor(Math.random() * 256); // Random number between 0 and 255
  var g = Math.floor(Math.random() * 256);
  var b = Math.floor(Math.random() * 256);

  // Convert RGB to hexadecimal
  var hexR = r.toString(16).padStart(2, '0'); // Convert to hexadecimal and ensure at least 2 digits
  var hexG = g.toString(16).padStart(2, '0');
  var hexB = b.toString(16).padStart(2, '0');

  // Concatenate the hexadecimal values
  var hexColor = '#' + hexR + hexG + hexB;

  return hexColor;
};
 
export const useStore = create((set, get) => ({
  nodes: [
    { id: 'a', type: 'postIt', data: { label: 'In-house classes', color: 'yellow' }, position: { x: 200, y: 300 } },
    { id: 'b', type: 'postIt', data: { label: 'After school clubs', color: 'white' }, position: { x: 390, y: 300 } },
    { id: 'c', type: 'postIt', data: { label: 'House competitions', color: 'peachpuff' }, position: { x: 580, y: 300 } }
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
    let xPos = Math.random() * (500 - 20) + 20; // random
    let yPos = Math.random() * (300 - 20) + 20;
    // let xPos = get().nodes[0].position.x + 190; // add to left of last post it
    // let yPos = get().nodes[0].position.y;
    let node = { id: id, type: 'postIt', data: { label: '', color: 'peachpuff' }, position: { x: xPos, y: yPos } };
    let label = "";
    if (surprise) {
      console.log("The brief is: " + get().brief);
      label = await artificial(node, "Surprise me!", get().brief);
      console.log("Got back: " + label);
    }
    node = { id: id, type: 'postIt', data: { label: label, color: 'peachpuff' }, position: { x: xPos, y: yPos } };
    set({ nodes: [node, ...get().nodes] });
    // console.log(get().nodes);
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
          node.data.label = { label };
        }
        return node;
      }),
    });
  },

  updateNodeColor(nodeId, color) {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data.color = { color };
        }
        return node;
      }),
    });
  },

  updateBrief(newBrief) {
    set( {brief: newBrief} );
    // console.log("updating brief to:" + newBrief);
    return;
  },

  rearrangeNodes(order) {
    // let currentNodes = get().nodes;
    /*
    - loop thru order
      move:
      - for # of post its divide page into that #
      - arrange post its in groups of 3 L-R (xPos) next to each other than below each other (yPos)
      OR
      color code:
      - change post its color by changing nodedata
    */

    // order = 
    //   [
    //   ["c_xM2Z", "IOxNzE"], 
    //   ["R7AN_z", "koPZrd"],
    //   ["5UZhRp", "Ved8xX", "Q9tbOx"]
    //   ];

    // group = ["c_xM2Z", "IOxNzE"];
    
    // id = "c_xM2Z";

    // color code

    // const updateNodeColor = useStore(state => state.updateNodeColor);
    // loop thru groupings given by GPT then update the color of those in the SAME group to the SAME random color.
    console.log("IN REARRANGING");
    for (let group of order) {
      let color = generateRandomColor();
      for (let id of group) {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              node.data.color = color;
              console.log("CHANGED COLOR");
            }
            return node;
          }),
        });
        // updateNodeColor(id, generateRandomColor());
      }
    }

  }
}));

