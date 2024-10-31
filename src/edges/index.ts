import type { Edge, EdgeTypes } from "@xyflow/react";
import WireEdge from "./wireEdge";

export const initialEdges: Edge[] = [
  { id: "a->c", source: "a", target: "c", animated: true },
  { id: "b->d", source: "b", target: "d" },
  // { id: "c->d", source: "c", target: "d", animated: true },
  // add wire edge
  { id: "c->d", source: "e", target: "f", type: "wire" },
];

export const edgeTypes = {
  // Add your custom edge types here!
  wire: WireEdge,
} satisfies EdgeTypes;
