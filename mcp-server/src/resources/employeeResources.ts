import { ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ContractManagerMCP } from '../index.js';
import { employeeService } from '../services/index.js';
import { assert } from '../utils/assert.js';

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

  agent.server.registerResource(
    'employee',
    new ResourceTemplate('contract-manager://employees/{code}', {
      complete: {
        async code(value) {
          const employees = await employeeService.getAll();
          return employees
            .map(employee => employee.code)
            .filter(code => code.toLowerCase().includes(value.toLowerCase()));
        },
      },
      list: undefined,

      // Leaving this here for demo purposes
      // async () => {
      //   const employees = await employeeService.getAll();
      //   return {
      //     resources: employees.map(employee => ({
      //       name: `${employee.code}: ${employee.name}`,
      //       uri: `contract-manager://employees/${employee.code}`,
      //       mimeType: 'application/json',
      //     })),
      //   };
      // },
    }),
    {
      title: 'Employee',
      description: 'A single employee with the given code',
    },
    async (uri, { code }) => {
      assert(typeof code === 'string', `Invalid employee code: ${code}`);
      const employee = await employeeService.getByCode(code);
      assert(employee, `Employee with code "${code}" not found`);
      return {
        contents: [
          {
            mimeType: 'application/json',
            text: JSON.stringify(employee),
            uri: uri.toString(),
          },
        ],
      };
    }
  );
}
