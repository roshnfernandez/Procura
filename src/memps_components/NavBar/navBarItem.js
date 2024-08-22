import PropTypes from "prop-types";

import ListItem from "@mui/material/ListItem";
import Icon from "@mui/material/Icon";

import { collapseItem,collapseIcon } from "./navBarItemStyle";
import { Card, Grid } from "@mui/material";


function NavBarItem({ icon, name, active, ...rest }) {
  const sidenavColor = "info";

  return (
    <ListItem component="li">
      <Card
        {...rest}
        sx={
          ()=>collapseItem(active)
        }
      >
      <Grid container style={{display: "flex", alignItems: "center"}}>
        <Grid item style={{paddingLeft: "10px"}}>
          {typeof icon === "string" ? (
            <Icon sx={(theme) => collapseIcon(active)}>{icon}</Icon>
          ) : (
            icon
          )}
        </Grid>
        <Grid item style={{paddingRight: "10px", marginTop: "-8px"}}>
          <span style={{
            marginLeft: "15px", 
            fontWeight: active ? 700 : 400,
            fontSize: "14px",
          }}>
            {name}
          </span>
        </Grid>
      </Grid>
      </Card>
    </ListItem>
  );
}

NavBarItem.defaultProps = {
  active: false,
};

NavBarItem.propTypes = {
  icon: PropTypes.node.isRequired,
  name: PropTypes.string.isRequired,
  active: PropTypes.bool,
};

export default NavBarItem;
