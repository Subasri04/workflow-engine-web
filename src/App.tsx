import { Routes, Route } from "react-router-dom";
import Workflows from "./pages/Workflows";
import CreateWorkflow from "./pages/CreateWorkflow";
import WorkflowSteps from "./pages/WorkflowSteps";
import EditWorkflow from "./pages/EditWorkflow";
import ExecutionStart from "./pages/ExecutionStart";
import Executions from "./pages/Executions";
import ExecutionDetail from "./pages/ExecutionDetail";
import RuleEditor from "./pages/RuleEditor";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Workflows />} />
      <Route path="/workflows" element={<Workflows />} />
      <Route path="/workflows/create" element={<CreateWorkflow />} />
      <Route path="/workflows/:id/edit" element={<EditWorkflow />} />
      <Route path="/workflows/:id/steps" element={<WorkflowSteps />} />
      <Route path="/executions/start/:workflowId" element={<ExecutionStart />} />
      <Route path="/executions" element={<Executions />} />
      <Route path="/executions/:id" element={<ExecutionDetail />} />
      <Route path="/steps/:stepId/rules" element={<RuleEditor />} />
    </Routes>
  );
}

export default App;
