import React from "react";
import { Handle, Position } from "@xyflow/react";

interface CustomFunctionNodeProps {
  data: {
    content?: string; // Content to display from the connected node
  };
}

const CustomFunctionNode: React.FC<CustomFunctionNodeProps> = ({ data }) => {
  return (
    <div style={{ border: "1px solid #ddd", padding: "10px" }}>
      <h3>Function Node</h3>
      <div>{data.content || "Awaiting input..."}</div>{" "}
      {/* Display connected node content */}
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
};

export default CustomFunctionNode;