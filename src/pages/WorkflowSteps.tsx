import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import ReactFlow, {
  type Node,
  type Edge,
  Background,
  Controls,
  type NodeMouseHandler
} from "reactflow";
import "reactflow/dist/style.css";

import {
  getSteps,
  createStep,
  updateStep,
  deleteStep
} from "../api/step.api";
import type { Step } from "../types/step.types";

const WorkflowSteps = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: steps = [], isLoading, refetch } = useQuery<Step[]>({
    queryKey: ["steps", id],
    queryFn: () => getSteps(id!),
    enabled: !!id
  });

  const sortedSteps = useMemo(() => {
    return [...steps].sort((a, b) => a.order - b.order);
  }, [steps]);

  const nodes: Node[] = useMemo(() => {
    return sortedSteps.map((step, index) => ({
      id: step._id,
      data: { label: `${step.name} (${step.order})` },
      position: { x: index * 250, y: 120 }
    }));
  }, [sortedSteps]);

  const edges: Edge[] = useMemo(() => {
    return sortedSteps.slice(0, -1).map((step, index) => ({
      id: `e-${step._id}-${sortedSteps[index + 1]._id}`,
      source: step._id,
      target: sortedSteps[index + 1]._id
    }));
  }, [sortedSteps]);

  const [selectedStep, setSelectedStep] = useState<Step | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [name, setName] = useState("");
  const [type, setType] = useState("approval");
  const [order, setOrder] = useState(1);
  const [metadata, setMetadata] = useState("{}");

  const resetForm = () => {
    setName("");
    setType("approval");
    setOrder(1);
    setMetadata("{}");
  };

  const handleNodeClick: NodeMouseHandler = (_, node) => {
    const step = sortedSteps.find((s) => s._id === node.id);
    if (!step) return;

    setSelectedStep(step);
    setName(step.name);
    setType(step.step_type);
    setOrder(step.order);
    setMetadata(JSON.stringify(step.metadata || {}, null, 2));
  };

  const handleAddStep = async () => {
    if (!id) return;

    let parsedMetadata: Record<string, string> = {};

    try {
      parsedMetadata = JSON.parse(metadata);
    } catch {
      alert("Metadata must be valid JSON");
      return;
    }

    await createStep(id, {
      name,
      step_type: type,
      order,
      metadata: parsedMetadata
    });

    setShowAddModal(false);
    resetForm();
    refetch();
  };

  const handleUpdate = async () => {
    if (!selectedStep) return;

    let parsedMetadata: Record<string, string> = {};

    try {
      parsedMetadata = JSON.parse(metadata);
    } catch {
      alert("Invalid JSON");
      return;
    }

    await updateStep(selectedStep._id, {
      name,
      step_type: type,
      order,
      metadata: parsedMetadata
    });

    setSelectedStep(null);
    resetForm();
    refetch();
  };

  const handleDelete = async () => {
    if (!selectedStep) return;

    if (!confirm("Delete this step?")) return;

    await deleteStep(selectedStep._id);

    setSelectedStep(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading steps...
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50">
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Back
          </button>

          <h2 className="text-xl font-semibold text-gray-800">
            Workflow Steps
          </h2>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Step
        </button>
      </div>

      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          onNodeClick={handleNodeClick}
        >
          <Background />
          <Controls />
        </ReactFlow>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[420px] rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Add Step</h3>

            <div className="space-y-4">
              <input
                placeholder="Step Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="task">Task</option>
                <option value="approval">Approval</option>
                <option value="notification">Notification</option>
              </select>

              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />

              <textarea
                rows={4}
                value={metadata}
                onChange={(e) => setMetadata(e.target.value)}
                className="w-full border rounded px-3 py-2 font-mono"
              />
            </div>

            <div className="flex gap-3 mt-6 justify-between">
              <button
                onClick={() => setShowAddModal(false)}
                className="rounded text-body bg-neutral-primary border border-default leading-5 rounded-base text-sm px-4 py-2.5"
              >
                Cancel
              </button>

              <button
                onClick={handleAddStep}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedStep && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-[420px] rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Edit Step</h3>

            <div className="space-y-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />

              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border rounded px-3 py-2"
              >
                <option value="task">Task</option>
                <option value="approval">Approval</option>
                <option value="notification">Notification</option>
              </select>

              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(Number(e.target.value))}
                className="w-full border rounded px-3 py-2"
              />

              <textarea
                rows={4}
                value={metadata}
                onChange={(e) => setMetadata(e.target.value)}
                className="w-full border rounded px-3 py-2 font-mono"
              />
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={handleDelete}
                className="px-2 py-2 bg-red-600 text-white rounded"
              >
                Delete
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    navigate(`/steps/${selectedStep._id}/rules`)
                  }
                  className="px-2 py-2 bg-indigo-600 text-white rounded"
                >
                  Manage Rules
                </button>

                <button
                  onClick={() => setSelectedStep(null)}
                  className="px-2 py-2 bg-gray-300 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowSteps;