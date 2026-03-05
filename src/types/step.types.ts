export type StepType = "approval" | "notification" | "task";

export interface Step {
  _id: string;
  workflow_id: string;
  name: string;
  step_type: StepType;
  order: number;
  metadata: Record<string, string>;
  created_at: string;
  updated_at: string;
}
