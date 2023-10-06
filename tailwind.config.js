import colors from "tailwindcss/colors";

export const theme = {
  colors: {
    ...colors,
    blueZodiac: {
      DEFAULT: "#102542",
      50: "#61B5D9",
      100: "#53ACD5",
      200: "#3697CE",
      300: "#2C7DB5",
      400: "#256498",
      500: "#1E4D7B",
      600: "#17385F",
      700: "#102542",
      800: "#070F1D",
    },
    carnation: {
      DEFAULT: "#F87060",
      50: "#FFFFFF",
      100: "#FFFFFF",
      200: "#FFFDFC",
      300: "#FDD9D5",
      400: "#FBB6AE",
      500: "#FA9387",
      600: "#F87060",
      700: "#F6402A",
      800: "#DE200A",
      900: "#A81807",
      950: "#8D1406",
    },
  },
  extend: {
    colors: {
      link: "#eee",
    },
  },
};
export const variants = {
  extend: {},
};
export const plugins = [];
