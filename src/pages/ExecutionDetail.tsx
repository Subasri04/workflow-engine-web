import { useParams, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { getExecutionById } from "../api/execution.api"

function ExecutionDetails() {

  const { id } = useParams()
  const navigate = useNavigate()

  const { data: execution, isLoading } = useQuery({
    queryKey: ["execution", id],
    queryFn: () => getExecutionById(id!)
  })

  if (isLoading) {
    return (
      <div className="p-8 text-lg">
        Loading execution?...
      </div>
    )
  }

  return (

    <div className="max-w-6xl mx-auto p-8">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-semibold">
          Execution Details
        </h1>

        <button
          onClick={() => navigate("/executions")}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Back to Executions
        </button>

      </div>


      {/* Summary Card */}

      <div className="bg-white shadow rounded-lg p-6 mb-8">

        <div className="grid grid-cols-2 gap-6">

          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className="inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-700">
              {execution?.status}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-500">Workflow Version</p>
            <p className="text-lg font-medium">
              {execution?.workflow_version}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Started</p>
            <p className="text-lg font-medium">
              {execution?.started_at
                ? new Date(execution.started_at).toLocaleString()
                : "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Ended</p>
            <p className="text-lg font-medium">
              {execution?.ended_at
                ? new Date(execution?.ended_at).toLocaleString()
                : "-"}
            </p>
          </div>

        </div>

      </div>


      {/* Step Logs */}

      <div className="bg-white shadow rounded-lg overflow-hidden">

        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">
            Step Logs
          </h2>
        </div>

        <table className="min-w-full divide-y divide-gray-200">

          <thead className="bg-gray-50">

            <tr className="text-left text-sm font-medium text-gray-600 uppercase">

              <th className="px-6 py-3">Step</th>
              <th className="px-6 py-3">Rule Evaluations</th>
              <th className="px-6 py-3">Next Step</th>

            </tr>

          </thead>

          <tbody className="divide-y divide-gray-200">

            {execution?.logs.map((log, i: number) => (

              <tr key={i} className="hover:bg-gray-50">

                <td className="px-6 py-4 font-medium text-gray-800">
                  {log.step_name}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">

                  {log.rule_logs.length === 0 && (
                    <span className="text-gray-400">
                      No rules
                    </span>
                  )}

                  {log.rule_logs.map((r, j: number) => (

                    <div key={j} className="flex gap-2 items-center mb-1">

                      <span className="font-mono text-gray-700">
                        {r.rule}
                      </span>

                      <span className={`text-xs px-2 py-1 rounded-full ${r.result
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                        }`}>

                        {String(r.result)}

                      </span>

                    </div>

                  ))}

                </td>

                <td className="px-6 py-4 text-sm text-gray-700">

                  {log.selected_next_step || "END"}

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )
}

export default ExecutionDetails
