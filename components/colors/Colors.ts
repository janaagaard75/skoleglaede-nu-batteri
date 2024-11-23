import twColors from "tailwindcss/colors";

const tintColorDark = "#fff";
const tintColorLight = "#0a7ea4";

export const Colors = {
  dark: {
    background: twColors.zinc[900],
    disabledText: twColors.zinc[500],
    green: twColors.green[600],
    orange: twColors.amber[500],
    red: twColors.red[600],
    text: twColors.zinc[200],
    tint: tintColorDark,
    unselected: twColors.zinc[600],
  },
  light: {
    background: twColors.zinc[100],
    disabledText: twColors.zinc[400],
    green: twColors.green[600],
    orange: twColors.amber[500],
    red: twColors.red[600],
    text: twColors.zinc[800],
    tint: tintColorLight,
    unselected: twColors.zinc[400],
  },
};
