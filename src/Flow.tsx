import { useCallback, useEffect, type MouseEvent } from "react";
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
  
   // --- FUNCTIONS TRIGGERED BY CANVAS INTERACTIONS --- //
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
          if ((node.type === "t2i-generator") && intersections.includes(node.id)) {
            node.data.updateNode?.("", "dragging"); // Trigger dragging mode
            //console.log(node.data)
            return {
              ...node,
              className: "highlight-green",
            };
          }
          else if (node.type === "t2i-generator") {
            node.data.updateNode?.("", "ready");
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
      //console.log("user stopped dragging a node ", draggedNode)
      const intersections = getIntersectingNodes(draggedNode).map((n) => n.id);
      handleIntersections(draggedNode, intersections);
    },
    [getIntersectingNodes, setNodes]
  );


  // --- HELPER FUNCTIONS --- //

  // const isIntersector = (nodeType: string | undefined) => {
  //   if (!nodeType) return false;
  //   //returns true if the type of node is an "intersector"
  //   return nodeType === "intersection" || nodeType === "t2i-generator";
  // }

  const calcPositionAfterDrag = (
    previousPosition: { x: number; y: number },
    intersectionNode: Node,
    direction: "above" | "below" = "below"
  ) => {
    const bounds = getNodesBounds([intersectionNode]);
    let newPosition = { ...previousPosition };
  
    const xOffset = typeof intersectionNode.data.xOffset === 'number' ? intersectionNode.data.xOffset : 10;
    const yOffset = typeof intersectionNode.data.yOffset === 'number' ? intersectionNode.data.yOffset : 10;
  
    newPosition.x = bounds.x + xOffset; // place to the right
    newPosition.y = bounds.y + bounds.height + yOffset; // place below

    if (direction === "below") {
      newPosition.x = bounds.x + xOffset; // place to the right
      newPosition.y = bounds.y + bounds.height + yOffset; // place below
    } else if (direction === "above") {
      newPosition.x = bounds.x - bounds.width/2 - xOffset; // place to the left
      newPosition.y = bounds.y - bounds.height - yOffset; // place above
    }
    return newPosition;
  };
  
  const moveNode = (nodeId: string, newPosition: { x: number; y: number }) => {
    /* takes a node and a new position as input, moves the node there */
    setNodes((currentNodes) =>
      currentNodes.map((node) => {
        if (node.id === nodeId) {
          if (node.position.x !== newPosition.x || node.position.y !== newPosition.y) {
            return {
              ...node,
              position: newPosition,
              className: `${node.className} node-transition`, // Add transition class
            };
          }
        }
        return node;
      })
    );
  
    // Remove the transition class after the animation completes
    setTimeout(() => {
      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              className: node.className ? node.className.replace(" node-transition", "") : "",
            };
          }
          return node;
        })
      );
    }, 1000); // Match the duration of the CSS transition
  };
  


  const handleIntersections = (draggedNode: Node, intersections: string[]) => {
    setNodes((currentNodes) => {
      const updatedNodes = currentNodes.map((node) => {
        if (node.type === "t2i-generator" && intersections.includes(node.id)) {
          const overlappingNode = currentNodes.find((n) => n.id === draggedNode.id);
          const inputNodeContent = 
          //grab the content of the node that was dragged on top, and use it as input for our generator
            overlappingNode && "content" in overlappingNode.data
              ? overlappingNode.data.content
              : overlappingNode && "label" in overlappingNode.data
              ? overlappingNode.data.label
              : "No content";
  
          // Check if the node is ready for generation
          const isReady = node.data.updateNode?.("", "check") === true;

          if (
            isReady &&
            typeof inputNodeContent === "string" &&
            inputNodeContent.trim() !== ""
          ) 
          {

            // Rerender the node in "generating" mode with the prompt
            node.data.updateNode?.(inputNodeContent, "generating");
  
            // Generate a new image node, use helper function to decide where it should appear
            generateImageNode(inputNodeContent, calcPositionAfterDrag(node.position, node, "below"))
              .then(() => {
                console.log("Image generation complete!");
                
                node.data.updateNode?.("", "ready");  
              })
              .catch((error) => {
                console.error("Image generation failed:", error);
                node.data.updateNode?.("", "ready"); // Reset even on failure
              });

            // For the original overlapping node we just used as input,
            // let's move it out of the way so it's not overlapping anymore.
            if (overlappingNode) {
              const overlappingNodePrevPosition = { x: overlappingNode.position.x, y: overlappingNode.position.y };
              const newPosition = calcPositionAfterDrag(overlappingNodePrevPosition, node, "above");
              moveNode(overlappingNode.id, newPosition); //move it
            }
  
            return {
              ...node, className:"", // Reset the highlight
            };
          }
        }
        else if (node.type === "t2i-generator") { // the node is a generator, but nothing is intersecting with it
          node.data.updateNode?.("", "ready"); 
        }

        return {
          ...node,
          className: "",
        };
      });
  
      return updatedNodes;
    });
  };
  
  //*** -- Node Adders -- ***/

  

  const addTextNode = () => {
    const newTextNode: AppNode = {
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

    setNodes((prevNodes) => [...prevNodes, newTextNode]);
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

  const addT2IGenerator = () => {
    const newT2IGeneratorNode: AppNode = {
      id: `t2i-generator-${nodes.length + 1}`,
      type: "t2i-generator",
      position: {
      x: Math.random() * 250,
      y: Math.random() * 250,
      },
      data: {
      content: "",
      mode: "ready",
      yOffset: 0,
      xOffset: 0,
      updateNode: (content: string, mode: "dragging" | "ready" | "generating" | "check") => {
        console.log(`new node with content: ${content} and mode: ${mode}`);
        return true;
      }
      },
    };

    setNodes((prevNodes) => [...prevNodes, newT2IGeneratorNode]);
  };

  const generateImageNode = useCallback(
    // Generates an image node with a prompt and optional position
    async (prompt: string = "bunny on the moon", position: { x: number; y: number } = { x: 250, y: 250 }, testing: boolean = false) => {
      console.log(`Generating image with prompt: ${prompt}`);
      const loadingNodeId = `loading-${Date.now()}`;
      const loadingNode: AppNode = {
        id: loadingNodeId,
        type: "default",
        position,
        data: { label: "", content: "Loading..." },
      };
      setNodes((nodes) => [...nodes, loadingNode]);

      // if the testing paramter is true, let's just use a default image to avoid generation costs
      if (testing) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const newImageNode: AppNode = {
          id: `image-${Date.now()}`,
          type: "image",
          position,
          data: { content: "https://collectionapi.metmuseum.org/api/collection/v1/iiif/459123/913555/main-image" },
        };

        setNodes((nodes) =>
          nodes.map((node) =>
            node.id === loadingNodeId ? newImageNode : node
          )
        );
        return;
      }

      // let's generate the image for real for real

      try {
        const formData = new FormData();
        formData.append("prompt", prompt); // make the prompt into form data

        // Make a POST request to the backend server 
        // ---- USE THIS ONE if you are running the backend server with a separate local terminal tab using node server.js!) ----
        //const response = await axios.post("http://localhost:3000/api/generate-image", {
        
        // ---- USE THIS ONE for the online backend server!) ----
        const response = await axios.post("http://104.200.25.53/api/generate-image", {
            prompt, // Send the prompt as part of the request body
          });
      
          if (response.status === 200) {
            console.log(`Image url ${response.data.imageUrl} received from backend!`);

            const newImageNode: AppNode = {
              id: `image-${Date.now()}`,
              type: "image",
              position,
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
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
        <button onClick={addTextNode}> Text </button>
        <button onClick={() => addImageNode()}>Image</button>
        <button onClick={() => addT2IGenerator()}>New Text to Image Generator</button>
      </div>
      {/* image generation button */
      /*
      <button
        onClick={() => generateImageNode("kawaii bunny with a witch hat")}
      >
        {" "}
        Generate an Image
      </button> */
      }


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
