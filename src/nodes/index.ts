import type { NodeTypes } from "@xyflow/react";

import { PositionLoggerNode } from "./PositionLoggerNode";
import { TextNode } from "./TextNode";
import { AppNode } from "./types";
import { ImageNode } from "./ImageNode";
import FunctionNode from "./FunctionNode";
import IntersectionNode from "./IntersectionNode";

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
  // {
  //   id: "f",
  //   type: "image",
  //   position: { x: -200, y: 400 },
  //   data: {
  //     content: "https://www.vincentvangogh.org/assets/img/self-portrait.jpg",
  //   },
  // },

  {
    id: "f",
    type: "function",
    position: { x: 400, y: 500 },
    data: {
      content: "",
    },
  },
  {
    id: "intersection-1",
    type: "intersection",
    position: { x: 150, y: 300 },
    data: {
      content: "Intersection Node (drag onto me!)",
      printContent: () => {},
    },
  },
  {
    id: "g",
    type: "input",
    position: { x: 100, y: 400 },
    data: { label: "simple vector logo for a AI Art generation website" },
  },
  {
    id: "h",
    type: "input",
    position: { x: 200, y: 400 },
    data: {
      label:
        "simple vector logo for AI art generation tool, similar to Figma logo, with white background",
    },
  },
];

export const nodeTypes = {
  default: TextNode,
  "position-logger": PositionLoggerNode,
  image: ImageNode,
  function: FunctionNode,
  intersection: IntersectionNode, 
  // 'text': TextNode,

  // Add any of your custom nodes here!
} satisfies NodeTypes;
