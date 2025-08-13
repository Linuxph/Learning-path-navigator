import React from 'react';
import { Handle, Position } from '@xyflow/react';

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
  const { label, description, url, type, isCompleted, onChange, onDelete } = data;

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
        
        <textarea placeholder="Description" value={description} onChange={(e) => onChange(id, { description: e.target.value })} className="text-sm text-slate-600 bg-slate-50 rounded p-2 w-full mt-2 h-20 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        <div className="flex items-center justify-between mt-2">
          <label className="flex items-center">
            <input type="checkbox" checked={isCompleted} onChange={(e) => onChange(id, { isCompleted: e.target.checked })} className="mr-2" />
            <span className="text-sm text-slate-600">Completed</span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default CustomNode;