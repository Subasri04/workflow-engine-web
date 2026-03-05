export interface Rule {
    _id: string;
    step_id: string;
    condition: string;
    next_step_id: string | null;
    priority: number;
    created_at: string;
    updated_at: string;
}
