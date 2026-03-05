import axios from "./api";
import type { Workflow } from "../types/workflow.types";

export interface WorkflowResponse {
  data: Workflow[];
  total: number;
  page: number;
  totalPages: number;
}

export const getWorkflows = async (
  page: number,
  limit: number,
  search: string,
  status: string
): Promise<WorkflowResponse> => {

  const params: Record<string, string> = {};

  if (search) params.search = search;
  if (status && status !== "ALL") {
    params.status = status.toLowerCase();
  }

  const res = await axios.get("/workflows", { params });
  console.log("API Response:", res);
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
