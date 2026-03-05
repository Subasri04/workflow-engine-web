import api from "./api";
import type { Execution } from "../types/execution.types";

export interface StartExecutionPayload {
    workflow_id: string;
    data: Record<string, string | number | boolean>;
}

export const getExecutions = async (): Promise<Execution[]> => {
  const res = await api.get(`/executions`)
  return res.data
}

export const getExecutionById = async (id: string): Promise<Execution> => {
  const res = await api.get(`/executions/${id}`)
  return res.data
}

export const retryExecution = async (id: string): Promise<void> => {
  await api.post(`/executions/${id}/retry`)
}

export const cancelExecution = async (id: string): Promise<void> => {
  await api.post(`/executions/${id}/cancel`)
}

export const startExecution = async (
    payload: StartExecutionPayload
): Promise<Execution> => {
    const res = await api.post<Execution>("/executions/start", payload);
    return res.data;
};

export const getExecutionsByWorkflow = async (
    workflowId: string
): Promise<Execution[]> => {
    const res = await api.get<Execution[]>(`/executions/workflow/${workflowId}`);
    return res.data;
};
