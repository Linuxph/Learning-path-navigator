import React, { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { toast } from "react-toastify";
import CustomNode from "./CustomNode"; 
import BackButton from "./BackButton";
import { useAuth } from "../context/AuthContext"; 


// --- 2. The Main Editor Component ---
export default function RoadmapEditor() {
  const { user,token } = useAuth(); 
  const [pathTitle, setPathTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const nodeTypes = { custom: CustomNode };
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const nodeIdCounter = useRef(0);

  const updateNodeData = (nodeId, updatedData) => {
    setNodes((nds) => nds.map((node) => node.id === nodeId ? { ...node, data: { ...node.data, ...updatedData } } : node));
  };

  const deleteNode = useCallback((nodeId) => {
    setNodes((nds) => nds.filter((node) => node.id !== nodeId));
    setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));
    toast.info("Node deleted");
  }, [setNodes, setEdges]);

  const addNode = useCallback(() => {
    nodeIdCounter.current += 1;
    const newId = nodeIdCounter.current;
    const newNode = {
      id: `node-${newId}`,
      type: "custom",
      position: { x: Math.random() * 400, y: Math.random() * 200 },
      data: {
        label: `Topic ${newId}`,
        type: "article",
        url: "",
        notes: "",
        isCompleted: false,
        onChange: updateNodeData,
        onDelete: deleteNode, 
      },
    };
    setNodes((currentNodes) => [...currentNodes, newNode]);
  }, [setNodes, deleteNode]); 

  const onConnect = useCallback((params) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: "#334155" } }, eds)), [setEdges]);

  const onSave = useCallback(() => {

    const pathData = { userId: user.id  ,nodes, edges };


    console.log(pathData);
    
    const fire = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/path", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({
            userId: pathData.userId,
            title: pathTitle,
            nodes: pathData.nodes,
            edges: pathData.edges,
          }),
        });

        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message || 'Something went wrong');
        }

        toast.success("Roadmap saved successfully!");
      } catch (error) {
        toast.error(`Error saving roadmap: ${error.message}`); 
      }
    };

    fire();
  }, [nodes, edges, pathTitle]);

  return (
    <div style={{ display: "flex", height: "90vh", width: "100vw", fontFamily: "sans-serif" }}>
      <div className="sidebar" style={{ width: "250px", padding: "20px", borderRight: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
        <BackButton />
        <h2 style={{ marginTop: 0, borderBottom: "1px solid #e2e8f0", paddingBottom: "15px" }}>
          {pathTitle ? pathTitle : "Roadmap Editor"}
        </h2>
        <p>{pathTitle ? "Build your learning path." : "First, set a title for your roadmap."}</p>
        <button onClick={pathTitle ? addNode : () => setIsModalOpen(true)} className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors mb-5">
          {pathTitle ? "Add New Topic" : "Set Roadmap Title"}
        </button>
        <div style={{ marginTop: "auto" }}>
          <button onClick={onSave} className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors">
            Save Roadmap
          </button>
        </div>
      </div>
      {isModalOpen && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-bold mb-4">Set Your Roadmap Title</h3>
            <form onSubmit={(e) => {
                e.preventDefault();
                const title = e.target.elements.title.value;
                if (title) { setPathTitle(title); setIsModalOpen(false); }
              }}>
              <input name="title" type="text" placeholder="e.g., 'React for Beginners'" className="w-full border border-slate-300 rounded px-3 py-2 mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none" autoFocus/>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-200 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save Title</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div style={{ flexGrow: 1 }}>
        <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} nodeTypes={nodeTypes} fitView>
          <Background />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
}