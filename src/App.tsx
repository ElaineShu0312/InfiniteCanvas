import { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { AppNode } from "./nodes/types";
import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect: OnConnect = useCallback(
    (connection) => {
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      // Check if the target node is of type "functionNode"
      if (targetNode && targetNode.type === "function") {
        const animatedConnection = { ...connection, type: "wire" }; // Use custom wire edge type
        setEdges((edges) => addEdge(animatedConnection, edges));

        // Copy content from sourceNode to targetNode's content field if applicable
        if (sourceNode && targetNode) {
          console.log("Connected to function node");
          console.log("content: " + sourceNode.data.content);

          setNodes(
            (nodes) =>
              nodes.map((node) =>
                node.id === targetNode.id
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        // Copy label or content from sourceNode to targetNode's content field
                        content:
                          "content" in sourceNode.data
                            ? sourceNode.data.content
                            : sourceNode.data.label,
                      },
                    }
                  : node
              ) as AppNode[] // Cast to AppNode[] to satisfy TypeScript
          );
        }
      } else {
        // Default behavior for regular nodes
        setEdges((edges) => addEdge(connection, edges));
      }
    },
    [nodes, setEdges, setNodes]
  );
  
  const addNode = () => {
    const newNode = {
      id: `${nodes.length + 1}`,
      data: { label: `Node ${nodes.length + 1}` },
      position: {
        x: Math.random() * 250,
        y: Math.random() * 250,
      },
    };
    setNodes((nodes) => [...nodes, newNode]);
  };

  return (
    <>
      <button onClick={addNode}> Add Node</button>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <MiniMap />
        <Controls />
      </ReactFlow>
    </>
  );
}
