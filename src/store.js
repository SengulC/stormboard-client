import { applyNodeChanges, applyEdgeChanges, getConnectedEdges, getNodePositionWithOrigin } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import axios from "axios";

async function artificial (sourceLabels, targetLabels, nodeLabel, prompt, brief, charTone) {
  // return await axios.post("https://guai-server.onrender.com/buttons", {nodeLabel, prompt, brief, charTone}).then(response => response.data)
  return await axios.post("http://localhost:8000/buttons", {sourceLabels, targetLabels, nodeLabel, prompt, brief, charTone})
  .then(response => response.data)
};

function setSelectedNodes(nodes) {
  let selectedNodes = [];
  for (let node of nodes) {
    if (node.selected == true) {
      node.data.handleColor = '#e0ab7f';
      selectedNodes.push(node);
    } else {
      node.data.handleColor = '#f6edc3';
    }
  }

  // console.log("selecteds:")
  // for (let snode of selectedNodes) {
  //   console.log(JSON.stringify(snode));
  // }
  return selectedNodes;
}

// MDN web docs
function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
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
  for (let node of nodes) {
    if (node.id == id) {
      return node;
    }
  }
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

function extractEdge(edgeId, edges, nodes) {
  for (let edge of edges) {
    if (edge.id == edgeId) {
      const sourceAndTarget = {source: getNode(edge.source, nodes), target: getNode(edge.target, nodes)};
      return sourceAndTarget;
    }
  }
}


