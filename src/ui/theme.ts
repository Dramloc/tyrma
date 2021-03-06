const colors = {
  transparent: "transparent",
  white: "#ffffff",
  black: "#000000",
  gray: {
    "50": "#f9fafb",
    "100": "#f4f5f7",
    "200": "#e5e7eb",
    "300": "#d2d6dc",
    "400": "#9fa6b2",
    "500": "#6b7280",
    "600": "#4b5563",
    "700": "#374151",
    "800": "#252f3f",
    "900": "#161e2e",
  },
  "cool-gray": {
    "50": "#fbfdfe",
    "100": "#f1f5f9",
    "200": "#e2e8f0",
    "300": "#cfd8e3",
    "400": "#97a6ba",
    "500": "#64748b",
    "600": "#475569",
    "700": "#364152",
    "800": "#27303f",
    "900": "#1a202e",
  },
  red: {
    "50": "#fdf2f2",
    "100": "#fde8e8",
    "200": "#fbd5d5",
    "300": "#f8b4b4",
    "400": "#f98080",
    "500": "#f05252",
    "600": "#e02424",
    "700": "#c81e1e",
    "800": "#9b1c1c",
    "900": "#771d1d",
  },
  orange: {
    "50": "#fff8f1",
    "100": "#feecdc",
    "200": "#fcd9bd",
    "300": "#fdba8c",
    "400": "#ff8a4c",
    "500": "#ff5a1f",
    "600": "#d03801",
    "700": "#b43403",
    "800": "#8a2c0d",
    "900": "#771d1d",
  },
  yellow: {
    "50": "#fdfdea",
    "100": "#fdf6b2",
    "200": "#fce96a",
    "300": "#faca15",
    "400": "#e3a008",
    "500": "#c27803",
    "600": "#9f580a",
    "700": "#8e4b10",
    "800": "#723b13",
    "900": "#633112",
  },
  green: {
    "50": "#f3faf7",
    "100": "#def7ec",
    "200": "#bcf0da",
    "300": "#84e1bc",
    "400": "#31c48d",
    "500": "#0e9f6e",
    "600": "#057a55",
    "700": "#046c4e",
    "800": "#03543f",
    "900": "#014737",
  },
  teal: {
    "50": "#edfafa",
    "100": "#d5f5f6",
    "200": "#afecef",
    "300": "#7edce2",
    "400": "#16bdca",
    "500": "#0694a2",
    "600": "#047481",
    "700": "#036672",
    "800": "#05505c",
    "900": "#014451",
  },
  blue: {
    "50": "#ebf5ff",
    "100": "#e1effe",
    "200": "#c3ddfd",
    "300": "#a4cafe",
    "400": "#76a9fa",
    "500": "#3f83f8",
    "600": "#1c64f2",
    "700": "#1a56db",
    "800": "#1e429f",
    "900": "#233876",
  },
  indigo: {
    "50": "#f0f5ff",
    "100": "#e5edff",
    "200": "#cddbfe",
    "300": "#b4c6fc",
    "400": "#8da2fb",
    "500": "#6875f5",
    "600": "#5850ec",
    "700": "#5145cd",
    "800": "#42389d",
    "900": "#362f78",
  },
  purple: {
    "50": "#f6f5ff",
    "100": "#edebfe",
    "200": "#dcd7fe",
    "300": "#cabffd",
    "400": "#ac94fa",
    "500": "#9061f9",
    "600": "#7e3af2",
    "700": "#6c2bd9",
    "800": "#5521b5",
    "900": "#4a1d96",
  },
  pink: {
    "50": "#fdf2f8",
    "100": "#fce8f3",
    "200": "#fad1e8",
    "300": "#f8b4d9",
    "400": "#f17eb8",
    "500": "#e74694",
    "600": "#d61f69",
    "700": "#bf125d",
    "800": "#99154b",
    "900": "#751a3d",
  },
};

