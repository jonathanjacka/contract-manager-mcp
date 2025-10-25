/**
 * Type-safe tool annotations that enforce proper combinations and defaults.
 *
 * Based on MCP ToolAnnotations interface with constraints:
 * - openWorldHint defaults to true, but this is a closed-world contract management system
 * - destructiveHint defaults to true, so we only allow explicit false for safe operations
 * - idempotentHint defaults to false, so we only allow explicit true for idempotent operations
 * - readOnlyHint defaults to false, when true it overrides other operation hints
 */
export type ToolAnnotations = {
  // Only allow false since this is a closed-world system (default is true)
  openWorldHint?: false;
} & (
  | {
      // When readOnlyHint is true, no other operation annotations can be changed
      readOnlyHint: true;
    }
  | {
      destructiveHint?: false; // Only allow false (default is true)
      idempotentHint?: true; // Only allow true (default is false)
    }
);
