import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Sidenav from "memps_components/NavBar/sideNavBar";
import theme from "assets/theme";
import routes from "routes";

import procuraLogo from "assets/images/ProcuraLogo.png"
import { useMEMPSContext } from "context";

export default function App() {
  const [controller, dispatch] = useMEMPSContext();
  const {role} = controller;
  const { pathname } = useLocation();

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.filter((route)=>route.role.includes(role)).map((route) => {

      if (route.route) {
        return <Route exact path={route.route} element={route.component} key={route.key} />;
      }

      return null;
    });

  return(
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {(
        <>
        {
          role=="LOGIN"||role=="GUEST"?"":          
          <Sidenav
          color="info"
          brand={procuraLogo}
          brandName="Sun Life"
          routes={routes.filter((route)=>route.role.includes(role) && route.type == "navitem")}
        />
        }
        </>
      )}
      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to={role=="LOGIN"?"/login": role=="ADMINISTRATOR"?"/user": role=="GUEST"?"/guest":role=="USER"?"/logs" : role=="SUPPLIER"?"/orders":"/equipment"} />} />
      </Routes>
    </ThemeProvider>
  );
}
