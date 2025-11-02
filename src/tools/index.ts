import type { ContractManagerMCP } from '../contractManagerMCP.js';
import { registerEmployeeTools } from './employeeTools.js';
import { registerTaskTools } from './taskTools.js';
import { registerTagTools } from './tagTools.js';
import { registerProgramTools } from './programTools.js';
import { registerContractTools } from './contractTools.js';
import { registerProgressTools } from './progressTools.js';

export async function initializeTools(agent: ContractManagerMCP) {
  await registerEmployeeTools(agent);
  await registerProgramTools(agent);
  await registerContractTools(agent);
  await registerTaskTools(agent);
  await registerTagTools(agent);
  await registerProgressTools(agent);
}
