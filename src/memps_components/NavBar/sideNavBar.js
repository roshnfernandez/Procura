import { useEffect } from "react";

import { useLocation, NavLink } from "react-router-dom";

import PropTypes from "prop-types";

import List from "@mui/material/List";
import Divider from "@mui/material/Divider";

import {NavbarContainer} from "memps_components/NavBar/navBarContainer";

import  NavBarItem  from "memps_components/NavBar/navBarItem";
import { Box } from "@mui/material";

function Sidenav({brand, brandName, routes, ...rest }) {
  const location = useLocation();
  const navitemName = location.pathname.replace("/", "");

  let textColor = "white";

  const renderRoutes = routes.map(({ name, icon, key, route }) => {
    return(
      <NavLink key={key} to={route}>
      <NavBarItem name={name} icon={icon} active={navitemName.includes(key)} />
    </NavLink>
    )
  });

  return (
    <NavbarContainer
      {...rest}
      variant="permanent"
    >
      <Box pt={2.7} pb={-3} px={4} textAlign="center">
        <Box component={NavLink} to="/" display="flex" alignItems="center">
        <Box component="img" src={brand} alt="Brand" width="100%" />
        </Box>
      </Box>
      <Divider
        light={true}
      />
      <List>{renderRoutes}</List>
    </NavbarContainer>
  );
}

Sidenav.defaultProps = {
  brand: "",
};

Sidenav.propTypes = {
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
