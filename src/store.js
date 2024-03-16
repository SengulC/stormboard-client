import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
 
export const useStore = create((set, get) => ({
  nodes: [
    { id: 'b', type: 'postIt', data: { label: 'After school clubs' }, position: { x: 150, y: 150 } },
    { id: 'c', type: 'postIt', data: { label: 'House competitions' }, position: { x: 200, y: 300 } }
  ],
  edges: [],
  selectedNodes: [],
 
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

  addNode(data, isConnectable) {
    var id = nanoid(6);
    let xPos = Math.random() * (1000 - 20) + 20;;
    let yPos = Math.random() * (600 - 20) + 20;;
    const node = { id: id, type: 'postIt', data: { label: '' }, position: { x: xPos, y: yPos } };
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
}));

