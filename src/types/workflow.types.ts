export type InputFieldType = "string" | "number" | "boolean";

export interface InputFieldConfig {
  type: InputFieldType;
  allowed_values?: string[];
}

export type InputSchema =
  | InputFieldType
  | InputFieldConfig;

export interface Workflow {
  _id: string;
  name: string;
  version: number;
  status: string;
  input_schema: Record<string, InputSchema>;
  is_active: boolean;
}