export const useStore = create((set, get) => ({
  nodes: [
    { id: 'a', type: 'postIt', data: { id: 'a', position: '200, 300', label: 'In-house classes', handleColor: '#f6edc3', color: '#ffb3ba' }, position: { x: 200, y: 300 } },
    { id: 'b', type: 'postIt', data: { id: 'b', position: '390, 300', label: 'After school clubs', handleColor: '#f6edc3', color: '#ffdfba' }, position: { x: 390, y: 300 } },
    { id: 'c', type: 'postIt', data: { id: 'c', position: '580, 300', label: 'House competitions', handleColor: '#f6edc3', color: '#ffffba' }, position: { x: 580, y: 300 } }
  ],
  edges:  [],
  selectedNodes: [],
  brief: '',
  briefStructure: {preWhat: 'i am developing a new', preWho: 'to help', preWhere: 'in', preWhy: 'to'},
  briefJSON: {what: '', who: '', where: '', why: ''},
  loadingState: 'hidden',
  charTone: '',
  userTime: 5000,
 
  onNodesChange(changes) {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
    let selecteds = setSelectedNodes(get().nodes);
    set({
      selectedNodes: selecteds,
    });
  },
 
  onEdgesChange(changes) {
    // if change is of type REMOVE. unlink edge. find source and target node of edge and set node data.
    if (changes[0].type =='remove') {
      let sourceAndTarget = extractEdge(changes[0].id, get().edges, get().nodes);
      set({
        nodes: get().nodes.map((node) => {
          if (node.id == sourceAndTarget.target.id) {
            // if curr node is target, remove source linking
            if (node.data.source.length==1) {
              node.data.source = []
            } else {
              node.data.source = node.data.source.splice(node.data.source.indexOf(sourceAndTarget.source.id+1), 1);
            }
          } if (node.id == sourceAndTarget.source.id) {
            if (node.data.target.length==1) {
              node.data.target = []
            } else {
              node.data.target = node.data.target.splice(node.data.target.indexOf(sourceAndTarget.target.id+1), 1);
            }
          }
          return node;
        })
        })
    }
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  setCharTone(charChange) {
    set({charTone: charChange});
  },

  setUserTime(time) {
    set({userTime: time});
  },
 
  async addEdge(data) {
    const id = nanoid(6);
    let edge = { id, ...data };
    edge.animated = true;
    set({ edges: [edge, ...get().edges] });
    const sourceNode = getNode(data.source, get().nodes);
    const targetNode = getNode(data.target, get().nodes);
    let sources; let nodeID;
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === data.target) {
          // set sources here. need to use sources to call artifical.
          node.data.source = (!node.data.source) ? [data.source] :
          Array.isArray(node.data.source) ? [...node.data.source, data.source] :
          [node.data.source, data.source];
          sources = node.data.source;
        } if (node.id === data.source) {
          node.data.target = (!node.data.target) ? [data.target] :
          Array.isArray(node.data.target) ? [...node.data.target, data.target] :
          [node.data.target, data.target];
        }
        return node;
      }),
    });
    // use set sources above below, write label.
    const sourceLabels = getLabelsFromIDs(sources, get().nodes)
    const label = await artificial(sourceLabels, targetNode.data.label, '', 'feed', get().brief);
    set({
      nodes: get().nodes.map((node) => {
        if (node.id === data.target) {
          node.data.label = label;
        }
        return node;
      }),
    });
  },

  setLoadingState(state) {
    set({loadingState: state});
  },

  async addNode(surprise, nodeLabel, merge) {
    var id = nanoid(6);
    let xPos = Math.random() * (500 - 20) + 20; // random
    let yPos = Math.random() * (300 - 20) + 20;
    let position = { x: xPos, y: yPos };
    let node = { id: id, type: 'postIt', data: {id: id, label: '', color: '#bae1ff' }, position: position};
    let label = "";
    if (surprise) {
      set({loadingState: null})
      label = await artificial([], [], node.data.label, 'surprise', get().brief, get().charTone);
      set({loadingState: 'hidden'})
    } else if (merge) {
      label = nodeLabel;
      xPos = 0; yPos = 0;

      // loop thru selected nodes, accumulate their x and y positions

      for (let sNode of get().selectedNodes) {
        xPos += sNode.position.x;
        yPos += sNode.position.y;
      }

      // at the end divide x and y values by number of selected nodes
      xPos = xPos/get().selectedNodes.length;
      yPos = yPos/get().selectedNodes.length;

      position = { x: xPos, y: yPos };
    } else if (nodeLabel!="") {
      label = nodeLabel;
    }
    node = { id: id, type: 'postIt', data: { id: id, label: label, color: '#bae1ff' }, position: position};
    node.zIndex = 999;
    set({ nodes: [node, ...get().nodes] });
  },

  // onNodeClick(node) {
  //   // IMPORTANT: the 'node' passed to this func is the HTML object clicked upon...
  //   // if (!get().selectedNodesHTML.find( currNode => currNode.target.id === node.target.id )) {
  //   //   set({ selectedNodesHTML: [node, ...get().selectedNodesHTML] });
  //   // }
  //   set({ selectedNodes: [setSelectedNodes(get().selectedNodes, get().nodes)] });
  // },

  updateNodeLabel(nodeId, label) {
    set({
      nodes: get().nodes.map((node) => {
        if (node.id == nodeId) {
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

  async callButtonForNodes(prompt, nodes) {
    console.log(`calling ${prompt} for ${nodes.length} buttons.`)
    let appliedNodes = [];
    let randIndex = 0; let randPromptIndex = 0;
    let prompts = ['opposite', 'summarize', 'expand', 'surprise', 'merge', 'regen']
    if (prompt == 'random') {
      randIndex = getRandomInt(0, nodes.length);
      // nodes = nodes.splice(randIndex);
      randPromptIndex = getRandomInt(0, prompts.length);
      prompt = prompts[randPromptIndex]
    }
    for (let node of nodes) {
      set({loadingState: null})
      let label = await artificial([], [], node.data.label, prompt, get().brief, get().charTone);
      node.data.label = label;
      appliedNodes.push(node);
    }
    set({ nodes: appliedNodes });
    set({loadingState: 'hidden'})
    console.log(`CALLED ${prompt} for ${nodes.length} buttons.`)
  },

  setBrief(newBrief) {
    set( {brief: newBrief} );
    return;
  },

  setBriefStructure(newBriefStructure) {
    if (newBriefStructure) {
      console.log((newBriefStructure))
      set( {briefStructure: newBriefStructure} );
    } else {
      console.log("wth is up with structure")
    }
    return;
  },

  setBriefJSON(pronoun, string) {
    let newBrief = get().briefJSON;
    newBrief[pronoun] = string;
    set( {briefJSON: newBrief} );

    let struc = get().briefStructure;
    set( {brief: `${struc.preWhat} ${newBrief.what} ${struc.preWho} ${newBrief.who} ${struc.preWhere} ${newBrief.where} ${struc.preWhy} ${newBrief.why}`} );
    return;
  },

  rearrangeNodes(order) {
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

