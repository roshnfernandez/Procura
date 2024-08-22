import { Box, Button, Card, CardMedia, Divider, Grid, IconButton, Menu, MenuItem, Tab, Tabs, Tooltip, withStyles } from "@mui/material";
import axios from "axios";
import MDTypography from "components/MDTypography";
import HeaderAppBar from "memps_components/HeaderBar/HeaderAppBar";
import { providerDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AddCircleOutline, ArrowBack, ArrowBackIos, ArrowDropDownCircle, Edit, EditCalendar, ReceiptLong } from "@mui/icons-material";
import { PopupForm } from "memps_components/Popup/popupForm";
import Background from "assets/images/providerImages/policySummaryBackground.png"
import { ProviderDetails } from "memps_components/ProviderComponents/providerDetails";
import { styled } from "@material-ui/styles";
import InnerTable from "memps_components/DynamicTables/innerTable";
import { EquipmentDetails } from "memps_components/EquipmentComponents/equipmentDetails";
import { maintenanceDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import { ConfirmMaintenanceForm } from "./ConfirmMaintenanceForm";
import Container from "memps_components/ContentContainers/Container";
import colors from "assets/theme/base/colors";
import { useMEMPSContext } from "context";


function TabPanel({ children, value, index }) {
    return (
        <React.Fragment
            hidden={value != index}
        >
            {value == index && children}
        </React.Fragment>
    );
}

const marginLeft = "22px";
const marginRight = "12px";
export function MaintenanceSummary() {
    const { maintenanceId } = useParams();
    const [value, setValue] = useState("1");
    const [open, setOpen] = useState(false);
    const [maintenance, setMaintenance] = useState(maintenanceDetails);
    const [maintHistory, setMaintHistory] = useState([])
    const [val, setVal] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [controller, dispatch] = useMEMPSContext();
    const { role } = controller;

    const getMaintenance = async () => {
        await axios.get("http://localhost:1071/trintel/maintenance/" + maintenanceId).then((response) => { console.log(response.data); setMaintenance(response.data); getAllMaintenance(response.data.equipment.equipmentId);  });
    }
    const getAllMaintenance = async (id)=>{
        await axios.get("http://localhost:1072/trintel/maintenance/equipment/" + id).then((response)=>{
            setMaintHistory(response.data.filter((maint)=>maint.id < maintenance.id).sort((ml,mr)=>mr.id.match("[0-9]{4}$")[0] - ml.id.match("[0-9]{4}$")[0]));
        });
    }
    useEffect(
        () => { getMaintenance();},
        [val]
    )
    const changeDialogState = (val) => {
        setOpen(val);
    }
    const initiateRender = () => {
        setVal(val + 1);
        console.log(val);
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Container>
            <HeaderAppBar />
            <CardMedia image={Background} style={{ height: "150px", marginTop: "100px", width: "102%", marginLeft: "-5px" }}>
                <Card style={{ height: "150px", backgroundColor: colors.imageOverlay, borderRadius: "10px", paddingLeft: "10px", paddingRight: "10px", paddingTop: "20px" }}>
                    <Grid container style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} spacing={4}>
                        <Grid item xs={0.4}>
                            <Tooltip title="Click to go back">
                                <Link to="/maintenance">
                                    <IconButton style={{ color: "white" }} size="small">
                                        <ArrowBack fontSize="small"></ArrowBack>
                                    </IconButton>
                                </Link>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={10.1}>
                            <MDTypography variant="h4" style={{ color: "white" }}>Maintenance - {"#" + maintenance.id}</MDTypography>
                        </Grid>
                        <Grid item xs={1.5}>
                            <div style={{ display: role == "SUPPLIER" ? "inherit" : "none" }}>
                                <Button variant="contained" size="small" style={{ color: "white" }} onClick={(event) => setAnchorEl(event.currentTarget)} startIcon={<ArrowDropDownCircle fontSize="large"></ArrowDropDownCircle>}>
                                    Actions
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    onClose={() => { setAnchorEl(null) }}
                                    style={{ width: "180px" }}
                                >
                                    <Tooltip title={maintenance.status != "INITIATED" && "Maintenance has already been " + maintenance.status.toLowerCase()} placement="left">
                                    <MenuItem style={{ height: "30px", marginLeft: "-25px", }}>
                                        <Button onClick={() => { changeDialogState(true), setAnchorEl(null) }} size="medium" startIcon={<EditCalendar fontSize="large"></EditCalendar>} style={{ color: colors.buttons.main }} disabled={maintenance.status != "INITIATED"}>Schedule</Button>
                                    </MenuItem>
                                    </Tooltip>
                                </Menu>
                                <PopupForm open={open} onClose={() => changeDialogState(false)} givenKey={1}>
                                    <ConfirmMaintenanceForm onClick={() => changeDialogState(false)} currentMaintenance={maintenance} initiateRender={() => initiateRender()}></ConfirmMaintenanceForm>
                                </PopupForm>
                            </div>
                        </Grid>
                    </Grid>
                </Card>
            </CardMedia>
            <Card style={{ marginLeft: marginLeft, marginTop: "-50px", padding: "10px", marginRight: marginRight }}>
                <Card style={{
                    backgroundColor: "#f7fafc",
                    marginLeft: "-10px",
                    padding: "10px",
                    borderBottomRightRadius: "0px",
                    borderBottomLeftRadius: "0px",
                    marginRight: "-10px",
                    marginTop: "-10px",
                    marginBottom: "10px",
                    boxShadow: "none"
                }}>
                    <Grid container style={{ display: "flex", alignItems: "center" }}>
                        <Grid item xs={2.4}><MDTypography variant="h5">Maintenance Details</MDTypography></Grid>
                        <Grid item xs={9.6}><hr style={{ color: "#344767" }}></hr></Grid>
                    </Grid>
                </Card>
                <Grid container style={{ padding: "10px" }}>
                    <Grid item xs={6}>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Equipment:</MDTypography></Grid>
                            <Grid item xs={7}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{maintenance.equipment.equipmentId}</MDTypography></Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Scheduled Start Date:</MDTypography></Grid>
                            <Grid item xs={7}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{maintenance.scheduledStartDate ? new Date(maintenance.scheduledStartDate).toLocaleDateString() + " (" +new Date(maintenance.scheduledStartDate).toLocaleTimeString()+")" : "-"}</MDTypography></Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Service Start Date:</MDTypography></Grid>
                            <Grid item xs={7}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{maintenance.serviceStartDate ? new Date(maintenance.serviceStartDate).toLocaleDateString()  + " (" +new Date(maintenance.serviceStartDate).toLocaleTimeString()+")" : "-"}</MDTypography></Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Service Completion Date:</MDTypography></Grid>
                            <Grid item xs={7}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{maintenance.serviceCompletionDate ? new Date(maintenance.serviceCompletionDate).toLocaleDateString() +  " (" +new Date(maintenance.serviceCompletionDate).toLocaleTimeString()+")": "-"}</MDTypography></Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Status:</MDTypography></Grid>
                            <Grid item xs={7}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{maintenance.status ? maintenance.status.charAt(0) + maintenance.status.substr(1).toLowerCase() : "-"}</MDTypography></Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Supplier Name:</MDTypography></Grid>
                            <Grid item xs={8}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{maintenance.equipment.providers.providerName}</MDTypography></Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Technician Name:</MDTypography></Grid>
                            <Grid item xs={8}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{maintenance.technicianName || "-"}</MDTypography></Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Technician Email:</MDTypography></Grid>
                            <Grid item xs={8}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{maintenance.technicianEmail || "-"}</MDTypography></Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Comments:</MDTypography></Grid>
                            <Grid item xs={8}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{maintenance.technicianComments || "-"}</MDTypography></Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Card>
            <Card style={{ marginLeft: marginLeft, marginTop: "10px", padding: "0px", marginBottom: "10px", backgroundColor: "transparent", boxShadow: "none", marginRight: marginRight }}>
                <Tabs value={value} onChange={handleChange} sx={{ borderRadius: "0px", backgroundColor: "white", width: "500px" }} TabIndicatorProps={{
                    style: {
                        backgroundColor: "transparent",
                        borderRadius: "0px",
                        borderBottom: "2px solid #00203f",
                        boxShadow: "none",
                    }
                }} variant="fullWidth">
                    <Tab label="Equipment" value="1" />
                    {role=="HOSPITAL" && <Tab label="Supplier" value="2" />}
                    <Tab label="Previous Maintenance" value="3" />
                </Tabs>
            </Card>
            <Card style={{ marginLeft: marginLeft, marginRight: marginRight }}>
                <TabPanel value={value} index={"1"}>
                    <EquipmentDetails equipment={maintenance.equipment}></EquipmentDetails>
                </TabPanel>
                <TabPanel value={value} index={"2"}>
                    <ProviderDetails provider={maintenance.equipment.providers}></ProviderDetails>
                </TabPanel>
                <TabPanel value={value} index={"3"}>
                    <Card style={{ backgroundColor: "#f7fafc", padding: "10px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px", marginBottom: "10px", boxShadow: "none" }}>
                        <Grid container style={{ display: "flex", alignItems: "center" }}>
                            <Grid item xs={2.6}><MDTypography variant="h5">Previous Maintenance</MDTypography></Grid>
                            <Grid item xs={9.4}><hr style={{ color: "#344767" }}></hr></Grid>
                        </Grid>
                    </Card>
                    <Card id="card2" style={{ padding: "20px", borderRadius: "0px", boxShadow: "none" }}>
                        <InnerTable
                            values={maintHistory}
                            headers={["ID", "Started On", "Completed On", "Technician"]}
                            attrib={["id", "serviceStartDate", "serviceCompletionDate", "technicianName"]}
                        >
                        </InnerTable>
                    </Card>
                </TabPanel>
            </Card>
        </Container>
    )
}