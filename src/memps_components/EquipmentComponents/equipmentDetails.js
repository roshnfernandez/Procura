import { Card, Grid } from "@mui/material";
import MDTypography from "components/MDTypography";
import React from "react";

export function EquipmentDetails({equipment, insideEquipmentSummary}){
    return(
        <React.Fragment>
            <Card style={{ 
                backgroundColor: "#f7fafc", 
                marginLeft: insideEquipmentSummary&&"-10px", 
                padding: "10px", 
                borderBottomRightRadius: "0px", 
                borderBottomLeftRadius: "0px", 
                boxShadow:"none",
                marginRight: insideEquipmentSummary&&"-10px", 
                marginTop: insideEquipmentSummary&&"-10px",
                marginBottom: "10px" }}>
                        <Grid container style={{ display: "flex", alignItems: "center" }}>
                            <Grid item xs={insideEquipmentSummary?2.8 :2.1}><MDTypography variant="h5">Equipment Details</MDTypography></Grid>
                            <Grid item xs={insideEquipmentSummary?9.2 :9.9}><hr style={{ color: "#344767" }}></hr></Grid>
                        </Grid>
                    </Card>
                    <Grid container style={{ padding: "10px", marginLeft: (!insideEquipmentSummary)&&"10px" }}>
                        <Grid item xs={6}>
                            <Grid container style={{ marginBottom: "3px" }}>
                                <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Product Name:</MDTypography></Grid>
                                <Grid item xs={7}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{equipment.catalog.productName}</MDTypography></Grid>
                            </Grid>
                            <Grid container style={{ marginBottom: "3px" }}>
                                <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Manufacturer:</MDTypography></Grid>
                                <Grid item xs={7}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{equipment.catalog.manufacturerName}</MDTypography></Grid>
                            </Grid>
                            <Grid container style={{ marginBottom: "3px" }}>
                                <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Manufactured On:</MDTypography></Grid>
                                <Grid item xs={7}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{new Date(equipment.manufacturedOn).toLocaleDateString()}</MDTypography></Grid>
                            </Grid>
                            <Grid container style={{ marginBottom: "3px" }}>
                                <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Purchased On:</MDTypography></Grid>
                                <Grid item xs={7}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{new Date(equipment.purchasedOn).toLocaleDateString()}</MDTypography></Grid>
                            </Grid>
                            <Grid container style={{ marginBottom: "3px" }}>
                                <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Supplier:</MDTypography></Grid>
                                <Grid item xs={7}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{equipment.providers.providerName + " (" +equipment.providers.providerId+")"}</MDTypography></Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6}>
                            <Grid container style={{ marginBottom: "3px" }}>
                                <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Equipment Cost:</MDTypography></Grid>
                                <Grid item xs={6}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{equipment.cost}</MDTypography></Grid>
                            </Grid>
                            <Grid container style={{ marginBottom: "3px" }}>
                                <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Equipment Status:</MDTypography></Grid>
                                <Grid item xs={6}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{equipment.status}</MDTypography></Grid>
                            </Grid>
                            <Grid container style={{ marginBottom: "3px" }}>
                                <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Service Duration in Days:</MDTypography></Grid>
                                <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{equipment.serviceDurationInDays}</MDTypography></Grid>
                            </Grid>
                            <Grid container style={{ marginBottom: "3px" }}>
                                <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Service Duration in Hours:</MDTypography></Grid>
                                <Grid item xs={6}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{equipment.serviceDurationInHoursUsed}</MDTypography></Grid>
                            </Grid>
                        </Grid>
                    </Grid>
        </React.Fragment>
    )
}