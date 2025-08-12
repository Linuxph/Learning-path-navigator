import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
 
const initialNodes = [
  { id: '1', type:'custom', position: { x: 0, y: 0 }, data: { label: 'JavaScript Roadmap' } },
  { id: '2', type:'custom', position: { x: 0, y: 100 }, data: { label: 'Introduction to Node.js' } },
  { id: '3', type:'custom', position: { x: 250, y: 150 }, data: { label: 'Modules' } },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' }, // Connects node 1 to node 2
  { id: 'e2-3', source: '2', target: '3', animated: true }, // An animated edge
];

const nodeTypes = {
  custom: CustomNode,
};

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
 
  const onNodesChange = useCallback(
    (changes) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );
 
  return (
    <div style={{ width: '100vw', height: '80vh' }}>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
}