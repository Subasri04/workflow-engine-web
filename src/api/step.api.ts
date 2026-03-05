import axios from "./api";
import type { Step } from "../types/step.types";

export const getSteps = async (workflowId: string): Promise<Step[]> => {
  const res = await axios.get(`/steps/${workflowId}`);
  return res.data;
};

export const createStep = async (
  workflowId: string,
  data: {
    name: string;
    step_type: string;
    order: number;
    metadata: Record<string, string>;
  }
): Promise<Step> => {
  const res = await axios.post(`/steps/${workflowId}`, {
    workflow_id: workflowId,
    ...data,
  });

  return res.data;
};

export const updateStep = async (
  stepId: string,
  data: {
    name: string;
    step_type: string;
    order: number;
    metadata: Record<string, string>;
  }
): Promise<Step> => {
  const res = await axios.put(`/steps/${stepId}`, data);
  return res.data;
};

export const deleteStep = async (stepId: string): Promise<void> => {
  await axios.delete(`/steps/${stepId}`);
};

export const getStepById = async (stepId: string): Promise<Step> => {
  const res = await axios.get(`/steps/step/${stepId}`);
  return res.data;
};