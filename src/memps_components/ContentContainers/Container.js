import { Box } from "@mui/material";
import PropTypes from "prop-types";

export default function Container({ children, overFlowY }) {

  return (
    <Box
      sx={{
        marginTop: "88px",
        marginLeft: "17%",
        width: "81%",
        overFlowY: {overFlowY}
      }}
    >
      {children}
    </Box>
  );
}
Container.propTypes = {
  children: PropTypes.node.isRequired,
};
