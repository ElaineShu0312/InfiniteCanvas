import { useCallback, useEffect, useState, type MouseEvent } from "react";
import axios from "axios";
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
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AppNode } from "./nodes/types";
import { initialNodes, nodeTypes } from "./nodes";
import { initialEdges, edgeTypes } from "./edges";
import useClipboard from "./hooks/useClipboard";

const Flow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { getIntersectingNodes, getNodesBounds } = useReactFlow();

  const { handleCopy, handleCut, handlePaste } = useClipboard(nodes, setNodes); // Use the custom hook

  // Keyboard Event Listener for Copy, Cut, Paste
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        if (event.key === "c") handleCopy();
        if (event.key === "x") handleCut();
        if (event.key === "v") handlePaste();
      }
    };
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [handleCopy, handleCut, handlePaste]);

  const onConnect: OnConnect = useCallback(
    async (connection) => {
      const sourceNode = nodes.find((node) => node.id === connection.source);
      const targetNode = nodes.find((node) => node.id === connection.target);

      if (targetNode && targetNode.type === "function") {
        const animatedConnection = { ...connection, type: "wire" };
        setEdges((edges) => addEdge(animatedConnection, edges));

        if (sourceNode && targetNode) {
          const content =
            "content" in sourceNode.data
              ? sourceNode.data.content
              : sourceNode.data.label;

          console.log(`functionNode content is currently: ${content}`);

          // Update the target node's content after the source node content is ready
          setNodes(
            (nodes) =>
              nodes.map((node) =>
                node.id === targetNode.id
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        content: content,
                      },
                    }
                  : node
              ) as AppNode[]
          );

          const prompt =
            "content" in sourceNode.data
              ? sourceNode.data.content
              : sourceNode.data.label;
          console.log(`Generating image with prompt: ${prompt}`);
          // await generateImageNode(prompt);
        }
      } else {
        setEdges((edges) => addEdge(connection, edges));
      }
    },
    [nodes, setEdges, setNodes]
  );

  
  const onNodeDrag = useCallback(
    // node is actively being dragged. see below for onNodeDragStop function
    // todo, make this shorter
      (_: MouseEvent, draggedNode: Node) => {

        setNodes((currentNodes) =>
          currentNodes.map((node) => {
            if (node.id === draggedNode.id) {
              return {
                ...node,
                position: draggedNode.position,
              };
            }
            return node;
          })
        );
    
        const intersections = getIntersectingNodes(draggedNode).map((n) => n.id);
        setNodes((currentNodes) =>
          currentNodes.map((node) => {
            if (node.type === "intersection" && intersections.includes(node.id)) {
              return {
                ...node,
                className: "highlight-green",
              };
            }
            return {
              ...node,
              className: "",
            };
          })
        );
      },
      [getIntersectingNodes, setNodes]
    );

  const onNodeDragStop = useCallback(
    (_: MouseEvent, draggedNode: Node) => {
      console.log("node drag stop")
      const intersections = getIntersectingNodes(draggedNode).map((n) => n.id);
      handleIntersections(draggedNode, intersections);
    },
    [getIntersectingNodes, setNodes]
  );


  // --- HELPER FUNCTIONS --- //
  
  const moveNode = (nodeId: string, newPosition: { x: number; y: number }) => {
    /* takes a node and a new position as input, moves the node there */
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === nodeId) {
          if (node.position.x !== newPosition.x || node.position.y !== newPosition.y) {
            return {
              ...node,
              position: newPosition,
            };
          }
        }
        return node;
      })
    );
  };



  const calcPositionAfterDrag = (
    previousPosition: { x: number; y: number },
    intersectionNode: Node
  ) => {
    const bounds = getNodesBounds([intersectionNode]);
    const offset = 10; // Adjust the offset to place the node closer

    let newPosition = { ...previousPosition };

    let randomOffset = Math.floor(Math.random() * (bounds.width) - bounds.width/2); // random offset between -bounds.width and bounds.width
    newPosition.x = bounds.x + randomOffset; // place to the right
    newPosition.y = bounds.y + bounds.height + offset; // place below
    return newPosition;
  };

  const handleIntersections = (
    draggedNode: Node,
    intersections: string[]
  ) => {
    setNodes((currentNodes) => {
      const updatedNodes = currentNodes.map((node) => {
        if (node.type === "intersection" && intersections.includes(node.id)) {
          const overlappingNode = currentNodes.find((n) => n.id === draggedNode.id);
          const overlappingContent =
            overlappingNode && "content" in overlappingNode.data
              ? overlappingNode.data.content
              : overlappingNode && "label" in overlappingNode.data
              ? overlappingNode.data.label
              : "No content";
          node.data.printContent?.(overlappingContent); // Pass the overlapping content
          
          
           // Print old and new positions for the overlapping node
          if (overlappingNode) {
            const overlappingNodePrevPosition = { x: overlappingNode.position.x, y: overlappingNode.position.y };
            //lt's send the previous position and the intersection node to the calcPositionAfterDrag function
            const newPosition = calcPositionAfterDrag(overlappingNodePrevPosition, node);
            // move it
            moveNode(overlappingNode.id, newPosition);
            console.log(`Overlapping Node ID: ${overlappingNode.id}`);
            //console.log(`Old Position: ${JSON.stringify(overlappingNodePrevPosition)}`);
            //console.log(`New Position: ${JSON.stringify(newPosition)}`);
          }
          
          return {
            ...node,
            className: "",
          };
        }
        return node;
      });
  
      return updatedNodes;
    });
  };

  const addDefaultNode = () => {
    const newDefaultNode: AppNode = {
      id: `${nodes.length + 1}`,
      type: "default",
      position: {
        x: Math.random() * 250,
        y: Math.random() * 250,
      },
      data: {
        label: `Text Node ${nodes.length + 1}`,
        content: "your text here",
      },
    };

    setNodes((prevNodes) => [...prevNodes, newDefaultNode]);
  };

  const addImageNode = (content?: string) => {
    console.log(content);
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
          "https://noggin-run-outputs.rgdata.net/b88eb8b8-b2b9-47b2-9796-47fcd15b7289.webp",
      },
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
  };

  const generateImageNode = useCallback(
    async (prompt: string = "bunny on the moon") => {
      console.log(`Generating image with prompt: ${prompt}`);
      const loadingNodeId = `loading-${Date.now()}`;
      const loadingNode: AppNode = {
        id: loadingNodeId,
        type: "default",
        position: { x: 250, y: 250 },
        data: { label: "", content: "Loading..." },
      };
      setNodes((nodes) => [...nodes, loadingNode]);

      try {
        const formData = new FormData();
        formData.append("prompt", prompt); // make the prompt into form data

        // Make a POST request to the backend server (run the backend server with a separate terminal tab using node server.js)
        const response = await axios.post("http://localhost:3000/api/generate-image", {
            prompt, // Send the prompt as part of the request body
          });
      
          if (response.status === 200) {
            console.log(`Image url ${response.data.imageUrl} received from backend!`);

            const newImageNode: AppNode = {
              id: `image-${Date.now()}`,
              type: "image",
              position: { x: 250, y: 250 },
              data: { content: response.data.imageUrl },
            };

            setNodes((nodes) =>
              nodes.map((node) =>
                node.id === loadingNodeId ? newImageNode : node
              )
            );

          } else {
            console.error(`Generation Error: ${response.status}`);
          }
        } 
        catch (error) {
          if (error instanceof Error) {
            console.error("Failed to generate image:", error.message);
          } else {
            console.error("Unknown error occurred:", error);
          }
        }
      
    },
    [setNodes]
  );

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
        onNodeDragStop={onNodeDragStop}
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

export default Flow;
