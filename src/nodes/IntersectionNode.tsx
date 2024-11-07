import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

const IntersectionNode = ({ data }: any) => {
  return (
    <div
      style={{
        padding: 10,
        background: '#ffffff',
        border: '1px solid #333',
        borderRadius: '5px',
      }}
      className={data.className} // Add highlight class dynamically
    >
      <div>{data.label || 'Intersection Node'}</div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default memo(IntersectionNode);
