import type { Node, BuiltInNode } from "@xyflow/react";

// Define a generic node type for default nodes
export type DefaultNode = Node<{ label: string; content: string }, "default">;

// all our types of nodes...
export type PositionLoggerNode = Node<{ content: string }, "position-logger">;
export type TextNode = Node<{ content: string, onContentChange?: (content: string) => void; }, "text">;
export type ImageNode = Node<{ content: string }, "image">;
export type FunctionNode = Node<{ content: string }, "function">;
export type IntersectionNode = Node<
  { content: string; className?: string },
  "intersection"
>;

// Aggregate node types
export type AppNode =
  | BuiltInNode
  | DefaultNode
  | TextNode
  | PositionLoggerNode
  | ImageNode
  | FunctionNode
  | IntersectionNode;
