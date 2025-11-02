/**
 * Manages resource subscriptions for MCP clients.
 * Tracks which sessions are subscribed to which resource URIs.
 */
export class SubscriptionManager {
  // Maps session IDs to the set of URIs they're subscribed to
  private subscriptions = new Map<string, Set<string>>();

  // Subscribe a session to a resource URI
  subscribe(sessionId: string, uri: string): void {
    if (!this.subscriptions.has(sessionId)) {
      this.subscriptions.set(sessionId, new Set());
    }
    this.subscriptions.get(sessionId)!.add(uri);
    console.error(`[Subscription] Session ${sessionId} subscribed to ${uri}`);
  }

  // Unsubscribe a session from a resource URI
  unsubscribe(sessionId: string, uri: string): void {
    const uris = this.subscriptions.get(sessionId);
    if (uris) {
      uris.delete(uri);
      console.error(`[Subscription] Session ${sessionId} unsubscribed from ${uri}`);

      // Cleanup: remove session if no subscriptions left
      if (uris.size === 0) {
        this.subscriptions.delete(sessionId);
      }
    }
  }

  // Get all session IDs subscribed to a specific URI
  getSubscribers(uri: string): string[] {
    const subscribers: string[] = [];

    for (const [sessionId, uris] of this.subscriptions.entries()) {
      if (uris.has(uri)) {
        subscribers.push(sessionId);
      }
    }

    return subscribers;
  }

  // Clear all subscriptions for a session (e.g., when client disconnects)
  clearSession(sessionId: string): void {
    const count = this.subscriptions.get(sessionId)?.size || 0;
    this.subscriptions.delete(sessionId);
    if (count > 0) {
      console.error(`[Subscription] Cleared ${count} subscription(s) for session ${sessionId}`);
    }
  }

  // Get total number of active subscriptions across all sessions
  getSubscriptionCount(): number {
    let count = 0;
    for (const uris of this.subscriptions.values()) {
      count += uris.size;
    }
    return count;
  }

  // Get all URIs a session is subscribed to
  getSessionSubscriptions(sessionId: string): string[] {
    return Array.from(this.subscriptions.get(sessionId) || []);
  }
}
