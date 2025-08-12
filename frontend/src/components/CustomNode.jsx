// CustomNode.js
import React from 'react';
import { Handle, Position } from '@xyflow/react';

// This is the yellow box with the checkmark from your image
function CustomNode({ data }) {
  return (
    <div style={{
      background: '#fef3c7', // A nice yellow color
      border: '1px solid #fbbF24',
      borderRadius: '5px',
      padding: '10px 15px',
      display: 'flex',
      alignItems: 'center',
    }}>
      {/* This is the little green checkmark circle */}
      <div style={{
          width: '12px',
          height: '12px',
          background: '#16a34a',
          borderRadius: '50%',
          marginRight: '8px',
        }}>
      </div>
      <div>{data.label}</div>

      {/* Handles are the connection points for edges */}
      <Handle type="target" position={Position.Bottom} />
      <Handle type="source" position={Position.Top} />
    </div>
  );
}

export default CustomNode;