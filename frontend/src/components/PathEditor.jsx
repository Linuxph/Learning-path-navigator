import React, { useState, useCallback, useRef } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  Handle,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
// import dataFetching from "../util/dataFetching"; // This import wasn't used
import { toast } from "react-toastify";

// --- 1. Custom Node and Icon Components ---
const TypeIcon = ({ type }) => {
  if (type === "video") {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.55a1 1 0 011.45.89V14a1 1 0 01-1.45.89L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
  }
  if (type === "article") {
    return <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
  }
  return null;
};

const CustomNode = ({ id, data }) => {
  const { label, notes, url, type, isCompleted, onChange, onDelete } = data;

  return (
    <div className="relative group">
      <Handle type="target" id="top"    position={Position.Top}  className="!bg-slate-400 w-3 h-3" />
      <Handle type="target" id="right"  position={Position.Right} className="!bg-slate-400 w-3 h-3" />
      <Handle type="source" id="left"   position={Position.Left}  className="!bg-slate-400 w-3 h-3" />
      <Handle type="source" id="bottom" position={Position.Bottom} className="!bg-slate-400 w-3 h-3" />
      
      <button
        onClick={() => onDelete(id)}
        className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-300 rounded-full flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
        aria-label="Delete node"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>

      <div className="bg-white rounded-lg shadow-md border border-slate-200 p-4 w-64">
        <div className="flex items-center gap-2 mb-2">
          <TypeIcon type={type} />
          <input type="text" value={label} onChange={(e) => onChange(id, { label: e.target.value })} className="text-lg font-bold text-slate-800 bg-transparent focus:outline-none w-full"/>
        </div>
        <div className="relative">
          <input type="text" placeholder="Enter URL..." value={url} onChange={(e) => onChange(id, { url: e.target.value })} className="text-sm text-blue-600 placeholder-slate-400 bg-slate-50 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <textarea placeholder="Description" value={notes} onChange={(e) => onChange(id, { notes: e.target.value })} className="text-sm text-slate-600 bg-slate-50 rounded p-2 w-full mt-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"/>
      </div>
    </div>
  );
};

// --- 2. The Main Editor Component ---
export default function RoadmapEditor() {
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
    const pathData = { userId: localStorage.getItem("userId") ,nodes, edges };
    
    const fire = async () => {
      console.log("Saving roadmap data:", pathData);
      try {
        const response = await fetch("http://localhost:3000/api/path", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: pathData.userId,
            title: pathTitle,
            nodes: pathData.nodes,
            edges: pathData.edges,
          }),
        });

        const responseData = await response.json();
        console.log("Response from server:", responseData);

        if (!response.ok) {
          throw new Error(responseData.message || 'Something went wrong');
        }

        toast.success("Roadmap saved successfully!");
        console.log("Roadmap saved:", responseData);
      } catch (error) {
        toast.error(`Error saving roadmap: ${error.message}`); 
      }
    };

    fire();
  }, [nodes, edges, pathTitle]);

  return (
    <div style={{ display: "flex", height: "90vh", width: "100vw", fontFamily: "sans-serif" }}>
      <div className="sidebar" style={{ width: "250px", padding: "20px", borderRight: "1px solid #e2e8f0", background: "#f8fafc", display: "flex", flexDirection: "column" }}>
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