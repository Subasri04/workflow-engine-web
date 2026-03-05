import { useQuery } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { getExecutions } from "../api/execution.api"
import type { Execution } from "../types/execution.types"

function Executions() {

    const navigate = useNavigate()

    const { data: executions, isLoading } = useQuery<Execution[]>({
        queryKey: ["executions"],
        queryFn: getExecutions
    })

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen text-lg">
                Loading executions...
            </div>
        )
    }

    return (

        <div className="px-8 py-10">

            {/* Header */}

            <div className="flex justify-between items-center mb-8">

                <h1 className="text-3xl font-bold text-gray-800">
                    Workflow Executions
                </h1>

                <button
                    onClick={() => navigate("/")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
                >
                    Back to Workflows
                </button>

            </div>


            {/* Table */}

            <div className="shadow-lg rounded-xl overflow-hidden border">

                <table className="w-full border-none">

                    <thead className="bg-gray-50 border-b">

                        <tr className="text-left text-sm font-semibold text-gray-600">

                            <th className="px-6 py-4 w-[260px]">
                                Execution ID
                            </th>

                            <th className="px-6 py-4 w-[200px]">
                                Workflow
                            </th>

                            <th className="px-6 py-4">
                                Version
                            </th>

                            <th className="px-6 py-4">
                                Status
                            </th>

                            <th className="px-6 py-4">
                                Started
                            </th>

                            <th className="px-6 py-4">
                                Ended
                            </th>

                            <th className="px-6 py-4 text-center">
                                Actions
                            </th>

                        </tr>

                    </thead>

                    <tbody className="divide-y">

                        {executions?.map((exec) => (

                            <tr
                                key={exec._id}
                                className="hover:bg-gray-50 transition"
                            >

                                <td className=" font-medium px-6 py-4" onClick={() => navigate(`/executions/${exec._id}`)}>
                                    {exec._id}
                                </td>

                                <td className="px-6 py-4">
                                    {exec.workflow_id.name}
                                </td>

                                <td className="px-6 py-4">
                                    {exec.workflow_version}
                                </td>

                                <td className="px-6 py-4">

                                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                        {exec.status}
                                    </span>

                                </td>

                                <td className="px-6 py-4">
                                    {new Date(exec.started_at).toLocaleString()}
                                </td>

                                <td className="px-6 py-4">

                                    {exec.ended_at
                                        ? new Date(exec.ended_at).toLocaleString()
                                        : "-"}

                                </td>

                                <td className="px-6 py-4 text-center">

                                    <button
                                        onClick={() =>
                                            navigate(`/executions/${exec._id}`)
                                        }
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        View Logs
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    )
}

export default Executions;
