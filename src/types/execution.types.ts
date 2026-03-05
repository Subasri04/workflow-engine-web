export interface RuleLog {
    rule: string
    result: boolean
}

export interface StepLog {
    step_name: string
    rule_logs: RuleLog[]
    selected_next_step: string | null
}

export interface WorkflowRef {
    _id: string
    name: string
}

export interface Execution {
    _id: string;
    workflow_id: { name: string, _id: string };
    workflow_version: number;
    status: string;
    started_at: string;
    ended_at?: string | null;
    logs: StepLog[];
}
