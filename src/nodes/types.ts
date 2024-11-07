import type { Node, BuiltInNode } from "@xyflow/react";

// all our types of nodes...
export type PositionLoggerNode = Node<{ content: string }, "position-logger">;
export type TextNode = Node<{ content: string }, "text">;
export type ImageNode = Node<{ content: string }, "image">;
export type FunctionNode = Node<{ content: string }, "function">;
export type IntersectionNode = Node<{ label: string; className?: string }, "intersection">;

// Aggregate node types
export type AppNode =
  | BuiltInNode
  | TextNode
  | PositionLoggerNode
  | ImageNode
  | FunctionNode
  | IntersectionNode; 
