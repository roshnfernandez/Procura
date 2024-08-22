import typography from "assets/theme/base/typography";
import colors from "assets/theme/base/colors";
import pxToRem from "assets/theme/functions/pxToRem";
import rgba from "assets/theme/functions/rgba";

const { size, fontWeightRegular } = typography;
const { white } = colors;

const stepLabel = {
  styleOverrides: {
    label: {
      fontWeight: "500",
      fontSize: "15px",
      color: colors.buttons.main,

      "&.Mui-active": {
        fontWeight: "500",
        fontSize: "15px",
        color: colors.buttons.main,
      },

      "&.Mui-completed": {
        fontWeight: "500",
        fontSize: "15px",
        color: colors.buttons.main,
      },
    },
  },
};

export default stepLabel;
