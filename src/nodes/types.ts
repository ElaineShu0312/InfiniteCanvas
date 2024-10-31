import type { Node, BuiltInNode } from "@xyflow/react";

export type PositionLoggerNode = Node<{ content: string }, "position-logger">;
export type TextNode = Node<{ content: string }, "text">;
export type ImageNode = Node<{ content: string }, "image">;
export type FunctionNode = Node<{ content: string }, "function">;
export type AppNode =
  | BuiltInNode
  | TextNode
  | PositionLoggerNode
  | ImageNode
  | FunctionNode;
