import { Close } from "@mui/icons-material";
import { Grid, IconButton, Snackbar } from "@mui/material";
import colors from "assets/theme/base/colors";
import MDTypography from "components/MDTypography";

export function SuccessAlert({open,onClose}) {
    return (
        <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
        >
            <div style={{ alignSelf: "center", backgroundColor: "#388e3c", padding: "6px", borderRadius: "4px", width: "280px", paddingLeft: "16px" }}>
                <Grid container style={{ display: "flex", alignItems: "center" }}>
                    <Grid item xs={10.5}>
                        <MDTypography variant="h6" style={{ fontSize: "15px", color: colors.white.main }}>
                            Action completed successfully!!!
                        </MDTypography>
                    </Grid>
                    <Grid item xs={1.5}>
                        <IconButton size="small" onClick={onClose} style={{ color: colors.white.main, marginLeft: "-3px", marginTop: "-2px" }}><Close fontSize="small" /></IconButton>
                    </Grid>
                </Grid>
            </div>
        </Snackbar>
    )
}