"use client";
import React, { useEffect, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  MarkerType,
} from "@xyflow/react";
import TextUpdaterNode from "@/components/Node";
import "@xyflow/react/dist/style.css";
import CustomEdge from "@/components/CustomEdge";

import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const initialNodes = [
  {
    id: "1",
    type: "textUpdater",
    position: { x: 0, y: 0 },
    data: { label: "ACCOUNT", source: "Quickbooks" },
  },
  {
    id: "2",
    type: "textUpdater",
    position: { x: 400, y: 0 },
    data: { label: "Account Name", source: "Netsuite" },
  },
  {
    id: "3",
    type: "textUpdater",
    position: { x: 0, y: 150 },
    data: { label: "TYPE", source: "Quickbooks" },
  },
  {
    id: "4",
    type: "textUpdater",
    position: { x: 400, y: 150 },
    data: { label: "Account Type", source: "Netsuite" },
  },
  {
    id: "5",
    type: "textUpdater",
    position: { x: 0, y: 300 },
    data: { label: "CURRENCY", source: "Quickbooks" },
  },
  {
    id: "6",
    type: "textUpdater",
    position: { x: 400, y: 300 },
    data: { label: "Currency", source: "Netsuite" },
  },
  {
    id: "7",
    type: "textUpdater",
    position: { x: 0, y: 450 },
    data: { label: "Description", source: "Quickbooks", disabled: false },
  },
  {
    id: "8",
    type: "textUpdater",
    position: { x: 0, y: 600 },
    data: { label: "Balance", source: "Quickbooks", disabled: false },
  },
];

const edgeTypes = {
  "custom-edge": CustomEdge,
};
const initialEdges = [
  {
    type: "custom-edge",
    id: "e1-2",
    source: "1",
    target: "2",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000",
    },
    style: {
      strokeWidth: 2,
      stroke: "#000",
    },
    animated: true,
  },
  {
    type: "custom-edge",
    id: "e3-4",
    source: "3",
    target: "4",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000",
    },
    style: {
      strokeWidth: 2,
      stroke: "#000",
    },
    animated: true,
  },
  {
    type: "custom-edge",
    id: "e5-6",
    source: "5",
    target: "6",
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
      color: "#000",
    },
    style: {
      strokeWidth: 2,
      stroke: "#000",
    },
    animated: true,
  },
];

export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const nodeTypes = useMemo(() => ({ textUpdater: TextUpdaterNode }), []);
  const onConnect = useCallback(
    (connection) => {
      const edge = {
        ...connection,
        type: "custom-edge",

        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#000",
        },
        style: {
          strokeWidth: 2,
          stroke: "#000",
        },
      };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges]
  );

  const router = useRouter();

  useEffect(() => {
    sendMessageToChromeExtension("setLoadingState", {
      state: false,
      status: "",
    });
  }, []);

  const sendMessageToChromeExtension = (action: string, payload: any) => {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        "pajhhcpmldjhoeibhffcilndgabaipip",
        { action, payload },
        (response: any) => {
          if (chrome.runtime.lastError) {
            console.error(
              "Error sending message:",
              chrome.runtime.lastError.message
            );
          } else {
            console.log("Message sent successfully. Response:", response);

            if (response.action === "getTabUrls") {
              if (response.tabUrls && Array.isArray(response.tabUrls)) {
                resolve(response.tabUrls);
              }
            }
          }
        }
      );
    });
  };

  const [checkboxes, setCheckboxes] = useState({
    checkbox1: false,
    checkbox2: false,
    checkbox3: false,
  });

  const isApproveEnabled = Object.values(checkboxes).every(Boolean);

  const handleCheckboxChange = (id: string) => {
    setCheckboxes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleApprove = () => {
    sendMessageToChromeExtension("setLoadingState", {
      state: true,
      status: "Mapping data",
    });
    setTimeout(() => {
      router.push("/validate");
    }, 3000);
  };

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-4xl">
          Data migration
        </h1>
        <button
          className="px-4 py-2 bg-black text-white rounded hover:bg-gray-700 disabled:opacity-20 disabled:cursor-not-allowed"
          onClick={handleApprove}
          disabled={!isApproveEnabled}
        >
          Approve
        </button>
      </div>
      <div className="flex space-x-8 mt-6">
        <div style={{ width: "50vw", height: "100vh" }}>
          <h2 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-2xl">Mapping</h2>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            zoomOnScroll={false}
            zoomOnPinch={false}
            edgeTypes={edgeTypes}
          >
            <Background var gap={12} size={1} />
          </ReactFlow>
        </div>
        <div className="space-y-4">
          <h2 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl lg:text-2xl">Approvals</h2>
          <div className="flex items-center space-x-4">
            <Checkbox 
              id="checkbox1" 
              checked={checkboxes.checkbox1}
              onCheckedChange={() => handleCheckboxChange("checkbox1")}
            />
            <Avatar>
              <AvatarImage src="https://ui.shadcn.com/avatars/01.png" alt="User 1" />
              <AvatarFallback>U1</AvatarFallback>
            </Avatar>
            <label htmlFor="checkbox1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Zeeshan
            </label>
          </div>
          <div className="flex items-center space-x-4">
            <Checkbox 
              id="checkbox2" 
              checked={checkboxes.checkbox2}
              onCheckedChange={() => handleCheckboxChange("checkbox2")}
            />
            <Avatar>
              <AvatarImage src="https://ui.shadcn.com/avatars/02.png" alt="User 2" />
              <AvatarFallback>U2</AvatarFallback>
            </Avatar>
            <label htmlFor="checkbox2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Haroun
            </label>
          </div>
          <div className="flex items-center space-x-4">
            <Checkbox 
              id="checkbox3" 
              checked={checkboxes.checkbox3}
              onCheckedChange={() => handleCheckboxChange("checkbox3")}
            />
            <Avatar>
              <AvatarImage src="https://ui.shadcn.com/avatars/03.png" alt="User 3" />
              <AvatarFallback>U3</AvatarFallback>
            </Avatar>
            <label htmlFor="checkbox3" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Maryam
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
