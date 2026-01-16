export type ThemeName = "light" | "dark";

export type AppTheme = {
  name: ThemeName;
  colors: {
    // базовые
    bgWhite: string;
    textColor: string;
    bgGreen: string;
    bgBrown: string;
    bgYellow: string;
    bgPurple: string;
    success: string;
    error: string;
    gray: string;

    // используемые (derived)
    background: string;
    bgPrimary: string;
    bgSecondary: string;
    borderColor: string; // rgba
    labelColor: string;

    // hover (в RN hover почти не нужен; пригодится для web/desktop или pressed)
    hoverBgPrimary: string;
    hoverBgSecondary: string;
    hoverBgWhite: string;

    // акценты
    accentColor: string;
    accentHoverColor: string;
    accentTextColor: string;
    accentHoverTextColor: string;
  };

  typography: {
    // В RN fontSize — число (px), не rem.
    fontSizeBase: number; // аналог 0.875rem при base 16 => 14
    headingsLetterSpacing: number; // 1px
    fontButtons: string; // mulish
    fontHeadings: string; // Nunito Sans
    lineHeightBase: number; // "normal" в RN нет, задаем руками
  };

  breakpoints: {
    phone: number; // 768
    tablet: number; // 1024
  };

  radii: {
    desktop: number; // 30
    phone: number; // 15
  };

  spacing: {
    // базовая шкала отступов (можно менять)
    x2: number; // 8
    x3: number; // 12
    x4: number; // 16
    x5: number; // 20
    x6: number; // 24
  };
};

const base = {
  bgWhite: "#f8f8f8",
  textColor: "#032c28",
  bgGreen: "#8fe248",
  bgBrown: "#f0e9e2",
  bgYellow: "#fee200",
  bgPurple: "#ffb9ff",
  success: "#16a34a",
  error: "#dc2626",
  gray: "#888",
};

export const lightTheme: AppTheme = {
  name: "light",
  colors: {
    ...base,
    background: base.bgWhite,
    bgPrimary: base.bgGreen,
    bgSecondary: "#efefef",
    borderColor: "rgba(0,0,0,0.2)", // из rgb(0,0,0,0.2)
    labelColor: base.gray,

    hoverBgPrimary: "#aaf46a",
    hoverBgSecondary: "#e0e0e0",
    hoverBgWhite: "#efefef",

    accentColor: base.bgGreen,
    accentHoverColor: "#aaf46a",
    accentTextColor: base.textColor,
    accentHoverTextColor: "#095851",
  },
  typography: {
    fontSizeBase: 14, // 0.875rem * 16px
    headingsLetterSpacing: 1,
    fontButtons: "Mulish",
    fontHeadings: "NunitoSans",
    lineHeightBase: 18, // под 14px обычно 18–20 комфортно
  },
  breakpoints: {
    phone: 768,
    tablet: 1024,
  },
  radii: {
    desktop: 30,
    phone: 15,
  },
  spacing: {
    x2: 8,
    x3: 12,
    x4: 16,
    x5: 20,
    x6: 24,
  },
};
