import type { ContractManagerMCP } from '../contractManagerMCP.js';
import { registerEmployeeResources } from './employeeResources.js';
import { registerProgramResources } from './programResources.js';
import { registerContractResources } from './contractResources.js';
import { registerTaskResources } from './taskResources.js';
import { registerTagResources } from './tagResources.js';

export interface ResourceNotifiers {
  notifyEmployeeResourceChanged: () => void;
  notifyProgramResourceChanged: () => void;
  notifyContractResourceChanged: () => void;
  notifyTaskResourceChanged: () => void;
  notifyTagResourceChanged: () => void;
}

export async function initializeResources(agent: ContractManagerMCP): Promise<ResourceNotifiers> {
  const notifyEmployeeResourceChanged = registerEmployeeResources(agent);
  const notifyProgramResourceChanged = registerProgramResources(agent);
  const notifyContractResourceChanged = registerContractResources(agent);
  const notifyTaskResourceChanged = registerTaskResources(agent);
  const notifyTagResourceChanged = registerTagResources(agent);

  return {
    notifyEmployeeResourceChanged,
    notifyProgramResourceChanged,
    notifyContractResourceChanged,
    notifyTaskResourceChanged,
    notifyTagResourceChanged,
  };
}
