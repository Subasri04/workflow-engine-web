import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRules, createRule, deleteRule } from "../api/rule.api";
import { getStepById, getSteps } from "../api/step.api";
import type { Rule } from "../types/rule.types";
import type { Step } from "../types/step.types";

const RuleEditor = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();

  const [rules, setRules] = useState<Rule[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const [condition, setCondition] = useState("");
  const [nextStepId, setNextStepId] = useState("");
  const [priority, setPriority] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!stepId) return;

    try {
      setLoading(true);

      const ruleData = await getRules(stepId);
      setRules(ruleData);

      const currentStep = await getStepById(stepId);
      if (!currentStep?.workflow_id) return;

      const workflowSteps = await getSteps(currentStep.workflow_id);

      const filteredSteps = workflowSteps.filter(
        (s: Step) => s._id !== stepId
      );

      setSteps(filteredSteps);
    } catch (error) {
      console.error("Failed to load rule data:", error);
    } finally {
      setLoading(false);
    }
  }, [stepId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddRule = async () => {
    if (!stepId || !condition || !nextStepId) return;

    try {
      await createRule(stepId, {
        step_id: stepId,
        condition,
        next_step_id: nextStepId === "END" ? null : nextStepId,
        priority
      });

      setCondition("");
      setNextStepId("");
      setPriority(1);

      await loadData();
    } catch (error) {
      console.error("Failed to create rule:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteRule(id);
      await loadData();
    } catch (error) {
      console.error("Failed to delete rule:", error);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Rule Editor</h1>

        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          Back to Steps
        </button>
      </div>

      <div className="bg-white border rounded-lg p-6 shadow space-y-4">
        <h2 className="text-lg font-semibold">Add Rule</h2>

        <div className="grid grid-cols-3 gap-4">
          <input
            placeholder="Condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="border px-3 py-2 rounded"
          />

          <select
            value={nextStepId}
            onChange={(e) => setNextStepId(e.target.value)}
            className="border px-3 py-2 rounded"
          >
            <option value="">Select Next Step</option>

            {steps.map((step) => (
              <option key={step._id} value={step._id}>
                {step.name}
              </option>
            ))}

            <option value="END">End Workflow</option>
          </select>

          <input
            type="number"
            min={1}
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="border px-3 py-2 rounded"
          />
        </div>

        <button
          onClick={handleAddRule}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Add Rule
        </button>
      </div>

      <div className="bg-white border rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Priority</th>
              <th className="p-3 text-left">Condition</th>
              <th className="p-3 text-left">Next Step</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {rules.map((rule) => {
              const step = steps.find(
                (s) => s._id === rule.next_step_id
              );

              return (
                <tr key={rule._id} className="border-t">
                  <td className="p-3">{rule.priority}</td>

                  <td className="p-3 font-mono text-sm">
                    {rule.condition}
                  </td>

                  <td className="p-3">
                    {rule.next_step_id ? step?.name : "END"}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(rule._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}

            {!loading && rules.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No rules found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RuleEditor;