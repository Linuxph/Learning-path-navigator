import React, { useCallback, useEffect, useState } from 'react'
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useParams } from 'react-router-dom';
import CustomNode from './CustomNode';


const PathView = () => {
  const pathId = useParams().pathId;
  
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  
  const nodeTypes = { custom: CustomNode };

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
  
  useEffect(() => {
    const fetchPath = async () => {
      try {

        if(!pathId) {
          console.error("Path ID is not provided");
          return;
        }

        const response = await fetch(`http://localhost:3000/api/path/${pathId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch path");
        }
        const data = await response.json();
        console.log("Fetched path:", data);
        const formattedNodes = data.nodes.map(node => ({
          id: node._id.toString(), 
          type: node.type,
          position: node.position,
          data: {
            label: node.data.label,
            notes: node.data.notes,
            url: node.data.url,
            type: node.data.type,
            isCompleted: node.data.isCompleted,
          },
          measured: node.measured,
        }));
        console.log("Formatted nodes:", formattedNodes);
        setNodes(formattedNodes);
        
        const formattedEdges = data.edges.map(edge => ({
          id: edge._id.toString(),
          source: edge.source.toString(),
          target: edge.target.toString(),
          animated: true,
          style: { stroke: edge.style.stroke },
        }));
        setEdges(formattedEdges);

      } catch (error) {
        console.error("An error occurred while fetching the path:", error);
      }
    };
    fetchPath();
    
  }, [pathId, setNodes, setEdges])
  

  return (
    <div className='w-full h-[91vh]'>
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
  )
}

export default PathView