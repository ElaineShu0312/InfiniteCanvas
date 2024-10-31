import React from "react";
import { EdgeProps, getBezierPath } from "@xyflow/react";

const WireEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  style = {},
}) => {
  const [edgePath] = getBezierPath({ sourceX, sourceY, targetX, targetY });

  return (
    <g>
      <path
        id={id}
        d={edgePath}
        style={{
          fill: "none",
          stroke: "blue", // Blue color for the wire
          strokeWidth: 1, // Width of the line
          strokeDasharray: "6,4", // Dash pattern
          animation: "dash 1s linear infinite", // Animation for the dashes
          ...style,
        }}
      />
      <style>
        {`
          @keyframes dash {
            to {
              stroke-dashoffset: -20;
            }
          }
        `}
      </style>
    </g>
  );
};

export default WireEdge;
