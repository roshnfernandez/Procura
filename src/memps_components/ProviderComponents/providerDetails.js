import { Card, Grid } from "@mui/material";
import MDTypography from "components/MDTypography";
import React from "react";

export function ProviderDetails({ provider, insideProviderSummary }) {
    return (
        <React.Fragment>
            <Card style={{ 
                backgroundColor: "#f7fafc",
                marginLeft: insideProviderSummary&&"-10px", 
                padding: "10px", 
                boxShadow:"none",
                borderBottomRightRadius: "0px", 
                borderBottomLeftRadius: "0px", 
                marginRight: insideProviderSummary&&"-10px", 
                marginTop: insideProviderSummary&&"-10px", 
                marginBottom:"10px" }}>
                <Grid container style={{ display: "flex", alignItems: "center" }}>
                    <Grid item xs={1.8}><MDTypography variant="h5">Supplier Details</MDTypography></Grid>
                    <Grid item xs={10.2}><hr style={{ color: "#344767" }}></hr></Grid>
                </Grid>
            </Card>
            <Grid container style={{ padding: "10px", marginLeft: (!insideProviderSummary)&&"10px" }}>
                <Grid item xs={6}>
                    <Grid container style={{ marginBottom: "3px" }}>
                        <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Name:</MDTypography></Grid>
                        <Grid item xs={8}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{provider.providerName}</MDTypography></Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: "3px" }}>
                        <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Email:</MDTypography></Grid>
                        <Grid item xs={8}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{provider.users.email}</MDTypography></Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: "3px" }}>
                        <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Phone:</MDTypography></Grid>
                        <Grid item xs={8}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{provider.users.phone}</MDTypography></Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: "3px" }}>
                        <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>User ID:</MDTypography></Grid>
                        <Grid item xs={8}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{provider.users.userId}</MDTypography></Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: "3px" }}>
                        <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Postal Code:</MDTypography></Grid>
                        <Grid item xs={8}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{provider.providerAddress.split("@#$")[3]}</MDTypography></Grid>
                    </Grid>
                </Grid>
                <Grid item xs={6}>
                    <Grid container style={{ marginBottom: "3px" }}>
                        <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Street Address:</MDTypography></Grid>
                        <Grid item xs={8}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{provider.providerAddress.split("@#$")[0]}</MDTypography></Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: "3px" }}>
                        <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>City:</MDTypography></Grid>
                        <Grid item xs={8}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{provider.providerAddress.split("@#$")[1]}</MDTypography></Grid>
                    </Grid>
                    <Grid container style={{ marginBottom: "3px" }}>
                        <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>State:</MDTypography></Grid>
                        <Grid item xs={8}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{provider.providerAddress.split("@#$")[2]}</MDTypography></Grid>
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}