import { applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { nanoid } from 'nanoid';
import { create } from 'zustand';
 
export const useStore = create((set, get) => ({
  nodes: [
    { id: 'a', data: { label: 'a' }, position: { x: 0, y: 0 } },
    { id: 'b', data: { label: 'b' }, position: { x: 50, y: 50 } },
    { id: 'c', data: { label: 'c' }, position: { x: -50, y: 100 } }
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
}));