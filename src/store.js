import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
 
export const useStore = create((set, get) => ({
  nodes: [
    { id: 'b', type: 'postIt', data: { label: 'Text' }, position: { x: 150, y: 150 } },
    { id: 'c', type: 'postIt', data: { label: 'More text' }, position: { x: 150, y: 300 } }
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
    const node = { id: id, type: 'postIt', data: { label: 'new text' }, position: { x: 0, y: 0 } };
    console.log('adding node:' + node)
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
          // it's important to create a new object here, to inform React Flow about the cahnges
          node.data = { label };
        }
        return node;
      }),
    });
  },
}));

