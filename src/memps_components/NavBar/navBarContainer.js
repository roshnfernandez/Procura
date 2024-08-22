import Drawer from "@mui/material/Drawer";
import { styled } from "@mui/material/styles";
import colors from "assets/theme/base/colors";


//Styled is used to return a pre-defined Component with the passed custom styling
//In this case a Material UI drawer is returned with the passed styling
export  const NavbarContainer = styled(Drawer)(() => {
  const sidebarWidth = 200;
  const boxShadow = "0, 20px,27px,10px, rgba(0,0,0,0.5)";
  const drawerStyle = () => ({
    background: colors.navbarColor,//"#2A3445",
    transform: "translateX(0)",
    boxShadow: boxShadow,
    marginTop: 3,
    marginBottom: 2,
    marginLeft: 2,
    borderRadius: 4,
    left: "0",
    height: "99%",
    width: "16%",
    transform: "translateX(0)",
  });

  return {
    "& .MuiDrawer-paper": {
      boxShadow: boxShadow,
      border: "none",
      ...(drawerStyle()),
    },
  };
});
