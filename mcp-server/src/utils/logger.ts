import chalk from 'chalk';

export const logger = {
  mcpRequest: (method: string, id: string | number) => {
    console.log(chalk.blue(`MCP Request - Method: ${method}, ID: ${id}`));
  },

  mcpConnected: (method: string, id: string | number) => {
    console.log(chalk.green(`MCP Transport connected for ${method} (ID: ${id})`));
  },

  mcpClosed: (method: string, id: string | number) => {
    console.log(chalk.gray(`MCP Transport closed for ${method} (ID: ${id})`));
  },

  mcpError: (method: string, id: string | number, error: unknown) => {
    console.error(chalk.red(`MCP Error for ${method} (ID: ${id}):`), error);
  },

  serverStarted: (port: number) => {
    console.log(chalk.green(`Contract Manager MCP Server running on http://localhost:${port}/mcp`));
    console.log('');
    console.log(chalk.cyan('Connect with MCP Inspector:'));
    console.log(chalk.cyan(`  npx @modelcontextprotocol/inspector`));
    console.log(chalk.cyan(`  Then connect to: http://localhost:${port}/mcp`));
  },

  serverError: (error: unknown) => {
    console.error(chalk.red('Server error:'), error);
  },

  success: (message: string) => {
    console.log(chalk.green(message));
  },

  error: (message: string, error?: unknown) => {
    if (error) {
      console.error(chalk.red(message), error);
    } else {
      console.error(chalk.red(message));
    }
  },

  info: (message: string) => {
    console.log(chalk.blue(message));
  },

  warn: (message: string) => {
    console.log(chalk.yellow(message));
  },

  debug: (message: string) => {
    console.log(chalk.gray(message));
  },
};
