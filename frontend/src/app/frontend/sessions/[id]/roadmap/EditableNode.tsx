"use client";

import { useState } from "react";
import { Handle, Position } from "reactflow";

interface EditableNodeProps {
  id: string;
  data: {
    label: string;
    onChange: (id: string, label: string) => void;
  };
}

export default function EditableNode({ id, data }: EditableNodeProps) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(data.label);

  const handleBlur = () => {
    setEditing(false);
    data.onChange(id, label); // update parent state
  };

  return (
    <div className="bg-white border rounded-md px-3 py-2 shadow">
      {editing ? (
        <input
          autoFocus
          className="border-none outline-none bg-transparent text-center"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleBlur();
          }}
        />
      ) : (
        <span
          className="cursor-pointer"
          onDoubleClick={() => setEditing(true)} // 👈 double-click to edit
        >
          {label}
        </span>
      )}

      {/* optional handles if you want connections */}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
