import { CheckCircle, CheckCircleRounded } from "@mui/icons-material";
import { Button, Card } from "@mui/material";
import colors from "assets/theme/base/colors";
import MDTypography from "components/MDTypography";
import React from "react";
import { Link } from "react-router-dom";

export function ActionSuccessfulScreen({onClick, record, pk, summaryURL, width}){
    return(
        <React.Fragment>
        <Card style={{backgroundColor: colors.buttons.main, padding: "40px", alignItems:"center", borderBottomLeftRadius:"0px", borderBottomRightRadius:"0px", paddingBottom:"10px"}}>
            <div style={{fontSize:"120px", color:"white"}}>
                <CheckCircleRounded fontSize="inherit"/>
            </div>
            <MDTypography variant = "h5" fontWeight="regular" style={{color: "white", marginTop:"-50px", fontSize:"16px", marginBottom:"5px"}}>Hurray!!!</MDTypography>
            <MDTypography variant = "h5" fontWeight="regular" style={{color: "white", fontSize:"15px"}}>Your {record} ({pk}) has been created successfully.</MDTypography>
        </Card>
        <Card style={{backgroundColor:"white", height:"200px", alignItems:"center", padding:"20px"}}>
            <Link to={summaryURL + pk}>
                <Button size="large" variant="contained" style={{backgroundColor: colors.buttons.main, color: "white", width : "300px", marginTop:"20px"}}>Go to {record} - {pk}</Button>
            </Link>
            <Button size="large" variant="contained" color="secondary" style={{color: "white", width : "300px", marginTop:"20px"}} onClick={onClick}>Close</Button>
        </Card>
        </React.Fragment>
    )
}