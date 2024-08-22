import { AppBar, Avatar, Box, Button, Card, Divider, Grid, Icon, IconButton, InputAdornment, Menu, MenuItem, Popper, TextField, Toolbar, Tooltip } from "@mui/material";
import colors from "assets/theme/base/colors";
import React, { useEffect, useState } from "react";
import BrandLogo from "assets/images/ProcuraLogo.png"
import { Abc, AccountCircle, AccountCircleOutlined, AccountCircleTwoTone, AdfScanner, CancelOutlined, Checklist, Logout, StopCircleOutlined } from "@mui/icons-material";
import MDTypography from "components/MDTypography";
import { equipmentDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import { maintenanceDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import { Clock } from "memps_components/Clock/clock";
import axios from "axios";
import ViewAllTable from "memps_components/DynamicTables/table";
import { EquipmentDetails } from "memps_components/EquipmentComponents/equipmentDetails";
import NoData from "assets/images/NoDataFound.png"
import { useMEMPSContext } from "context";
import { setEquipment } from "context";
import { setUser } from "context";
import { setRole } from "context";


const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function TechnicianScreen() {
    const [controller, dispatch] = useMEMPSContext();
    const { equipment } = controller;
    const technicianMail = "steve.smith@email.com";
    const [maintenance, setMaintenance] = useState([]);
    const [currMaintenance, setCurrMaintenance] = useState(maintenanceDetails);
    const [techMaintenance, setTechMaintenance] = useState([maintenanceDetails]);
    const [prevMaintenance, setPrevMaintenance] = useState(maintenanceDetails);
    const [open, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [anchorElIcon, setAnchorElIcon] = useState(null);
    const menuOpen = Boolean(anchorElIcon);
    const handleClick = (event) => {
        setOpen(true);
        setAnchorEl(event.currentTarget);
    }
    const resetContext = () =>{
        setRole(dispatch, "LOGIN");
        setUser(dispatch,"");
        setEquipment(dispatch,"");
    }
    const startMaintenance = async () => {
        currMaintenance.serviceStartDate = new Date().getTime();
        currMaintenance.status = "STARTED";
        const equipment = currMaintenance.equipment;
        equipment.status = "UNDER_MAINTENANCE";
        await axios.post("http://localhost:1072/trintel/maintenance", currMaintenance).then((response) => { setCurrMaintenance(response.data);getMaintenanceDetails() })
        await axios.post("http://localhost:1072/trintel/equipment", equipment).then((response) => { })
    }
    const endMaintenance = async () => {
        currMaintenance.serviceCompletionDate = new Date().getTime();
        currMaintenance.status = "COMPLETED";
        const equipment = currMaintenance.equipment;
        equipment.status = "FUNCTIONAL";
        setOpen(false);
        await axios.post("http://localhost:1072/trintel/maintenance", currMaintenance).then((response) => { setPrevMaintenance(response.data); ;getCurrentMaintenance(); getMaintenanceDetails() })
        await axios.post("http://localhost:1072/trintel/equipment", equipment).then((response) => { })
    }
    const getCurrentMaintenance = async () => {
        await axios.get("http://localhost:1072/trintel/maintenance/equipment/active/" + equipment).then((response) => { setCurrMaintenance(response.data); })
    }
    const getMaintenanceDetails = async () => {
        await axios.get("http://localhost:1072/trintel/maintenance/equipment/" + equipment).then((response) => {
            setMaintenance(response.data);
            console.log(response.data);
            setPrevMaintenance(response.data.filter((maintenance) => maintenance.status == "COMPLETED").sort(
                (maintR, maintL) => parseFloat(maintL.id.substr(4)) - parseFloat(maintR.id.substr(4))
            )[0] || maintenanceDetails);
        })
    }
    const getTechMaintenanceDetails = async () => {
        await axios.get("http://localhost:1072/trintel/maintenance/tech/" + technicianMail).then((response) => { setTechMaintenance(response.data); })
    }
    useEffect(() => { getCurrentMaintenance(); getMaintenanceDetails(); getTechMaintenanceDetails(); }, []);

    const getContent = (maintenance) => {
        return (
            <React.Fragment>
                Hi there
            </React.Fragment>
        )
    }
    return (
        <React.Fragment>
            <AppBar
                position={"fixed"}
                color="inherit"
                sx={{
                    backgroundColor: colors.navbarColor,
                    borderRadius: "0",
                    marginTop: "0px",
                    width: "100%",
                    height: "65px"
                }}
            >
                <Card style={{ backgroundColor: colors.navbarColor, borderRadius: "0px", borderLeftWidth: "0px", height: "65px" }}>
                    <Toolbar>
                        <Grid container style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <Grid item xs={9.5}>
                                <img src={BrandLogo} style={{ height: "40px" }}></img>
                            </Grid>
                            <Grid item xs={2.5}>
                                <Grid container style={{ display: "flex", alignItems: "center", fontSize: "32px", marginLeft: "40%" }}>
                                    <Grid item>
                                        <IconButton size="medium" disableRipple onClick={(event) => setAnchorElIcon(event.currentTarget)}>
                                            <Avatar style={{ backgroundColor: colors.buttons.main }}>{"GU"}</Avatar>
                                        </IconButton>
                                        <Menu
                                            id="basic-menu"
                                            anchorEl={anchorElIcon}
                                            open={menuOpen}
                                            onClose={() => { setAnchorElIcon(null) }}
                                            style={{ width: "150px" }}
                                        >
                                            <MenuItem style={{ height: "30px", marginLeft: "-25px", width: "100px" }}>
                                                <Button size="medium" onClick={() => { setAnchorElIcon(null); resetContext(); }} startIcon={<Logout fontSize="large" />} style={{ color: colors.buttons.main }} disableRipple>Log Out</Button>
                                            </MenuItem>
                                        </Menu>

                                    </Grid>
                                    <Grid item>
                                        <MDTypography style={{ fontSize: "14px", fontWeight: "500", color: "white" }}>&nbsp; Guest User</MDTypography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Toolbar>
                </Card>
            </AppBar>
            <div style={{ marginTop: "80px", marginLeft: "1%", marginRight: "1%" }}>
                <Grid container spacing={2}>
                    <Grid item xs={5}>
                        <Card style={{ padding: "21.5px" }}>
                            <MDTypography variant="h1" fontWeight="light">{new Date().getDate()}</MDTypography>
                            <br></br>
                            <MDTypography variant="h5" fontWeight="light" style={{ marginBottom: "20px" }}>{weekday[new Date().getDay()]}</MDTypography>
                            <br></br>
                            <br></br>
                            <hr style={{ color: colors.applicationPrimary, backgroundColor: colors.applicationPrimary, width: "180px", height: "3px", border: "0px", borderRadius: "8px" }}></hr>
                            <MDTypography variant="h6" fontWeight="regular" style={{ marginTop: "15px", fontSize: "15px", marginBottom: "8px" }}>{new Date().toLocaleString('default', { month: 'long' }) + " " + new Date().getFullYear()}</MDTypography>
                            <Clock></Clock>
                            <Divider></Divider>
                            {
                                currMaintenance.id ?
                                    <div>
                                        <Button size="small" style={{ color: "white", backgroundColor: colors.buttons.main, alignSelf: "end" }} onClick={currMaintenance.status == "SCHEDULED" ? startMaintenance : handleClick}>{currMaintenance.status == "STARTED" ? "End Maintenance" : "Start Maintenance"}</Button>
                                        <Popper
                                            id={open ? "simple-popper" : undefined} open={open} anchorEl={anchorEl}
                                            placement="right"
                                        >
                                            <Card style={{ width: "300px", border: `2px solid ${colors.buttons.main}`, padding: "15px" }}>
                                                <TextField
                                                    label="Equipment ID"
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Equipment ID"
                                                    value={currMaintenance ? currMaintenance.equipment.equipmentId : ""}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <AdfScanner fontSize="medium" />
                                                            </InputAdornment>
                                                        ),
                                                        readOnly: true
                                                    }}
                                                    style={{ marginTop: "10px", marginBottom: "15px" }}
                                                />
                                                <TextField
                                                    label="Equipment Name"
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Equipment Name"
                                                    value={prevMaintenance.equipment.catalog.productName}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Abc fontSize="medium" />
                                                            </InputAdornment>
                                                        ),
                                                        readOnly: true
                                                    }}
                                                    style={{ marginBottom: "15px" }}
                                                />
                                                <TextField
                                                    label="Comments"
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Please Enter your comment here"
                                                    multiline
                                                    minRows={4}
                                                    value={currMaintenance.technicianComments}
                                                    onChange={(event) => {
                                                        const { name, value } = event.target;
                                                        const currMaintCopy = currMaintenance;
                                                        currMaintCopy.technicianComments = value;
                                                        setCurrMaintenance(currMaintCopy);
                                                    }}
                                                    required
                                                />
                                                <Grid container spacing={6.6}>
                                                    <Grid item xs={7}>
                                                    </Grid>
                                                    <Grid item xs={5}>
                                                        <Tooltip title="Cick to close">
                                                            <IconButton onClick={() => setOpen(false)} size="medium" style={{ alignSelf: "end", color: colors.error.main, marginTop: "10px" }}>
                                                                <CancelOutlined />
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip title="Cick to complete the maintenance">
                                                            <IconButton onClick={endMaintenance} size="medium" style={{ alignSelf: "end", color: colors.buttons.main, marginTop: "10px" }}>
                                                                <Checklist />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid>
                                                </Grid>
                                            </Card>
                                        </Popper>
                                        <Grid container style={{ marginBottom: "5px", marginTop: "15px" }}>
                                            <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Maintenance Scheduled For:</MDTypography></Grid>
                                            <Grid item xs={6}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{currMaintenance.scheduledStartDate ? new Date(currMaintenance.scheduledStartDate).toDateString() : "-"}</MDTypography></Grid>
                                        </Grid>
                                        <Grid container style={{ marginBottom: "5px" }}>
                                            <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Maintenance Started On:</MDTypography></Grid>
                                            <Grid item xs={6}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{currMaintenance.serviceStartDate ? new Date(currMaintenance.serviceStartDate).toLocaleDateString() + " (" + new Date(currMaintenance.serviceStartDate).toLocaleTimeString() + ")" : "-"}</MDTypography></Grid>
                                        </Grid>
                                        <Grid container style={{ marginBottom: "5px" }}>
                                            <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Maintenance Completed On:</MDTypography></Grid>
                                            <Grid item xs={6}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{currMaintenance.serviceCompletionDate ? new Date(currMaintenance.serviceCompletionDate).toLocaleDateString() + " (" + new Date(currMaintenance.serviceCompletionDate).toLocaleTimeString() + ")" : "-"}</MDTypography></Grid>
                                        </Grid>
                                    </div> :
                                    <div style={{ display: "flex", alignItems: "center", pointerEvents: "none" }}>
                                        <img src={NoData} style={{ height: "135px", width: "150px" }}></img>
                                        <MDTypography variant="h5" fontWeight="regular" style={{ color: colors.grey["500"] }}>Ouch!!! No Active Maintenance Found.</MDTypography>
                                    </div>
                            }
                        </Card>
                    </Grid>
                    <Grid item xs={7}>
                        <Card style={{ padding: "15px", width: "100%" }}>
                            <MDTypography variant="h5">Equipment Details</MDTypography>
                            <Grid container style={{ marginTop: "11px", padding: "5px" }}>
                                <Grid item xs={6}>
                                    <Grid container style={{ marginBottom: "5px" }}>
                                        <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Product Name:</MDTypography></Grid>
                                        <Grid item xs={6}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{prevMaintenance.equipment.catalog.productName}</MDTypography></Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: "5px" }}>
                                        <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Manufacturer:</MDTypography></Grid>
                                        <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{prevMaintenance.equipment.catalog.manufacturerName}</MDTypography></Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: "5px" }}>
                                        <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Equipment Status:</MDTypography></Grid>
                                        <Grid item xs={6}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{prevMaintenance.equipment.status}</MDTypography></Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: "5px" }}>
                                        <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Manufactured On:</MDTypography></Grid>
                                        <Grid item xs={6}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{new Date(prevMaintenance.equipment.manufacturedOn).toLocaleDateString()}</MDTypography></Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Purchased On:</MDTypography></Grid>
                                        <Grid item xs={6}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{new Date(prevMaintenance.equipment.purchasedOn).toLocaleDateString()}</MDTypography></Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container style={{ marginBottom: "5px" }}>
                                        <Grid item xs={7}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Service Duration in Days:</MDTypography></Grid>
                                        <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{prevMaintenance.equipment.serviceDurationInDays}</MDTypography></Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: "5px" }}>
                                        <Grid item xs={7}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Service Duration in Hours:</MDTypography></Grid>
                                        <Grid item xs={5}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{prevMaintenance.equipment.serviceDurationInHoursUsed}</MDTypography></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Card>
                        <Card style={{ padding: "15px", width: "100%", marginTop: "15px" }}>
                            <MDTypography variant="h5">Previous Maintenance Overview</MDTypography>
                            <Grid container style={{ marginTop: "11px", padding: "5px" }}>
                                <Grid item xs={6}>
                                    <Grid container style={{ marginBottom: "5px" }}>
                                        <Grid item xs={7}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Scheduled Start Date:</MDTypography></Grid>
                                        <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{prevMaintenance.scheduledStartDate ? new Date(prevMaintenance.scheduledStartDate).toLocaleDateString() : "-"}</MDTypography></Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: "5px" }}>
                                        <Grid item xs={7}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Service Start Date:</MDTypography></Grid>
                                        <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{prevMaintenance.serviceStartDate ? new Date(prevMaintenance.serviceStartDate).toLocaleDateString() : "-"}</MDTypography></Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs={7}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Service Completion Date:</MDTypography></Grid>
                                        <Grid item xs={5}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{prevMaintenance.serviceCompletionDate ? new Date(prevMaintenance.serviceCompletionDate).toLocaleDateString() : "-"}</MDTypography></Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Grid container style={{ marginBottom: "5px" }}>
                                        <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Technician Name:</MDTypography></Grid>
                                        <Grid item xs={6}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{prevMaintenance.technicianName || "-"}</MDTypography></Grid>
                                    </Grid>
                                    <Grid container style={{ marginBottom: "5px" }}>
                                        <Grid item xs={6}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Technician Comments:</MDTypography></Grid>
                                        <Grid item xs={6}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "14px" }}>{prevMaintenance.technicianComments || "-"}</MDTypography></Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Card>
                    </Grid>
                </Grid>
                <Card style={{ padding: "15px", width: "100%", marginTop: "15px" }}>
                    <Grid container spacing={11} style={{ marginBottom: "15px" }}>
                        <Grid item xs={10}>
                            <MDTypography variant="h5">Equipment Maintenance History</MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                        </Grid>
                    </Grid>
                    <ViewAllTable
                        values={maintenance}
                        headers={['Technician', 'Scheduled On', 'Started On', 'Completete On']}
                        attrib={['technicianName', 'scheduledStartDate', 'serviceStartDate', 'serviceCompletionDate']}
                        width={[2, 3, 3, 3]}
                        content={getContent}
                        disableExpansion = {true}
                    ></ViewAllTable>
                </Card>
            </div>
        </React.Fragment>
    )
}