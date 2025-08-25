"use client";

import React, { useCallback, useState } from "react";
import ReactFlow, {
     MiniMap,
     Controls,
     Background,
     addEdge,
     useNodesState,
     useEdgesState,
     Connection,
     Edge,
} from "reactflow";
import "reactflow/dist/style.css";

export default function RoadmapPage() {
     const [nodes, setNodes, onNodesChange] = useNodesState([]); // empty
     const [edges, setEdges, onEdgesChange] = useEdgesState([]);
     const [nodeId, setNodeId] = useState(1);

     const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

     const addNewNode = () => {
          const newNode = {
               id: `${nodeId}`,
               position: { x: 150 * nodeId, y: 100 }, // auto place
               data: { label: `Step ${nodeId}` },
          };

          setNodes((nds) => [...nds, newNode]);

          // if there was a previous node, auto connect it
          if (nodeId > 1) {
               setEdges((eds) => [
                    ...eds,
                    { id: `e${nodeId - 1}-${nodeId}`, source: `${nodeId - 1}`, target: `${nodeId}` },
               ]);
          }

          setNodeId((id) => id + 1);
     };

     return (
          <div style={{ display: "flex", width: "100%", height: "100vh" }}>
               {/* Sidebar (10% width) */}
               <div
                    style={{
                         width: "10%",
                         background: "#f9fafb",
                         padding: "12px",
                         borderRight: "1px solid #ddd",
                         display: "flex",
                         flexDirection: "column",
                         gap: "12px",
                    }}
               >
                    <h3 style={{ marginBottom: "8px", fontSize: "16px", fontWeight: "bold" }}>Controls</h3>
                    <button
                         onClick={addNewNode}
                         style={{
                              padding: "8px 12px",
                              background: "#2563eb",
                              color: "white",
                              border: "none",
                              borderRadius: "6px",
                              cursor: "pointer",
                         }}
                    >
                         ➕ Add Node
                    </button>
               </div>

               {/* React Flow Canvas (90% width) */}
               <div style={{ width: "90%", height: "100%" }}>
                    <ReactFlow
                         nodes={nodes}
                         edges={edges}
                         onNodesChange={onNodesChange}
                         onEdgesChange={onEdgesChange}
                         onConnect={onConnect}
                         fitView
                         zoomOnScroll={false}
                         preventScrolling={false}
                    >
                         <MiniMap />
                         <Controls />
                         <Background gap={16} color="#aaa" />
                    </ReactFlow>
               </div>
          </div>
     );
}
