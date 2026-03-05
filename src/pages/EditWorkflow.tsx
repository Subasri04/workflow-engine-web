import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getWorkflowById,
  updateWorkflow
} from "../api/workflow.api";

interface SchemaField {
  type: "string" | "number" | "boolean";
  required: boolean;
  allowed_values?: string[];
}

export default function WorkflowEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [version, setVersion] = useState<number>(1);
  const [schemaFields, setSchemaFields] = useState<
    Record<string, SchemaField>
  >({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadWorkflow = useCallback(async () => {
    try {
      const wf = await getWorkflowById(id as string);
      console.log("Loaded workflow:", wf);

      setName(wf.name);
      setDescription(wf.description || "");
      setIsActive(wf.is_active);
      setVersion(wf.version);
      setSchemaFields(wf.input_schema || {});
    } catch {
      setError("Failed to load workflow");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadWorkflow();
  }, [loadWorkflow]);

  const handleSchemaChange = (
    key: string,
    field: keyof SchemaField,
    value: any
  ) => {
    setSchemaFields((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  const handleAddField = () => {
    const fieldName = prompt("Enter field name");
    if (!fieldName) return;

    setSchemaFields((prev) => ({
      ...prev,
      [fieldName]: {
        type: "string",
        required: false
      }
    }));
  };

  const handleDeleteField = (key: string) => {
    const updated = { ...schemaFields };
    delete updated[key];
    setSchemaFields(updated);
  };

  const handleSave = async () => {
    try {
      await updateWorkflow(id as string, {
        name,
        description,
        is_active: isActive,
        input_schema: schemaFields
      });

      navigate("/workflows");
    } catch {
      setError("Failed to update workflow");
    }
  };

  if (loading) {
    return <div className="p-6">Loading workflow...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-8 py-10 space-y-8">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          Workflow Editor
        </h1>
        <span className="text-gray-600">
          Version {version}
        </span>
      </div>

      {error && (
        <div className="text-red-600">{error}</div>
      )}

      <div className="bg-white shadow rounded-lg p-6 space-y-4">

        <div>
          <label className="block mb-1 font-medium">
            Workflow Name
          </label>
          <input
            className="w-full border rounded px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Description
          </label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">
            Status
          </label>
          <select
            className="w-full border rounded px-3 py-2"
            value={isActive ? "active" : "inactive"}
            onChange={(e) =>
              setIsActive(e.target.value === "active")
            }
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-4">

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Input Schema
          </h2>
          <button
            onClick={handleAddField}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add Field
          </button>
        </div>

        {Object.entries(schemaFields).map(([key, config]) => (
          <div
            key={key}
            className="border rounded p-4 space-y-3"
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">{key}</h3>
              <button
                onClick={() => handleDeleteField(key)}
                className="text-red-600 text-sm"
              >
                Delete
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">

              <select
                value={config.type}
                onChange={(e) =>
                  handleSchemaChange(
                    key,
                    "type",
                    e.target.value
                  )
                }
                className="border rounded px-3 py-2"
              >
                <option value="string">string</option>
                <option value="number">number</option>
                <option value="boolean">boolean</option>
              </select>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={config.required}
                  onChange={(e) =>
                    handleSchemaChange(
                      key,
                      "required",
                      e.target.checked
                    )
                  }
                />
                Required
              </label>

              {config.type === "string" && (
                <input
                  placeholder="Comma separated allowed values"
                  value={
                    config.allowed_values?.join(",") || ""
                  }
                  onChange={(e) =>
                    handleSchemaChange(
                      key,
                      "allowed_values",
                      e.target.value
                        .split(",")
                        .map((v) => v.trim())
                        .filter(Boolean)
                    )
                  }
                  className="border rounded px-3 py-2"
                />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Steps Section */}
      <div className="bg-white shadow rounded-lg p-6">

        <h2 className="text-xl font-semibold mb-4">
          Manage Steps
        </h2>

        <button
          onClick={() =>
            navigate(`/workflows/${id}/steps`)
          }
          className="bg-indigo-600 text-white px-5 py-2 rounded"
        >
          Manage Steps
        </button>
      </div>

      {/* Save Buttons */}
      <div className="flex gap-4">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-6 py-2 rounded"
        >
          Save Changes
        </button>

        <button
          onClick={() => navigate("/workflows")}
          className="bg-gray-500 text-white px-6 py-2 rounded"
        >
          Cancel
        </button>
      </div>

    </div>
  );
}
