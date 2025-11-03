export const UI_COLORS = {
  COLOR_1: '#52c6dc',
  COLOR_2: '#72cee1',
  COLOR_3: '#8ed7e6',
  COLOR_4: '#a6dfeb',
  COLOR_5: '#bde7f0',
  COLOR_6: '#d4eff5',
  COLOR_7: '#eaf7fa',
  COLOR_WHITE: '#ffffff',
  TEXT_PRIMARY: '#1a1a1a',
  TEXT_SECONDARY: '#4a4a4a',
  TEXT_MUTED: '#6a6a6a',
} as const;

export const UI_STYLES = {
  FONT_FAMILY:
    "'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  FONT_FAMILY_MONO: "'Monaco', 'Courier New', monospace",
  LINE_HEIGHT: '1.6',
  BORDER_RADIUS: '8px',
  BORDER_RADIUS_LARGE: '16px',
  BORDER_RADIUS_FULL: '9999px',
  PADDING_SMALL: '0.5rem',
  PADDING_MEDIUM: '1rem',
  PADDING_LARGE: '1.5rem',
  PADDING_XLARGE: '2rem',
  TRANSITION_SPEED: '0.2s',
  TRANSITION_SPEED_SLOW: '0.3s',
} as const;

export const UI_FRAME_SIZES = {
  TASK_CARD_WIDTH: '900px',
  TASK_CARD_HEIGHT: '1000px',
  EMPLOYEE_CARD_WIDTH: '900px',
  EMPLOYEE_CARD_HEIGHT: '1000px',
  CONTRACT_DASHBOARD_WIDTH: '1200px',
  CONTRACT_DASHBOARD_HEIGHT: '1000px',
} as const;

export function getCSSVariables(): string {
  return `
:root {
  --color-1: ${UI_COLORS.COLOR_1};
  --color-2: ${UI_COLORS.COLOR_2};
  --color-3: ${UI_COLORS.COLOR_3};
  --color-4: ${UI_COLORS.COLOR_4};
  --color-5: ${UI_COLORS.COLOR_5};
  --color-6: ${UI_COLORS.COLOR_6};
  --color-7: ${UI_COLORS.COLOR_7};
  --color-white: ${UI_COLORS.COLOR_WHITE};
  
  --bg-body: var(--color-7);
  --bg-card: var(--color-white);
  --bg-header: linear-gradient(135deg, var(--color-3) 0%, var(--color-2) 100%);
  --bg-section: var(--color-6);
  --bg-hover: var(--color-5);
  
  --text-primary: ${UI_COLORS.TEXT_PRIMARY};
  --text-secondary: ${UI_COLORS.TEXT_SECONDARY};
  --text-muted: ${UI_COLORS.TEXT_MUTED};
  
  --border-light: var(--color-5);
  --border-medium: var(--color-3);
  --border-strong: var(--color-2);
}
`.trim();
}
