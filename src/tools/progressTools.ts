import type { ContractManagerMCP } from '../contractManagerMCP.js';
import { createText } from './utils.js';
import type { ToolAnnotations } from '../types/annotations.js';
import { runLongTaskInputSchema, runLongTaskOutputSchema } from './schemas/progressSchemas.js';

export async function registerProgressTools(agent: ContractManagerMCP) {
  agent.server.registerTool(
    'run_really_long_task',
    {
      title: 'Run Really Long Task',
      description:
        'Simulates a long-running operation with progress updates. Demonstrates progress token usage and task cancellation.',
      annotations: {
        destructiveHint: false,
        openWorldHint: false,
      } satisfies ToolAnnotations,
      inputSchema: runLongTaskInputSchema,
      outputSchema: runLongTaskOutputSchema,
    },
    async ({ duration = 30, steps = 10, taskName }, { _meta, signal, sendNotification }) => {
      const progressToken = _meta?.progressToken;
      const taskDisplayName = taskName || 'Long-running task';
      const stepDuration = (duration / steps) * 1000;
      const startTime = Date.now();

      for (let i = 1; i <= steps; i++) {
        if (signal?.aborted) {
          const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
          const structuredContent = {
            success: false,
            duration: parseFloat(elapsedSeconds),
            steps: i - 1,
            completedAt: new Date().toISOString(),
            cancelled: true,
          };
          return {
            content: [
              createText(
                `${taskDisplayName} was cancelled after ${elapsedSeconds}s (step ${i - 1}/${steps})`
              ),
              createText(structuredContent),
            ],
            structuredContent,
          };
        }

        await new Promise(resolve => setTimeout(resolve, stepDuration));

        if (progressToken !== undefined) {
          await sendNotification({
            method: 'notifications/progress',
            params: {
              progressToken,
              progress: i,
              total: steps,
              message: `${taskDisplayName}: Step ${i}/${steps} completed`,
            },
          });
        }
      }

      if (signal?.aborted) {
        const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
        const structuredContent = {
          success: false,
          duration: parseFloat(elapsedSeconds),
          steps,
          completedAt: new Date().toISOString(),
          cancelled: true,
        };
        return {
          content: [
            createText(`${taskDisplayName} was cancelled at completion`),
            createText(structuredContent),
          ],
          structuredContent,
        };
      }

      const elapsedSeconds = ((Date.now() - startTime) / 1000).toFixed(2);
      const structuredContent = {
        success: true,
        duration: parseFloat(elapsedSeconds),
        steps,
        completedAt: new Date().toISOString(),
        cancelled: false,
      };

      return {
        content: [
          createText(
            `${taskDisplayName} completed successfully! Duration: ${elapsedSeconds}s, Steps: ${steps}`
          ),
          createText(structuredContent),
        ],
        structuredContent,
      };
    }
  );
}
