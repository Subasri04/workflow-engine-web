import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getWorkflowById } from "../api/workflow.api";
import { startExecution } from "../api/execution.api";
import type { Workflow } from "../types/workflow.types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type InputValue = string | number | boolean;

function ExecutionStart() {
    const { workflowId } = useParams<{ workflowId: string }>();
    const navigate = useNavigate();

    const { data: workflow, isLoading } = useQuery<Workflow>({
        queryKey: ["workflow", workflowId],
        queryFn: () => getWorkflowById(workflowId as string),
        enabled: !!workflowId
    });

    const [formData, setFormData] = useState<Record<string, InputValue>>({});

    const mutation = useMutation({
        mutationFn: startExecution
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Loading workflow...
            </div>
        );
    }

    if (!workflow) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                Workflow not found
            </div>
        );
    }

    const handleChange = (key: string, value: InputValue) => {
        setFormData((prev) => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSubmit = () => {
        mutation.mutate({
            workflow_id: workflow._id,
            data: formData
        });
        navigate('/')
    };

    const schema = workflow.input_schema ?? {};

    return (
        <div className="min-h-screen bg-gray-50 px-10 py-10">

            <h1 className="text-2xl font-semibold mb-8">
                Start Workflow Execution
            </h1>

            <div className="bg-white p-6 rounded-xl shadow-sm max-w-xl">

                {Object.keys(schema).length === 0 && (
                    <div className="text-gray-500">
                        No input schema defined
                    </div>
                )}

                {Object.entries(schema).map(([field, config]: any) => {

                    const allowed =
                        config && typeof config === "object" && "allowed_values" in config
                            ? config.allowed_values
                            : undefined;

                    return (
                        <div key={field} className="mb-4">

                            <label className="block text-sm mb-2">
                                {field}
                            </label>

                            {allowed ? (
                                <select
                                    value={formData[field] ?? ""}
                                    onChange={(e) =>
                                        handleChange(field, e.target.value)
                                    }
                                    className="w-full border rounded-md px-3 py-2"
                                >
                                    <option value="">Select</option>

                                    {allowed.map((val: string) => (
                                        <option key={val} value={val}>
                                            {val}
                                        </option>
                                    ))}
                                </select>
                            ) : config.type === "number" ? (
                                <input
                                    type="number"
                                    value={formData[field] ?? ""}
                                    onChange={(e) =>
                                        handleChange(
                                            field,
                                            Number(e.target.value)
                                        )
                                    }
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            ) : (
                                <input
                                    type="text"
                                    value={formData[field] ?? ""}
                                    onChange={(e) =>
                                        handleChange(field, e.target.value)
                                    }
                                    className="w-full border rounded-md px-3 py-2"
                                />
                            )}

                        </div>
                    );
                })}

                <button
                    onClick={handleSubmit}
                    className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
                >
                    Start Execution
                </button>

            </div>

        </div>
    );
}

export default ExecutionStart;
