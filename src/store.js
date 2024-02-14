import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
import PostItNode from './nodes/PostItNode.jsx';
 
export const useStore = create((set, get) => ({
  nodes: [
    { id: 'b', type: 'postIt', data: { label: 'b' }, position: { x: 50, y: 50 } },
    { id: 'c', type: 'postIt', data: { label: 'c' }, position: { x: -50, y: 100 } }
  ],
  edges: [],
 
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
}));

