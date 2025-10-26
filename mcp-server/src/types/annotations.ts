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

export type ResourceAnnotations = {
  audience?: ('user' | 'assistant')[];
  priority?: number; // 0 (least important) to 1 (most important)
  lastModified?: string; // ISO 8601 format
};
