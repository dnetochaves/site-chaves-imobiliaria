/**
 * Design tokens em TypeScript — mesmos valores de tokens.css, para uso em
 * contextos que não leem CSS custom properties (ex.: estilo de camadas do
 * MapLibre GL). Ver src/styles/README.md.
 *
 * Qualquer alteração aqui deve ser espelhada em src/styles/tokens.css.
 */

export const colors = {
  petroleo: {
    50: "#edf4f5",
    100: "#d6e6e8",
    200: "#b4d2d6",
    300: "#8fb9be",
    500: "#2e7a85",
    600: "#1b5d68",
    700: "#0d4650",
    900: "#072e35",
  },
  areia: {
    50: "#fbf2e7",
    100: "#f5e2cb",
    200: "#edd0a9",
    300: "#e7be8c",
    500: "#d2954f",
    600: "#b87c3c",
    700: "#94612c",
    900: "#5e3d18",
  },
  cal: {
    0: "#ffffff",
    50: "#f8f7f4",
    100: "#efede8",
    200: "#e1ded7",
    300: "#c8c4bb",
    400: "#8b8f8c",
    700: "#4b5f63",
    900: "#12262a",
  },
} as const;

export const brand = {
  primary: colors.petroleo[700],
  primaryHover: "#0a3a43",
  primaryActive: colors.petroleo[900],
  primarySubtle: colors.petroleo[50],
  secondary: colors.areia[500],
  secondaryHover: colors.areia[600],
  secondaryActive: colors.areia[700],
  secondarySubtle: colors.areia[50],
} as const;

export const background = {
  default: colors.cal[0],
  subtle: colors.cal[50],
  muted: colors.cal[100],
  inverse: colors.petroleo[900],
} as const;

export const text = {
  primary: "#12262a",
  secondary: "#4b5f63",
  muted: "#6e7a7c",
  disabled: "#a8a59c",
} as const;

export const border = {
  subtle: colors.cal[100],
  default: colors.cal[200],
  strong: colors.cal[300],
  focus: colors.petroleo[500],
} as const;

export const feedback = {
  success: "#1e7a5f",
  successSubtle: "#e8f3ef",
  warning: "#b5771a",
  warningSubtle: "#fbf2e2",
  error: "#b23a32",
  errorSubtle: "#faeceb",
  info: "#2a6b8f",
  infoSubtle: "#eaf2f7",
} as const;

export const fontFamily = {
  sans: '"Plus Jakarta Sans", ui-sans-serif, system-ui, sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, "SFMono-Regular", monospace',
} as const;

export const spacing = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px",
  32: "128px",
} as const;

export const radius = {
  sm: "6px",
  md: "10px",
  lg: "14px",
  xl: "20px",
  "2xl": "28px",
  full: "9999px",
} as const;

/**
 * Valores estimados — o PDF não expõe blur/opacidade em texto extraível.
 * Conferir visualmente contra design_system/Tokens.pdf (task 7.2).
 */
export const shadow = {
  sm: "0 1px 2px 0 rgb(18 38 42 / 0.06)",
  md: "0 4px 8px -2px rgb(18 38 42 / 0.1)",
  lg: "0 12px 20px -4px rgb(18 38 42 / 0.12)",
  xl: "0 24px 40px -8px rgb(18 38 42 / 0.16)",
} as const;

export const motion = {
  duration: {
    instant: 80,
    fast: 140,
    base: 200,
    slow: 320,
  },
  easing: {
    out: "cubic-bezier(0.2, 0.8, 0.3, 1)",
    in: "cubic-bezier(0.4, 0, 1, 1)",
    soft: "cubic-bezier(0.4, 0, 0.2, 1)",
  },
} as const;

export const breakpoint = {
  sm: 375,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1440,
} as const;

export const zIndex = {
  base: 0,
  sticky: 100,
  dropdown: 200,
  overlay: 300,
  modal: 400,
  toast: 500,
} as const;
