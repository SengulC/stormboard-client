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
  const pastelColors = [
    "#FFB6C1", // Light Pink
    "#DB7093", // Pale Violet
    "#89CFF0", // Baby Blue
    "#98FF98", // Mint Green
    "#E6E6FA", // Lavender
    "#FFDAB9", // Peach
    "#FFFFE0", // Light Yellow
    "#FFA07A", // Light Salmon
    "#FFC0CB", // Pink
    "#B0E0E6", // Powder Blue
    "#ADD8E6", // Light Blue
    "#87CEEB", // Sky Blue
    "#87CEFA", // Light Sky Blue
    "#00BFFF", // Deep Sky Blue
    "#AFEEEE", // Pale Turquoise
    "#F0FFFF", // Azure
    "#F0F8FF", // Alice Blue
    "#F0FFF0", // Honeydew
    "#FFFAF0", // Floral White
    "#F5FFFA"  // Mint Cream
  ];
  return pastelColors[getRandomInt(0,pastelColors.length)];
  // Generate random values for R, G, and B
  // var r = Math.floor(Math.random() * 256); // Random number between 0 and 255
  // var g = Math.floor(Math.random() * 256);
  // var b = Math.floor(Math.random() * 256);

  // // Convert RGB to hexadecimal
  // var hexR = r.toString(16).padStart(2, '0'); // Convert to hexadecimal and ensure at least 2 digits
  // var hexG = g.toString(16).padStart(2, '0');
  // var hexB = b.toString(16).padStart(2, '0');

  // // Concatenate the hexadecimal values
  // var hexColor = '#' + hexR + hexG + hexB;

  // return hexColor;
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
  briefStructure: {preWhat: 'I am creating a new', preWho: 'to help', preWhere: 'in', preWhy: 'to'},
  briefJSON: {what: '', who: '', where: '', why: ''},
  loadingState: 'hidden',
  charTone: 'off',
  userTime: 60000,
  straightforwardStructures: [
    { preWhat: 'Creating a new', preWho: 'to assist', preWhere: 'for use in', preWhy: 'to improve' },
    { preWhat: 'Designing an innovative', preWho: 'to support', preWhere: 'across various platforms', preWhy: 'to enhance' },
    { preWhat: 'Developing a robust', preWho: 'to serve', preWhere: 'in the', preWhy: 'to optimize' },
    { preWhat: 'Building an efficient', preWho: 'for the benefit of', preWhere: 'across different industries', preWhy: 'to streamline' },
    { preWhat: 'Crafting a user-friendly', preWho: 'to empower', preWhere: 'for seamless integration', preWhy: 'to simplify' },
    { preWhat: 'Revamping the', preWho: 'to modernize', preWhere: 'for the', preWhy: 'to enhance efficiency' },
    { preWhat: 'Introducing a cutting-edge', preWho: 'to revolutionize', preWhere: 'across industries', preWhy: 'to drive innovation' },
    { preWhat: 'Optimizing the performance of', preWho: 'to benefit', preWhere: 'in various sectors', preWhy: 'to achieve optimal outcomes' },
    { preWhat: 'Launching an innovative', preWho: 'to address the needs of', preWhere: 'across markets', preWhy: 'to provide solutions' },
    { preWhat: 'Creating a seamless', preWho: 'to cater to the requirements of', preWhere: 'for efficient operations', preWhy: 'to ensure smooth functionality' },
    {preWhat: 'I am creating a new', preWho: 'to help', preWhere: 'in', preWhy: 'to'},
  ],
  abstractStructures: [
    { preWhat: 'Embarking on a visionary', preWho: 'to inspire', preWhere: 'across boundless horizons', preWhy: 'to ignite' },
    { preWhat: 'Weaving a tapestry of dreams', preWho: 'to illuminate', preWhere: 'within the realm of imagination', preWhy: 'to transcend' },
    { preWhat: 'Exploring the depths of creativity', preWho: 'to evoke', preWhere: 'in the infinite expanse', preWhy: 'to awaken' },
    { preWhat: 'Navigating the labyrinth of possibilities', preWho: 'to provoke thought', preWhere: 'amidst ethereal landscapes', preWhy: 'to catalyze' },
    { preWhat: 'Venturing into the unknown', preWho: 'to evoke wonder', preWhere: 'beyond the veil of reality', preWhy: 'to transcend boundaries' },
    { preWhat: 'Exploring the uncharted territories of', preWho: 'to discover new perspectives on', preWhere: 'beyond conventional boundaries', preWhy: 'to expand horizons' },
    { preWhat: 'Navigating the intricate landscapes of', preWho: 'to uncover hidden insights into', preWhere: 'amidst the complexities of', preWhy: 'to unlock potential' },
    { preWhat: 'Embarking on an odyssey of', preWho: 'to delve into the mysteries of', preWhere: 'in pursuit of enlightenment', preWhy: 'to transcend limitations' },
    { preWhat: 'Venturing into the ethereal realms of', preWho: 'to explore the essence of', preWhere: 'beyond tangible boundaries', preWhy: 'to inspire imagination' },
    { preWhat: 'Weaving a tapestry of innovation in', preWho: 'to reimagine possibilities for', preWhere: 'across the spectrum of', preWhy: 'to shape the future' }
  ],
 
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
    if (charChange!='off'){
    let tonedStructure = {realistic: get().straightforwardStructures, abstract: get().abstractStructures}
    let randomIndex = getRandomInt(0, 4);
    set({briefStructure: tonedStructure[charChange][randomIndex]})
  }
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
    let node = { id: id, type: 'postIt', data: {id: id, label: '', color: generateRandomColor() }, position: position};
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
    node = { id: id, type: 'postIt', data: { id: id, label: label, color: generateRandomColor() }, position: position};
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
    let randPromptIndex = 0;
    let prompts = ['opposite', 'summarize', 'expand', 'surprise', 'merge', 'regen']
    if (prompt == 'random') {
      randPromptIndex = getRandomInt(0, prompts.length);
      prompt = prompts[randPromptIndex]
      var id = nanoid(6);
      let xPos = Math.random() * (500 - 20) + 20; // random
      let yPos = Math.random() * (300 - 20) + 20;
      let position = { x: xPos, y: yPos };
      let surpriseNode = { id: id, type: 'postIt', data: {id: id, label: '', color: generateRandomColor() }, position: position};
      let label = "";
      set({loadingState: null})
      label = await artificial([], [], surpriseNode.data.label, 'surprise', get().brief, get().charTone);
      set({loadingState: 'hidden'})
      surpriseNode.data.label = label;
      appliedNodes.push(surpriseNode);
    }
    for (let node of nodes) {
      set({loadingState: null})
      let nodeLabel = node.data.label;
      node.data.label = "...";
      let label = await artificial([], [], nodeLabel, prompt, get().brief, get().charTone);
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
      set( {briefStructure: newBriefStructure} );
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

