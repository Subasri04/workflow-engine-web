import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createWorkflow } from "../api/workflow.api";

export default function CreateWorkflow() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [schema, setSchema] = useState("{}");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      await createWorkflow({
        name,
        is_active: isActive,
        input_schema: JSON.parse(schema),
      });

      navigate("/workflows");
    } catch {
      setError("Invalid schema JSON");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 border rounded">

      <h2 className="text-xl font-semibold mb-6">
        Create Workflow
      </h2>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      <div className="space-y-4">

        <div>
          <label className="block mb-1">Workflow Name</label>

          <input
            className="border w-full p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1">Status</label>

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
          <label className="block mb-1">Input Schema</label>

          <textarea
            className="border w-full p-2 rounded h-40"
            value={schema}
            onChange={(e) => setSchema(e.target.value)}
          />
        </div>

        <div className="flex gap-3 justify-between">

          <button
            onClick={() => navigate("/workflows")}
            className="rounded text-body bg-neutral-primary border border-default leading-5 rounded-base text-sm px-4 py-2.5"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save
          </button>


        </div>

      </div>
    </div>
  );
}
