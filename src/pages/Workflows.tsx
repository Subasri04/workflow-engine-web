import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getWorkflows, WorkflowResponse } from "../api/workflow.api";
import type { Workflow } from "../types/workflow.types";

function Workflows() {
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);

  const pageSize = 5;

  const { data, isLoading } = useQuery<WorkflowResponse>({
    queryKey: ["workflows", currentPage, search, statusFilter],
    queryFn: () =>
      getWorkflows(currentPage, pageSize, search, statusFilter),
    placeholderData: (previousData) => previousData
  });

  if (isLoading || !data) {
    return (
      <div className="flex justify-center items-center h-screen text-lg">
        Loading workflows...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-8 py-10 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Workflow Engine
        </h1>

        <button
          onClick={() => navigate("/workflows/create")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow"
        >
          Create Workflow
        </button>
      </div>

      <div className="flex gap-4">

        <input
          placeholder="Search workflow..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg px-4 py-2 w-1/3"
        />

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="border rounded-lg px-4 py-2"
        >
          <option value="ALL">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>

      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-xl overflow-hidden border">

        <table className="w-full">

          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-sm font-semibold text-gray-600">
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Version</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">

            {data.data.map((workflow: Workflow) => (
              <tr key={workflow._id} className="hover:bg-gray-50 transition">

                <td className="px-6 py-4 font-semibold cursor-pointer text-gray-800">
                  {workflow._id}
                </td>

                <td className="px-6 py-4 text-gray-800">
                  {workflow.name}
                </td>

                <td className="px-6 py-4">
                  {workflow.version}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${workflow.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {workflow.status === "active" ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-4 text-center space-x-2">

                  <button
                    onClick={() =>
                      navigate(`/workflows/${workflow._id}/edit`)
                    }
                    className="px-3 py-1 bg-indigo-400 text-white rounded cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/workflows/${workflow._id}/steps`)
                    }
                    className="bg-gray-600 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/executions/start/${workflow._id}`)
                    }
                    className="px-3 py-1 bg-green-600 text-white rounded cursor-pointer"
                  >
                    Execute
                  </button>


                  <button
                    onClick={() =>
                      navigate("/executions")
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded cursor-pointer"
                  >
                    View Executions
                  </button>

                </td>

              </tr>
            ))}

          </tbody>

        </table>

      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 items-center">

        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-1 border rounded disabled:opacity-40"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {data.page} of {data.totalPages}
        </span>

        <button
          disabled={currentPage === data.totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-1 border rounded disabled:opacity-40"
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default Workflows;
