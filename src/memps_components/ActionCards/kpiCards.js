import { Card, Grid } from "@mui/material"
import MDTypography from "components/MDTypography"

export const KPICard = ({title,value,children,secValue, inSummary})=>{
    return(
        <Card style={{width: inSummary ? "100%":"105%", padding: inSummary ? "8px":"20px", paddingTop: inSummary ? "5px":"10px",marginBottom: inSummary ? "0px":"15px", pointerEvents:"none", boxShadow: inSummary&&"none"}}>
            <MDTypography variant="h6" style={{ fontSize: inSummary ? "13px":"15px" }} fontWeight="regular">{title}</MDTypography>
            <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginTop: inSummary && "-2px"}}>
                {children}
                <MDTypography variant="h6" style={{ fontSize: inSummary ? "26px": "35px" }} fontWeight="regular">{value}<span style={{fontSize: inSummary ? "13px":"15px"}}>{secValue}</span></MDTypography>
            </div>
        </Card>
    )
}