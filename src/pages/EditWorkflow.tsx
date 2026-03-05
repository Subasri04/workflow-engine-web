import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getWorkflowById, updateWorkflow } from "../api/workflow.api";

export default function EditWorkflow() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(true);
  const [schema, setSchema] = useState<string>("{}");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const loadWorkflow = useCallback(async () => {
    try {
      const wf = await getWorkflowById(id as string);

      setName(wf.name);
      setIsActive(wf.is_active);
      setSchema(JSON.stringify(wf.input_schema, null, 2));
    } catch {
      setError("Failed to load workflow");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadWorkflow();
  }, [loadWorkflow]);

  const handleSave = async () => {
    try {

      await updateWorkflow(id as string, {
        name,
        is_active: isActive,
        input_schema: JSON.parse(schema)
      });

      navigate("/workflows");

    } catch {
      setError("Invalid JSON schema");
    }
  };

  if (loading) {
    return <div className="p-6">Loading workflow...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 border rounded">

      <h2 className="text-xl font-semibold mb-6">
        Edit Workflow
      </h2>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      <div className="space-y-4">

        <div>
          <label className="block mb-1">
            Workflow Name
          </label>

          <input
            className="border w-full p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">
            Status
          </label>

          <select
            className="border w-full p-2 rounded"
            value={isActive ? "active" : "inactive"}
            onChange={(e) =>
              setIsActive(e.target.value === "active")
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">
            Input Schema
          </label>

          <textarea
            className="border w-full p-2 rounded h-40"
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
          />
        </div>

        <div className="flex gap-3">

          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>

          <button
            onClick={() => navigate("/workflows")}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

        </div>

      </div>
    </div>
  );
}
