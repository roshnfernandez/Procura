import borders from "assets/theme/base/borders";

const { borderRadius } = borders;

const avatar = {
  styleOverrides: {
    rounded: {
      borderRadius: borderRadius.lg,
    },

    img: {
      height: "auto",
    },
  },
};

export default avatar;
