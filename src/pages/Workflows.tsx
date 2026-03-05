import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getWorkflows } from "../api/workflow.api";
import type { Workflow } from "../types/workflow.types";

export default function Workflows() {

  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    try {

      const data = await getWorkflows();
      setWorkflows(data);

    } catch {

      setError("Failed to load workflows");

    } finally {

      setLoading(false);

    }
  };

  if (loading) {
    return <div className="p-8">Loading workflows...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="p-8">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-2xl font-bold">
          Workflow Engine
        </h1>

        <button
          onClick={() => navigate("/workflows/create")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Workflow
        </button>

      </div>

      <div className="bg-white shadow rounded">

        <table className="w-full">

          <thead className="bg-gray-100">
            <tr className="text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Version</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>

            {workflows.map((workflow) => (
              <tr key={workflow._id} className="border-t">

                <td className="p-3">
                  {workflow.name}
                </td>

                <td className="p-3">
                  {workflow.version}
                </td>

                <td className="p-3">
                  {workflow.is_active ? "Active" : "Inactive"}
                </td>

                <td className="p-3">

                  <div className="flex gap-2">

                    <button
                      onClick={() =>
                        navigate(`/workflows/${workflow._id}/edit`)
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/workflows/${workflow._id}`)
                      }
                      className="bg-gray-600 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>

                    <button
                      onClick={() =>
                        navigate(`/executions/start/${workflow._id}`)
                      }
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Run
                    </button>

                    <button
                      onClick={() =>
                        navigate("/executions")
                      }
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      View Executions
                    </button>

                  </div>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}
