import { createTheme } from "@mui/material/styles";

// Brand palette (uniPin-style blue + orange accent)
const theme = createTheme({
  palette: {
    primary: { main: "#1A73E8", dark: "#0F57C4", contrastText: "#FFFFFF" },
    secondary: { main: "#FF6B00", contrastText: "#FFFFFF" },
    background: { default: "#F5F7FB", paper: "#FFFFFF" },
    text: { primary: "#0F172A", secondary: "#5B6472" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
    h1: { fontWeight: 800, letterSpacing: "-0.02em" },
    h2: { fontWeight: 800, letterSpacing: "-0.01em" },
    h3: { fontWeight: 700 },
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { borderRadius: 10, paddingInline: 20 } },
    },
    MuiCard: {
      styleOverrides: {
        root: { borderRadius: 16 },
      },
    },
  },
});

export default theme;
