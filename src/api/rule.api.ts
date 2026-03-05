import api from "./api";
import type { Rule } from "../types/rule.types";

export interface CreateRulePayload {
    step_id: string;
    condition: string;
    next_step_id: string | null;
    priority: number;
}

export const getRules = async (stepId: string): Promise<Rule[]> => {
    const res = await api.get<Rule[]>(`/rules/${stepId}`);
    return res.data;
};

export const createRule = async (stepId: string, data: CreateRulePayload) => {
    const res = await api.post<Rule>(`/rules/${stepId}`, data);
    return res.data;
};

export const deleteRule = async (id: string) => {
    const res = await api.delete(`/rules/${id}`);
    return res.data;
};
