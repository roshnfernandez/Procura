import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Icon from "@mui/material/Icon";
import MDTypography from "components/MDTypography";
import { Avatar, Button, Card, Grid, Menu, MenuItem } from "@mui/material";
import { AccountCircle, Logout } from "@mui/icons-material";
import { useMEMPSContext } from "context";
import colors from "assets/theme/base/colors";
import { setRole } from "context";
import { setUser } from "context";
import { setEquipment } from "context";
import { useState } from "react";

function HeaderAppBar() {
  const [controller, dispatch] = useMEMPSContext();
  const { role, user } = controller;
  const currHour = new Date().getHours();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const resetContext = () =>{
    setRole(dispatch, "LOGIN");
    setUser(dispatch,"");
    setEquipment(dispatch,"");
  }
  return (
    <AppBar
      position={"fixed"}
      color="inherit"
      sx={{
        color: "gray",
        backgroundColor: "rgba(240,242,245,0.8)",
        borderRadius: "0",
        marginTop: "0px",
        width: "84%",
        marginLeft: "195px",
        marginRight: "1px",
        borderLeftWidth: "0px",
      }}
    >
      <Card style={{ backgroundColor: "rgb(240,242,245,0.95)", borderRadius: "0px", borderLeftWidth: "0px", height: "78px" }}>
        <Toolbar>
          <Grid container spacing={18} alignItems="center" style={{ justifyContent: "space-between" }}>
            <Grid item>
              <MDTypography variant="h6" fontWeight="regular" marginLeft="-5px" marginBottom="4px" marginTop="15px">{currHour <= 13 ? "Good Morning" : currHour >= "17" ? "Good Evening" : "Good Afternoon"} <b>{role == "SUPPLIER" ? user.username : "Mr " + user.username}</b></MDTypography>
              <MDTypography style={{ fontSize: "14px" }} marginLeft="-5px" fontWeight="light">"We are all here to help one another... when we are together, we can make things happen better!"</MDTypography>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" style={{ marginTop: "10px" }}>
                <Grid item>
                  <IconButton size="medium" disableRipple onClick={(event) => setAnchorEl(event.currentTarget)}>
                    <Avatar style={{ backgroundColor: colors.buttons.main }}>{user.username.split(" ")[0].charAt(0) + user.username.split(" ")[1].charAt(0)}</Avatar>
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={menuOpen}
                    onClose={() => { setAnchorEl(null) }}
                    style={{ width: "150px" }}
                  >
                      <MenuItem style={{ height: "30px", marginLeft: "-25px", width: "100px" }}>
                        <Button size="medium" onClick={() => { setAnchorEl(null); resetContext(); }} startIcon={<Logout fontSize="large"/>} style={{ color: colors.buttons.main }} disableRipple>Log Out</Button>
                      </MenuItem>
                  </Menu>
                </Grid>
                <Grid item>
                  <MDTypography style={{ fontSize: "14px", fontWeight: "500" }}>{user.username}</MDTypography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </Card>
    </AppBar>
  );
}

export default HeaderAppBar;
