
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";
import boxShadows from "assets/theme/base/boxShadows";

import pxToRem from "assets/theme/functions/pxToRem";

const { grey, white } = colors;
const { borderRadius } = borders;
const { tabsBoxShadow } = boxShadows;

const tabs = {
  styleOverrides: {
    root: {
      position: "relative",
      backgroundColor: "transparent",
      borderRadius: "0px",
      minHeight: "unset",
      padding: pxToRem(4),
    },

    flexContainer: {
      height: "100%",
      position: "relative",
      zIndex: 10,
    },
    indicator: {
      height: "100%",
      borderRadius: "0px",
      backgroundColor: white.main,
      boxShadow: "none",
      transition: "all 500ms ease",
    },
  },
};

export default tabs;
