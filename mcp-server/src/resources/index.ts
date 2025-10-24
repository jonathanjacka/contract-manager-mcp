import type { ContractManagerMCP } from '../index.js';
import { registerEmployeeResources } from './employeeResources.js';

export async function initializeResources(agent: ContractManagerMCP) {
  // Register all resource categories
  registerEmployeeResources(agent);
}
