import type { ContractManagerMCP } from '../index.js';
import { employeeService } from '../services/index.js';

export function registerEmployeeResources(agent: ContractManagerMCP) {
  agent.server.registerResource(
    'employees',
    'contract-manager://employees',
    {
      title: 'Employees',
      description: 'All employees currently in the database',
    },
    async uri => {
      const employees = await employeeService.getAll();
      return {
        contents: [
          {
            mimeType: 'application/json',
            text: JSON.stringify(employees),
            uri: uri.toString(),
          },
        ],
      };
    }
  );
}
