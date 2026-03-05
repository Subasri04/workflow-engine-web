import axios from "./api";
import type { Workflow } from "../types/workflow.types";

export const getWorkflows = async (): Promise<Workflow[]> => {
  const res = await axios.get("/workflows");
  return res.data;
};

export const getWorkflowById = async (id: string): Promise<Workflow> => {
  const res = await axios.get(`/workflows/${id}`);
  return res.data;
};

export const createWorkflow = async (data: {
  name: string;
  is_active: boolean;
  input_schema: Record<string, unknown>;
}): Promise<Workflow> => {
  const res = await axios.post("/workflows", data);
  return res.data;
};

export const updateWorkflow = async (
  id: string,
  data: {
    name: string;
    is_active: boolean;
    input_schema: Record<string, unknown>;
  }
): Promise<Workflow> => {
  const res = await axios.put(`/workflows/${id}`, data);
  return res.data;
};
