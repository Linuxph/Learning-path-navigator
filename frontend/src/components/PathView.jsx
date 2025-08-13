import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useParams } from "react-router-dom";
import CustomNode from "./CustomNode";
import BackButton from "./BackButton";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext"; 

const PathView = () => {
  const { token } = useAuth(); 
  const pathId = useParams().pathId;

  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  const nodeTypes = { custom: CustomNode };

  const [quiz, setQuiz] = useState(null);
  const [isLoadingQuiz, setIsLoadingQuiz] = useState(false);

  const startQuiz = async () => {
    setIsLoadingQuiz(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/path/${pathId}/generate-quiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", 
            'Authorization': `Bearer ${token}` 
          },
        }
      );
      const quizData = await response.json();
      setQuiz(quizData);
    } catch (error) {
      toast.error("Could not generate quiz.");
    } finally {
      setIsLoadingQuiz(false);
    }
  };

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
      // Optimistically update the UI for a snappy user experience
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? { ...node, data: { ...node.data, ...updatedData } }
            : node
        )
      );

      // Call the new backend endpoint
      await fetch(`http://localhost:3000/api/node/${nodeId}`, {
        method: "PATCH",
        headers: { 
          "Content-Type": "application/json", 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updatedData),
      });
    } catch (error) {
      console.error("Failed to update node:", error);
      // Optional: Add logic to revert the UI change on failure
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
              'Authorization': `Bearer ${token}`,
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
          },
          detailUrl: `/path/${pathId}/node/${node._id.toString()}`,

          measured: node.measured,
        }));
        console.log("Formatted nodes:", formattedNodes);
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

  return (
    <div className="w-full h-[86vh]">
      <BackButton />
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      />
      <button
        onClick={startQuiz}
        disabled={isLoadingQuiz}
        className="mt-2 px-4 py-2 bg-purple-600 text-white rounded ..."
      >
        {isLoadingQuiz ? "Generating..." : "Start Quiz"}
      </button>
      {quiz && (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg w-1/2">
            {/* You would build your interactive quiz UI here */}
            <h2 className="text-2xl font-bold mb-4">Quiz Time!</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
              {JSON.stringify(quiz, null, 2)}
            </pre>
            <button
              onClick={() => setQuiz(null)}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
            >
              Close Quiz
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PathView;
