import { applyNodeChanges, applyEdgeChanges, getConnectedEdges, getNodePositionWithOrigin } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import axios from "axios";

async function artificial (sourceLabels, targetLabels, nodeLabel, prompt, brief) {
  // return await axios.post("https://guai-server.onrender.com/buttons", {nodelabel, prompt, brief}).then(response => response.data)
  console.log(`About to post! ${sourceLabels} ${targetLabels} ${prompt} ${nodeLabel} ${brief}`)
  return await axios.post("http://localhost:8000/buttons", {sourceLabels, targetLabels, nodeLabel, prompt, brief}).then(response => response.data)
};

// chatgpt
function getandPrintTextareaValues(list) {
  const textareaValues = [];

  // Iterate through the list of objects
  for (let i = 0; i < list.length; i++) {
      const target = list[i].target;
      
      // Check if target exists and has a textarea
      if (target && target.getElementsByTagName('textarea').length > 0) {
          const textarea = target.getElementsByTagName('textarea')[0];
          const textareaValue = textarea.value;
          textareaValues.push(textareaValue);
      }
  }

  // Log each textarea value in the specified format
  console.log("Textarea values:");
  console.log("[");
  for (let i = 0; i < textareaValues.length; i++) {
      console.log(`  "${textareaValues[i]}"${i < textareaValues.length - 1 ? "," : ""}`);
  }
  console.log("]");

  return textareaValues;
}

function setSelectedNodesData(list) {
  const selectedNodesData = [];
  // Iterate through the list of objects
  for (let i = 0; i < list.length; i++) {
    const target = list[i].target;
    
    // Check if target exists and has a textarea
    if (target && target.getElementsByTagName('textarea').length > 0) {
        const textareaValue = target.getElementsByTagName('textarea')[0].value;
        const id = target.id;
        const node = {id: id, data: {label: textareaValue}};
        selectedNodesData.push(node);
    }
  }
  return selectedNodesData;
}

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

function getNode(id, nodes) {
  console.log("in get node. id is: " + id);
  // given id, return node object:
  // { id: 'a', type: 'postIt', data: { id: 'a', position: '200, 300', source: '', label: 'In-house classes', color: '#ffb3ba' }, position: { x: 200, y: 300 } }
  // from nodes.

  for (let node of nodes) {
    if (node.id == id) {
      return node;
    }
  }
}
 
export const useStore = create((set, get) => ({
  nodes: [
    { id: 'a', type: 'postIt', data: { id: 'a', position: '200, 300', label: 'In-house classes', color: '#ffb3ba' }, position: { x: 200, y: 300 } },
    { id: 'b', type: 'postIt', data: { id: 'b', position: '390, 300', label: 'After school clubs', color: '#ffdfba' }, position: { x: 390, y: 300 } },
    { id: 'c', type: 'postIt', data: { id: 'c', position: '580, 300', label: 'House competitions', color: '#ffffba' }, position: { x: 580, y: 300 } }
  ],
  edges:  [],
  selectedNodesHTML: [],
  selectedNodesData: [],
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
 
  async addEdge(data) {
    const id = nanoid(6);
    const edge = { id, ...data };
    set({ edges: [edge, ...get().edges] });
    const sourceNode = getNode(data.source, get().nodes);
    const targetNode = getNode(data.target, get().nodes);
    const label = await artificial(sourceNode.data.label, targetNode.data.label, 'feed', get().brief);
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === data.target) {
          node.data.source = (!node.data.source) ? [data.source] : [node.data.source, data.source];
          node.data.label = label;
          // node.data.label = `my parents: ${node.data.source}. my children: ${node.data.target}`;
        } if (node.id === data.source) {
          node.data.target = (!node.data.target) ? [data.target] : [node.data.target, data.target];
          // node.data.label = `my parents: ${node.data.source}. my children: ${node.data.target}`;
        }
        return node;
      }),
    });
  },

  async addNode(surprise, nodeLabel) {
    var id = nanoid(6);
    let xPos = Math.random() * (500 - 20) + 20; // random
    let yPos = Math.random() * (300 - 20) + 20;
    // let xPos = get().nodes[0].position.x + 190; // add to left of last post it
    // let yPos = get().nodes[0].position.y;
    let node = { id: id, type: 'postIt', data: {id: id, label: '', color: '#bae1ff' }, position: { x: xPos, y: yPos } };
    let label = "";
    if (surprise) {
      label = await artificial("", "", node.data.label, 'surprise', get().brief);
    } else if (nodeLabel!="") {
      label = nodeLabel;
    }
    node = { id: id, type: 'postIt', data: { id: id, label: label, color: '#bae1ff' }, position: { x: xPos, y: yPos } };
    set({ nodes: [node, ...get().nodes] });
  },

  onNodeClick(node) {
    // IMPORTANT: the 'node' passed to this func is the HTML object clicked upon...
    if (!get().selectedNodesHTML.find( currNode => currNode.target.id === node.target.id )) {
      set({ selectedNodesHTML: [node, ...get().selectedNodesHTML] });
    }
    set({ selectedNodesData: [setSelectedNodesData(get().selectedNodesHTML)] });
  },

  updateNodeLabel(nodeId, label) {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data.label = label;
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
    return;
  },

  rearrangeNodes(order) {
    // let currentNodes = get().nodes;
    /*
    - loop thru order
      move:
      - for # of post its divide page into that #
      - arrange post its in groups of 3 L-R (xPos) next to each other than below each other (yPos)
    */
    for (let group of order) {
      let color = generateRandomColor();
      for (let id of group) {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              node.data.color = color;
            }
            return node;
          }),
        });
      }
    }
  },

  onNodeDrag (evt, node) {
    const centerX = node.position.x + node.width / 2;
    const centerY = node.position.y + node.height / 2;

    const targetNode = nodes.find(
      (n) =>
        centerX > n.position.x &&
        centerX < n.position.x + n.width &&
        centerY > n.position.y &&
        centerY < n.position.y + n.height &&
        n.id !== node.id
    );

    return targetNode;
  },
  updateParent(nodeId, targetID) {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.parentNode = targetID;
          if (targetID != null) {
            node.position = {x:50, y:90};
          } else {
            node.position = {x:node.position.x, y:node.position.y};
          }
        }
        return node;
      }),
    });
  }
}));