const spacing = {
  px: "1px",
  "0": "0",
  "0.5": "0.125rem",
  "1": "0.25rem",
  "1.5": "0.375rem",
  "2": "0.5rem",
  "2.5": "0.625rem",
  "3": "0.75rem",
  "3.5": "0.875rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "9": "2.25rem",
  "10": "2.5rem",
  "11": "2.75rem",
  "12": "3rem",
  "13": "3.25rem",
  "14": "3.5rem",
  "15": "3.75rem",
  "16": "4rem",
  "20": "5rem",
  "24": "6rem",
  "28": "7rem",
  "32": "8rem",
  "36": "9rem",
  "40": "10rem",
  "48": "12rem",
  "56": "14rem",
  "60": "15rem",
  "64": "16rem",
  "72": "18rem",
  "80": "20rem",
  "96": "24rem",
  "1/2": "50%",
  "1/3": "33.333333%",
  "2/3": "66.666667%",
  "1/4": "25%",
  "2/4": "50%",
  "3/4": "75%",
  "1/5": "20%",
  "2/5": "40%",
  "3/5": "60%",
  "4/5": "80%",
  "1/6": "16.666667%",
  "2/6": "33.333333%",
  "3/6": "50%",
  "4/6": "66.666667%",
  "5/6": "83.333333%",
  "1/12": "8.333333%",
  "2/12": "16.666667%",
  "3/12": "25%",
  "4/12": "33.333333%",
  "5/12": "41.666667%",
  "6/12": "50%",
  "7/12": "58.333333%",
  "8/12": "66.666667%",
  "9/12": "75%",
  "10/12": "83.333333%",
  "11/12": "91.666667%",
  full: "100%",
};

const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

const boxShadow = {
  xs: "0 0 0 1px rgba(0, 0, 0, 0.05)",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  default: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  none: "none",
  solid: "0 0 0 2px currentColor",
  outline: `0 0 0 3px rgba(118, 169, 250, 0.45)`,
  "outline-gray": `0 0 0 3px rgba(159, 166, 178, 0.45)`,
  "outline-blue": `0 0 0 3px rgba(164, 202, 254, 0.45)`,
  "outline-teal": `0 0 0 3px rgba(126, 220, 226, 0.45)`,
  "outline-green": `0 0 0 3px rgba(132, 225, 188, 0.45)`,
  "outline-yellow": `0 0 0 3px rgba(250, 202, 21, 0.45)`,
  "outline-orange": `0 0 0 3px rgba(253, 186, 140, 0.45)`,
  "outline-red": `0 0 0 3px rgba(248, 180, 180, 0.45)`,
  "outline-pink": `0 0 0 3px rgba(248, 180, 217, 0.45)`,
  "outline-purple": `0 0 0 3px rgba(202, 191, 253, 0.45)`,
  "outline-indigo": `0 0 0 3px rgba(180, 198, 252, 0.45)`,
};

const borderWidth = {
  default: "1px",
  "0": "0",
  "2": "2px",
  "4": "4px",
  "8": "8px",
};

const borderRadius = {
  none: "0",
  sm: "0.125rem",
  default: "0.25rem",
  md: "0.375rem",
  lg: "0.5rem",
  full: "9999px",
};

const fontFamily = {
  sans: [
    "system-ui",
    "-apple-system",
    "BlinkMacSystemFont",
    '"Segoe UI"',
    "Roboto",
    '"Helvetica Neue"',
    "Arial",
    '"Noto Sans"',
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"',
  ].join(),
  serif: ["Georgia", "Cambria", '"Times New Roman"', "Times", "serif"].join(),
  mono: ["Menlo", "Monaco", "Consolas", '"Liberation Mono"', '"Courier New"', "monospace"].join(),
};

const fontSize = {
  xs: "0.75rem",
  sm: "0.875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "4rem",
};

const fontWeight = {
  hairline: 100,
  thin: 200,
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
};

const letterSpacing = {
  tighter: "-0.05em",
  tight: "-0.025em",
  normal: "0",
  wide: "0.025em",
  wider: "0.05em",
  widest: "0.1em",
};

const lineHeight = {
  none: "1",
  tight: "1.25",
  snug: "1.375",
  normal: "1.5",
  relaxed: "1.625",
  loose: "2",
  "3": ".75rem",
  "4": "1rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "9": "2.25rem",
  "10": "2.5rem",
};

const transitionProperty = {
  none: "none",
  all: "all",
  default: "background-color, border-color, color, fill, stroke, opacity, box-shadow, transform",
  colors: "background-color, border-color, color, fill, stroke",
  opacity: "opacity",
  shadow: "box-shadow",
  transform: "transform",
};

const transitionTimingFunction = {
  linear: "linear",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  "in-out": "cubic-bezier(0.4, 0, 0.2, 1)",
};

const transitionDuration = {
  "75": "75ms",
  "100": "100ms",
  "150": "150ms",
  "200": "200ms",
  "300": "300ms",
  "500": "500ms",
  "700": "700ms",
  "1000": "1000ms",
};

const transitionDelay = {
  "75": "75ms",
  "100": "100ms",
  "150": "150ms",
  "200": "200ms",
  "300": "300ms",
  "500": "500ms",
  "700": "700ms",
  "1000": "1000ms",
};

export const theme = {
  colors,
  spacing,
  breakpoints,
  boxShadow,
  borderWidth,
  borderRadius,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  transitionProperty,
  transitionTimingFunction,
  transitionDuration,
  transitionDelay,
};

export type Theme = typeof theme;
