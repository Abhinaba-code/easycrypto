
type ThemeColors = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
};

export type Theme = {
  name: string;
  mode: 'light' | 'dark';
  colors: {
    light: Partial<ThemeColors>;
    dark: Partial<ThemeColors>;
  };
};

export const themes: Theme[] = [
  {
    name: "Default",
    mode: "light",
    colors: {
      light: {
        background: "0 0% 100%",
        foreground: "222.2 84% 4.9%",
        primary: "262 52% 50%",
        primaryForeground: "0 0% 98%",
        accent: "231 48% 51%",
      },
      dark: {
        background: "0 0% 13%",
        foreground: "0 0% 98%",
        primary: "262 52% 50%",
        primaryForeground: "0 0% 98%",
        accent: "231 48% 51%",
      },
    },
  },
  {
    name: "Stone",
    mode: "light",
    colors: {
      light: {
        background: "240 5% 96%",
        foreground: "240 10% 3.9%",
        primary: "240 5.9% 10%",
        primaryForeground: "0 0% 98%",
        accent: "240 4.8% 95.9%",
      },
      dark: {
        background: "240 10% 3.9%",
        foreground: "0 0% 98%",
        primary: "0 0% 98%",
        primaryForeground: "240 5.9% 10%",
        accent: "240 3.7% 15.9%",
      },
    },
  },
  {
    name: "Ocean",
    mode: "dark",
    colors: {
      light: {
        background: "204 100% 95%",
        foreground: "204 100% 10%",
        primary: "204 90% 45%",
        primaryForeground: "0 0% 100%",
        accent: "198 93% 59%",
      },
      dark: {
        background: "204 100% 4%",
        foreground: "204 20% 98%",
        primary: "204 90% 55%",
        primaryForeground: "0 0% 100%",
        accent: "198 93% 69%",
      },
    },
  },
  {
    name: "Forest",
    mode: "dark",
    colors: {
      light: {
        background: "120 40% 97%",
        foreground: "120 25% 10%",
        primary: "140 60% 35%",
        primaryForeground: "0 0% 100%",
        accent: "130 50% 55%",
      },
      dark: {
        background: "120 25% 5%",
        foreground: "120 10% 95%",
        primary: "140 60% 45%",
        primaryForeground: "0 0% 100%",
        accent: "130 50% 65%",
      },
    },
  },
  {
    name: "Sunset",
    mode: "dark",
    colors: {
      light: {
        background: "30 100% 97%",
        foreground: "20 50% 15%",
        primary: "15 90% 55%",
        primaryForeground: "0 0% 100%",
        accent: "30 95% 60%",
      },
      dark: {
        background: "20 50% 8%",
        foreground: "30 30% 95%",
        primary: "15 90% 60%",
        primaryForeground: "0 0% 100%",
        accent: "30 95% 70%",
      },
    },
  },
  {
    name: "Rose",
    mode: "light",
    colors: {
      light: {
        background: "345 100% 97%",
        foreground: "340 30% 20%",
        primary: "340 80% 60%",
        primaryForeground: "0 0% 100%",
        accent: "335 85% 70%",
      },
      dark: {
        background: "340 30% 10%",
        foreground: "345 20% 95%",
        primary: "340 80% 70%",
        primaryForeground: "0 0% 100%",
        accent: "335 85% 80%",
      },
    },
  },
  {
    name: "Sky",
    mode: "light",
    colors: {
      light: {
        background: "210 100% 97%",
        foreground: "220 30% 20%",
        primary: "220 80% 60%",
        primaryForeground: "0 0% 100%",
        accent: "215 85% 70%",
      },
      dark: {
        background: "220 30% 10%",
        foreground: "210 20% 95%",
        primary: "220 80% 70%",
        primaryForeground: "0 0% 100%",
        accent: "215 85% 80%",
      },
    },
  },
  {
    name: "Mint",
    mode: "light",
    colors: {
      light: {
        background: "150 60% 97%",
        foreground: "160 30% 15%",
        primary: "160 70% 40%",
        primaryForeground: "0 0% 100%",
        accent: "155 75% 55%",
      },
      dark: {
        background: "160 30% 8%",
        foreground: "150 20% 95%",
        primary: "160 70% 50%",
        primaryForeground: "0 0% 100%",
        accent: "155 75% 65%",
      },
    },
  },
  {
    name: "Gold",
    mode: "dark",
    colors: {
      light: {
        background: "45 100% 97%",
        foreground: "40 50% 20%",
        primary: "40 90% 50%",
        primaryForeground: "0 0% 0%",
        accent: "45 95% 60%",
      },
      dark: {
        background: "40 50% 8%",
        foreground: "45 30% 95%",
        primary: "40 90% 60%",
        primaryForeground: "0 0% 0%",
        accent: "45 95% 70%",
      },
    },
  },
  {
    name: "Matrix",
    mode: "dark",
    colors: {
      light: {},
      dark: {
        background: "0 0% 0%",
        foreground: "120 100% 50%",
        primary: "120 100% 50%",
        primaryForeground: "0 0% 0%",
        accent: "120 100% 30%",
        border: "120 100% 20%",
        input: "120 100% 10%",
      },
    },
  },
].map(theme => ({
  ...theme,
  colors: {
    light: {
      background: "0 0% 100%",
      foreground: "222.2 84% 4.9%",
      card: "0 0% 100%",
      cardForeground: "222.2 84% 4.9%",
      popover: "0 0% 100%",
      popoverForeground: "222.2 84% 4.9%",
      primary: "262 52% 50%",
      primaryForeground: "0 0% 98%",
      secondary: "210 40% 96.1%",
      secondaryForeground: "215.4 16.3% 46.9%",
      muted: "210 40% 96.1%",
      mutedForeground: "215.4 16.3% 46.9%",
      accent: "231 48% 51%",
      accentForeground: "0 0% 98%",
      destructive: "0 84.2% 60.2%",
      destructiveForeground: "0 0% 98%",
      border: "214.3 31.8% 91.4%",
      input: "214.3 31.8% 91.4%",
      ring: "222.2 84% 4.9%",
      ...theme.colors.light,
    },
    dark: {
      background: "0 0% 13%",
      foreground: "0 0% 98%",
      card: "0 0% 15%",
      cardForeground: "0 0% 98%",
      popover: "0 0% 15%",
      popoverForeground: "0 0% 98%",
      primary: "262 52% 50%",
      primaryForeground: "0 0% 98%",
      secondary: "0 0% 20%",
      secondaryForeground: "0 0% 98%",
      muted: "0 0% 20%",
      mutedForeground: "0 0% 63.9%",
      accent: "231 48% 51%",
      accentForeground: "0 0% 98%",
      destructive: "0 62.8% 30.6%",
      destructiveForeground: "0 0% 98%",
      border: "0 0% 25%",
      input: "0 0% 25%",
      ring: "231 48% 51%",
      ...theme.colors.dark,
    }
  }
}));
