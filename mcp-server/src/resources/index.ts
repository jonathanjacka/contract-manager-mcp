import type { ContractManagerMCP } from '../index.js';
import { registerEmployeeResources } from './employeeResources.js';
import { registerProgramResources } from './programResources.js';
import { registerContractResources } from './contractResources.js';
import { registerTaskResources } from './taskResources.js';
import { registerTagResources } from './tagResources.js';

export async function initializeResources(agent: ContractManagerMCP) {
  registerEmployeeResources(agent);
  registerProgramResources(agent);
  registerContractResources(agent);
  registerTaskResources(agent);
  registerTagResources(agent);
}
