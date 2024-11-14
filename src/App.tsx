import { useCallback, useState, useEffect } from "react";
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
  const [clipboard, setClipboard] = useState<Array<AppNode> | null>(null);

  const handleKeydown = useCallback(
    (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        if (event.key === "c" || event.key === "C") {
          handleCopy(event);
        } else if (event.key === "x" || event.key === "X") {
          handleCut(event);
        } else if (event.key === "v" || event.key === "V") {
          handlePaste(event);
        }
      }
    },
    [nodes, clipboard]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown);
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);

  const handleCopy = (event: KeyboardEvent) => {
    const selectedNodes = nodes.filter((node) => node.selected); // Assuming `selected` is part of your node data
    setClipboard(selectedNodes);
    event.preventDefault();
  };

  const handleCut = (event: KeyboardEvent) => {
    const selectedNodes = nodes.filter((node) => node.selected);
    setClipboard(selectedNodes);
    setNodes((nodes) => nodes.filter((node) => !node.selected)); // Remove selected nodes
    event.preventDefault();
  };

  const handlePaste = (event: KeyboardEvent) => {
    if (clipboard) {
      const newNodes = clipboard.map((node) => ({
        ...node,
        id: `${nodes.length + 1}`, // New unique ID
        position: { x: node.position.x + 20, y: node.position.y + 20 }, // Slight offset
      }));

      setNodes((nodes) => [...nodes, ...newNodes]);
      event.preventDefault();
    }
  };

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
          // console.log("content: " + sourceNode.data.content);

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
