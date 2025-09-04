import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import CustomNode from "./CustomNode";
import BackButton from "./BackButton";
import { useAuth } from "../context/AuthContext";

const PathView = () => {
  const { token } = useAuth();
  const pathId = useParams().pathId;
  const navigate = useNavigate();


  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const nodeTypes = { custom: CustomNode };

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const handleNodeUpdate = async (nodeId, updatedData) => {
    try {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updatedData } }
            : node
        )
      );

      await fetch(`http://localhost:3000/api/node/update/${nodeId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });
    } catch (error) {
      toast.error("Failed to update node. Please try again.");
    }
  };

  useEffect(() => {
    const fetchPath = async () => {
      try {
        if (!token) {
          return; // Don't do anything if there's no token yet
        }
        if (!pathId) {
          console.error("Path ID is not provided");
          return;
        }

        const response = await fetch(
          `http://localhost:3000/api/path/${pathId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch path");
        }
        const data = await response.json();
        console.log("Fetched path:", data);
        const formattedNodes = data.nodes.map((node) => ({
          id: node._id.toString(),
          type: node.type,
          position: node.position,
          data: {
            label: node.data.label,
            notes: node.data.notes,
            url: node.data.url,
            type: node.data.type,
            isCompleted: node.data.isCompleted,
            onChange: handleNodeUpdate,
            detailUrl: `/path/${pathId}/node/${node._id.toString()}`,
          },

          measured: node.measured,
        }));
        console.log("Formatted nodes:", formattedNodes);
        console.log(formattedNodes[0].detailUrl);
        setNodes(formattedNodes);

        const formattedEdges = data.edges.map((edge) => ({
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
  }, [pathId, setNodes, setEdges]);

  const handleNodeClick = (event, node) => {
    // The 'node' object contains the data for the node that was clicked
    if (node.data && node.data.detailUrl) {
      navigate(node.data.detailUrl);
    }
  };

  return (
    <div className="w-full h-[86vh]">
      <BackButton />
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        onConnect={onConnect}
        fitView
      />
    </div>
  );
};

export default PathView;
