import type { Node, BuiltInNode } from "@xyflow/react";

export type PositionLoggerNode = Node<{ label: string }, "position-logger">;
export type TextNode = Node<{ label: string }, "text">;
export type ImageNode = Node<{ imageUrl: string }, "image">;
export type AppNode = BuiltInNode | TextNode | PositionLoggerNode | ImageNode;
