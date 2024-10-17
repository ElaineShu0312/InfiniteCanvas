
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useState, useRef, useEffect } from "react";
import { type TextNode } from "./types";

export function TextNode({ data }: NodeProps<TextNode>) {
  const [label, setLabel] = useState(data.label || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLabel(e.target.value);
  };

  useEffect(() => {
    if (textareaRef.current) {
      const textArea = textareaRef.current;
      if (textArea.scrollHeight > textArea.clientHeight) {
        textArea.style.height = `${textArea.scrollHeight}px`;
      }
    }
  }, [label]);

  return (
    <div className="react-flow__node-default" style={{ width: "fit-content" }}>
      <textarea
        ref={textareaRef}
        value={label}
        onChange={handleChange}
        style={{
          width: "100%",
          height: "auto",
          resize: "none",
          border: "none",
          outline: "none",
          overflow: "hidden",
          color: "inherit",
          fontFamily: "inherit",
          fontSize: "inherit",
        }}
      />
      <Handle type="source" position={Position.Bottom} />
      <Handle type="target" position={Position.Top} />
    </div>
  );
}
