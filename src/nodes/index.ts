import type { NodeTypes } from "@xyflow/react";
import { PositionLoggerNode } from "./PositionLoggerNode";
import { TextNode } from "./TextNode";
import { AppNode } from "./types";
import { ImageNode } from "./ImageNode";
import FunctionNode from "./FunctionNode";
//import IntersectionNode from "./IntersectionNode";
import T2IGeneratorNode from "./T2IGeneratorNode";

export const initialNodes: AppNode[] = [
  { id: "a", type: "input", position: { x: 0, y: 0 }, data: { label: "wire" } },
  {
    id: "b",
    type: "position-logger",
    position: { x: -100, y: 100 },
    data: { content: "drag me!" },
  },
  { id: "c", position: { x: 100, y: 100 }, data: { content: "your ideas" } },
  {
    id: "d",
    type: "output",
    position: { x: 0, y: 200 },
    data: { label: "with React Flow" },
  },
  {
    id: "e",
    type: "image",
    position: { x: -150, y: 150 },
    data: {
      content:
        "https://upload.wikimedia.org/wikipedia/commons/8/87/Vincent_van_Gogh_-_Head_of_a_skeleton_with_a_burning_cigarette_-_Google_Art_Project.jpg",
    },
  },
  {
    id: "f",
    type: "function",
    position: { x: 400, y: 500 },
    data: {
      content: "",
    },
  },
  {
    id: "t2i-generator-1",
    type: "t2i-generator",
    position: { x: 10, y: 10 },
    data: {
      content: "",
      mode: "ready",
      yOffset: 0,
      xOffset: 0,
      updateNode: (content: string, mode: "dragging" | "ready" | "generating" | "check") => {
        console.log(`new node with content: ${content} and mode: ${mode}`);
        return true;
        }
      }

  },
];

export const nodeTypes: NodeTypes = {
  default: TextNode,
  "position-logger": PositionLoggerNode,
  image: ImageNode,
  function: FunctionNode,
  //intersection: IntersectionNode,
  "t2i-generator": T2IGeneratorNode,
};