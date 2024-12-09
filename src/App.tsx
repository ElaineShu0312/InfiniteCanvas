import { useCallback, useEffect, useState, type MouseEvent } from "react";
import axios from "axios"; // helps us make POST requests, for the Stable Diffusion API

import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  Node,
  useNodesState,
  useEdgesState,
  type OnConnect,
  useReactFlow, //import for intersection detection
  ReactFlowProvider, // Import ReactFlowProvider
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { AppNode } from "./nodes/types";
import { initialNodes, nodeTypes } from "./nodes"; // import initial nodes and custom nodes
import { initialEdges, edgeTypes } from "./edges"; // initial edges and custom edges

const Flow = () => {
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
      type: "default", // default text type
      position: {
        x: Math.random() * 250,
        y: Math.random() * 250,
      },
      data: { label: `Text Node ${nodes.length + 1}`, content: "it display" }, // Text-specific data
    };

    setNodes((prevNodes) => [...prevNodes, newDefaultNode]);
  };

  const addImageNode = (content?: string) => {
    const newNode: AppNode = {
      id: `image-${nodes.length + 1}`,
      type: "image",
      position: {
        x: Math.random() * 250,
        y: Math.random() * 250,
      },
      data: {
        content:
          content ??
          "https://upload.wikimedia.org/wikipedia/commons/8/87/Vincent_van_Gogh_-_Head_of_a_skeleton_with_a_burning_cigarette_-_Google_Art_Project.jpg",
      },
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const generateImageNode = async (prompt: string = "bunny on the moon") => {
    //bunny on the moon by default
    console.log("generating image...");
    //TODO: create a node that says " loading... " and take note of its id. replace that node with the new image once its done generating
    try {
      const apiKey = import.meta.env.VITE_STABLE_DIFFUSION_API_KEY; // For Vite

      if (!apiKey) {
        throw new Error("API key is missing!");
      }
      console.log("found api key...");

      // Prepare the FormData payload to send to the SD servers...
      const formData = new FormData();
      formData.append("prompt", prompt); // Use provided prompt or default
      formData.append("output_format", "webp");

      const response = await axios.post(
        "https://api.stability.ai/v2beta/stable-image/generate/core",
        formData,
        {
          responseType: "arraybuffer",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            Accept: "image/*",
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        console.log("received image!!");
        const base64Image: string = `data:image/webp;base64,${btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        )}`;

        console.log("converted image to base64");
        console.log(base64Image);

        // Add an Image Node with the generated image data
        addImageNode(base64Image);
      } else {
        console.error(`API Error: ${response.status}`);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Failed to generate image:", error.message);
      } else {
        console.error("Unknown error occurred:", error);
      }
    }
  };

  return (
    <>
      <button onClick={addDefaultNode}> Add Simple Node</button>
      <button onClick={() => addImageNode()}>Add Default Image Node</button>
      <button
        onClick={() => generateImageNode("kawaii bunny with a witch hat")}
      >
        {" "}
        Generate an Image
      </button>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onNodeDrag={onNodeDrag}
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
};

export default function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}
