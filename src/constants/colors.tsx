// Define a type for the COLORS object
export type ColorsType = {
  PRIMARY: string;
  PRIMARY_BACKGROND: string;
  SECONDARY: string;
  GREY: string;
  ERROR: string;
  SUCCESS: string;
  SUCCESS_BG: string;
  PRIMARY_BG: string;
  PRIMARY_TXT: string;
  STRENGTH_METER_BG: string;
  LIGHT_GREY: string;
  DIVIDER: string;
  BG_OFF_WHITE: string;
  ORANGE: string;
  OFFWHITE: string;
  WHITE: string;
  GREEN: string;
  BRIGHT_PURPLE: string;
  NEON_GREEN: string;
  OCEAN_BLUE: string;
  BRIGHT_ORANGE: string;
  WARNING: string;
  WARNING_BG: string;
  ROSE: string;
  NOTIFICATIONS: string;
  GREEN100: string;
  DESERT_SAND: string;
  BLACK: string;
  NAVBAR_DIVIDER: string;
  SECONDARY_BUTTON: string;
  desciptionTxt: string;
  PRIMARY_BLUE: string;
  LIGTH_BLUE: string;
  LIGHT_GREEN: string;
  BAGE_LIGTH_BLUE: string;
  TRANSPARENT: string;
  SKY_BLUE: string;
  GRADIENT_START: string;
  GRADIENT_END: string;
};

// Define a type for the GRADIENT object
export type GradientType = {
  BG_GRADIENT: string[];
  CARD_BLOGS: string[];
  JS_FORM: string[];
};

// Define a type for the ALERT_COLORS object
export type AlertColorsType = {
  SUCCESS: string;
  SUCCESS_TEXT: string;
  INFO: string;
  INFO_TEXT: string;
  WARNING: string;
  WARNING_TEXT: string;
  ERROR: string;
  ERROR_TEXT: string;
};

// Define the COLORS object
export const COLORS: ColorsType = {
  PRIMARY: "#0E1630",
  PRIMARY_BACKGROND: "#3456FF20",
  SECONDARY: "#01D48C",
  GREY: "#6A7282",
  ERROR: "#FF5652",
  SUCCESS: "#016630",
  SUCCESS_BG: "#DDFBE8",
  PRIMARY_BG: "#3456FF19",
  PRIMARY_TXT: "#070928",
  STRENGTH_METER_BG: "#07092810",
  LIGHT_GREY: "#E0E0E0",
  DIVIDER: "#888888",
  BG_OFF_WHITE: "#f8f8f8",
  ORANGE: "#F29355",
  OFFWHITE: "#FAFAFA",
  WHITE: "#FFFFFF",
  GREEN: "#2CAE4E",
  BRIGHT_PURPLE: "#8244FF",
  NEON_GREEN: "#C1FF44",
  OCEAN_BLUE: "#6574D3",
  BRIGHT_ORANGE: "#FF7D1F",
  WARNING: "#A65F00",
  WARNING_BG: "#FEF9C2",
  ROSE: "#FF516E",
  NOTIFICATIONS: "#FF3456",
  GREEN100: "#67D383",
  DESERT_SAND: "#EBD0A8",
  BLACK: "#000000",
  NAVBAR_DIVIDER: "#F2F2F2",
  SECONDARY_BUTTON: "#6A5E5E",
  desciptionTxt: "#00000008",
  PRIMARY_BLUE: "#1FA1FF",
  LIGTH_BLUE: "#55B4F2",
  LIGHT_GREEN: "#BCF0DD",
  BAGE_LIGTH_BLUE: "#73d0e1",
  TRANSPARENT: "#00000000",
  SKY_BLUE: "#31E4F4",
  GRADIENT_START: "#01B07A",
  GRADIENT_END: "#1A223F",
};

// Define the GRADIENT object
export const GRADIENT: GradientType = {
  BG_GRADIENT: [COLORS.GRADIENT_START, COLORS.GRADIENT_END],
  CARD_BLOGS: ["rgba(0, 0, 0, 1)", COLORS.TRANSPARENT],
  JS_FORM: [COLORS.GRADIENT_START, COLORS.TRANSPARENT, COLORS.GRADIENT_END],
};

// Define the ALERT_COLORS object
export const ALERT_COLORS: AlertColorsType = {
  SUCCESS: "#EFF7EE",
  SUCCESS_TEXT: "#74B369",
  INFO: "#EAF4FC",
  INFO_TEXT: "#569FEE",
  WARNING: "#FDF4E7",
  WARNING_TEXT: "#F3A549",
  ERROR: "#FAEDEB",
  ERROR_TEXT: "#E46152",
};