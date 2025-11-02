import type { ContractManagerMCP } from '../contractManagerMCP.js';

/**
 * Notify all subscribers of a specific resource URI that it has been updated.
 * This sends a targeted notification only to clients who have subscribed to this URI.
 *
 * @param agent - The ContractManagerMCP instance
 * @param uri - The resource URI that was updated (e.g., 'contract-manager://contracts/CNT001')
 *
 * @example
 * // After updating a contract
 * await notifyResourceSubscribers(agent, 'contract-manager://contracts/CNT001');
 */
export async function notifyResourceSubscribers(
  agent: ContractManagerMCP,
  uri: string
): Promise<void> {
  const subscribers = agent.subscriptionManager.getSubscribers(uri);

  if (subscribers.length > 0) {
    console.error(
      `[Notification] Notifying ${subscribers.length} subscriber(s) of update to ${uri}`
    );

    // Send the resource updated notification
    // The SDK automatically targets the correct sessions
    await agent.server.server.sendResourceUpdated({ uri });
  }
}
