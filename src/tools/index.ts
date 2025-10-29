import type { ContractManagerMCP } from '../contractManagerMCP.js';
import { registerEmployeeTools } from './employeeTools.js';
import { registerTaskTools } from './taskTools.js';
import { registerTagTools } from './tagTools.js';
import { registerProgramTools } from './programTools.js';
import { registerContractTools } from './contractTools.js';

export async function initializeTools(agent: ContractManagerMCP) {
  registerEmployeeTools(agent);
  registerProgramTools(agent);
  registerContractTools(agent);
  registerTaskTools(agent);
  registerTagTools(agent);
}
