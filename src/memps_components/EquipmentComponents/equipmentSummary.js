import { Alert, AlertTitle, Box, Button, Card, CardMedia, Divider, Grid, Icon, IconButton, Menu, MenuItem, Snackbar, Tab, Tabs, Tooltip, withStyles } from "@mui/material";
import axios from "axios";
import MDTypography from "components/MDTypography";
import HeaderAppBar from "memps_components/HeaderBar/HeaderAppBar";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProviderForm } from "memps_components/ProviderComponents/providerForm";
import { AddCircleOutline, AdfScanner, ArrowBack, ArrowBackIos, ArrowDropDownCircle, BrokenImage, CalendarToday, Close, HourglassBottomRounded, PrecisionManufacturing, ReportProblem, Schedule } from "@mui/icons-material";
import { PopupForm } from "memps_components/Popup/popupForm";
import Background from "assets/images/providerImages/policySummaryBackground.png"
import { ProviderDetails } from "memps_components/ProviderComponents/providerDetails";
import { styled } from "@material-ui/styles";
import InnerTable from "memps_components/DynamicTables/innerTable";
import { equipmentDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import { EquipmentDetails } from "./equipmentDetails";
import Container from "memps_components/ContentContainers/Container";
import { useMEMPSContext } from "context";
import colors from "assets/theme/base/colors";
import { MaintenanceForm } from "memps_components/MaintenanceComponents/MaintenanceForm";
import { EquipmentConfirmationForm } from "./confirmationForm";
import { KPICard } from "memps_components/ActionCards/kpiCards";
import { SuccessAlert } from "memps_components/SuccessAlert/successAlert";


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

export function EquipmentSummary() {
    const { equipmentId } = useParams();
    const [value, setValue] = useState("1");
    const [open, setOpen] = useState(false);
    const [KPIs,setKPIs] = useState([]);
    const [openFunc, setOpenFunc] = useState(false);
    const [opeRep, setRep] = useState(false);
    const [eligible, setEligible] = useState(false);
    const [equipment, setEuipment] = useState(equipmentDetails);
    const [maintenance, setMaintenance] = useState();
    const [log, setLog] = useState();
    const [val, setVal] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [controller, dispatch] = useMEMPSContext();
    const [showSnackbar, setShowSnackbar] = useState(false);
    const { role } = controller;

    const getData = async () => {
        await axios.get("http://localhost:1071/trintel/equipment/" + equipmentId).then((response) => { console.log(response.data); setEuipment(response.data) });
    }
    const getMaintenance = async () => {
        await axios.get("http://localhost:1071/trintel/equipment/maintenance/" + equipmentId).then((response) => { console.log(response.data.sort((dl, dr) => Number(dr.id.match("[0-9]{4}$")[0]) - Number(dl.id.match("[0-9]{4}$")[0]))); setMaintenance(response.data) });
    }
    const getKPIs = async ()=>{
        await axios.get("http://localhost:1071/trintel/equipment/kpi/" + equipmentId).then(response=>setKPIs(response.data.split("@#$")))
    }
    const getLog = async () => {
        await axios.get("http://localhost:1071/trintel/equipment/log/" + equipmentId).then(response => {
            setLog(
                response.data.sort(
                    (dl, dr) => Number(dr.logId.match("[0-9]{4}$")[0]) - Number(dl.logId.match("[0-9]{4}$")[0])
                )
            )
        });
    }
    const checkMaintenanceEligibility = async () => {
        await axios.get("http://localhost:1071/trintel/maintenance/eligible/equipment").then((response) => response.data.map((equipment) => equipment.equipmentId).includes(equipmentId) && setEligible(true))
    }
    const makeFunctional = async () => {
        equipment.status = "FUNCTIONAL";
        await axios.post("http://localhost:1071/trintel/equipment", equipment).then((response) => { setEuipment(response.data); setShowSnackbar(true) });
    }
    const makeBrokenDown = async () => {
        equipment.status = "BROKEN_DOWN";
        await axios.post("http://localhost:1071/trintel/equipment", equipment).then((response) => { setEuipment(response.data); setShowSnackbar(true) });
    }
    useEffect(
        () => { getData(); getMaintenance(); checkMaintenanceEligibility(); getLog(); getKPIs()},
        [val]
    )
    const changeDialogState = (val) => {
        setOpen(val);
    }
    const initiateRender = () => {
        setVal(val + 1);
        console.log(val);
        setShowSnackbar(true);
    }
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowSnackbar(false);
    };
    return (
        <Container>
            <HeaderAppBar />
            <CardMedia image={Background} style={{ height: "150px", marginTop: "100px", width: "102%", marginLeft: "-5px" }}>
                <Card style={{ height: "150px", backgroundColor: colors.imageOverlay, borderRadius: "10px", paddingLeft: "10px", paddingRight: "10px", paddingTop: "20px" }}>
                    <Grid container style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} spacing={4}>
                        <Grid item xs={0.4}>
                            <Tooltip title="Click to go back">
                                <Link to="/equipment">
                                    <IconButton style={{ color: "white" }} size="small">
                                        <ArrowBack fontSize="small"></ArrowBack>
                                    </IconButton>
                                </Link>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={10.1}>
                            <MDTypography variant="h4" style={{ color: "white" }}>Equipment - {"#" + equipment.equipmentId}</MDTypography>
                        </Grid>
                        <Grid item xs={1.5}>
                            <div style={{ display: role == "HOSPITAL" ? "inherit" : "none" }}>
                                <Button variant="contained" size="small" style={{ color: "white" }} onClick={(event) => setAnchorEl(event.currentTarget)} startIcon={<ArrowDropDownCircle fontSize="large"></ArrowDropDownCircle>}>
                                    Actions
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    onClose={() => { setAnchorEl(null) }}
                                    style={{ width: "250px" }}
                                >
                                    <Tooltip title={eligible ? "" : "To schedule a maintenance, the equipment should either be functional or broken down, with no active maintenance requests"} placement="left">
                                        <MenuItem style={{ height: "30px", marginLeft: "-25px", width: "250px" }}>
                                            <Button size="medium" onClick={() => { changeDialogState(true), setAnchorEl(null) }} startIcon={<Schedule fontSize="large"></Schedule>} style={{ color: colors.buttons.main }} disableRipple disabled={!eligible}>Schedule Maintenance</Button>
                                        </MenuItem>
                                    </Tooltip>
                                    <Tooltip title={equipment.status == "FUNCTIONAL" ? "The equipment is already functional" : equipment.status == "BROKEN_DOWN" ? "A broken down equipment cannot be made functional" : "The equipment hasn't been delivered yet"} placement="left">
                                        <MenuItem style={{ height: "30px", marginLeft: "-25px", width: "250px" }}>
                                            <Button onClick={() => { setOpenFunc(true), setAnchorEl(null) }} size="medium" startIcon={<PrecisionManufacturing fontSize="large"></PrecisionManufacturing>} style={{ color: colors.buttons.main }} disableRipple disabled={equipment.status != "DELIVERED"}>Mark As Functional</Button>
                                        </MenuItem>
                                    </Tooltip>
                                    <Tooltip title={equipment.status == "BROKEN_DOWN" ? "The equipment is already marked as broken down" : equipment.status == "SHIPPED" ? "The equipment hasn't been delivered yet" : ""} placement="left">
                                        <MenuItem style={{ height: "30px", marginLeft: "-25px", width: "250px" }}>
                                            <Button onClick={() => { setRep(true), setAnchorEl(null) }} size="medium" startIcon={<BrokenImage fontSize="large"></BrokenImage>} style={{ color: colors.buttons.main }} disableRipple disabled={equipment.status != "FUNCTIONAL" && equipment.status != "DELIVERED"}>Mark As Broken Down</Button>
                                        </MenuItem>
                                    </Tooltip>
                                </Menu>
                                <PopupForm open={open} onClose={() => changeDialogState(false)} givenKey={1}>
                                    <MaintenanceForm onClick={() => changeDialogState(false)} equipment={equipment} initiateRender={() => initiateRender()}></MaintenanceForm>
                                </PopupForm>
                                <PopupForm open={openFunc} onClose={() => setOpenFunc(false)} givenKey={2}>
                                    <EquipmentConfirmationForm onClick={() => setOpenFunc(false)} title={"Functional"} postMethod={makeFunctional}></EquipmentConfirmationForm>
                                </PopupForm>
                                <PopupForm open={opeRep} onClose={() => setRep(false)} givenKey={3}>
                                    <EquipmentConfirmationForm onClick={() => setRep(false)} title={"Broken Down"} postMethod={makeBrokenDown}></EquipmentConfirmationForm>
                                </PopupForm>
                            </div>
                        </Grid>
                    </Grid>
                </Card>
            </CardMedia>
            <Grid container style={{ marginLeft: marginLeft, marginRight: marginRight, marginTop: "-50px", padding: "0px", marginBottom: "20px" }}>
                <Grid item xs={2.5}>
                    <Card style={{height: "30%", marginBottom: "3%", width: "94%", overflowY: "hidden"}}>
                        <KPICard title="Hours Left for Maintenance" value={KPIs[2] || '-'} secValue="hrs." inSummary={true}>
                            <HourglassBottomRounded fontSize="medium" style={{ color: colors.buttons.main }}/>
                        </KPICard>
                    </Card>
                    <Card style={{height: "30%", marginBottom: "3%", width: "94%", overflowY: "hidden"}}>
                        <KPICard title="Days Left for Maintenance" value={KPIs[1] || '-'} secValue="days." inSummary={true}>
                            <CalendarToday fontSize="medium" style={{ color: colors.buttons.main }}/>
                        </KPICard>
                    </Card>
                    <Card style={{height: "30%", width: "94%",  width: "94%", overflowY: "hidden"}}>
                        <KPICard title="Problems Noticed By Users" value={KPIs[0] || '-'} secValue="nos." inSummary={true}>
                            <ReportProblem fontSize="medium" style={{ color: colors.buttons.main }}/>
                        </KPICard>
                    </Card>
                </Grid>
                <Grid item xs= {9.5}>
                    <Card style={{padding: "10px", marginRight: "33px"}}>
                        <EquipmentDetails equipment={equipment} insideEquipmentSummary={true}></EquipmentDetails>
                    </Card>
                </Grid>
            </Grid>
            <Card style={{ marginLeft: marginLeft, marginTop: "10px", padding: "0px", marginBottom: "10px", backgroundColor: "transparent", boxShadow: "none", marginRight: marginRight }}>
                <Tabs value={value} onChange={handleChange} sx={{ borderRadius: "0px", backgroundColor: "white", width: "500px" }} TabIndicatorProps={{
                    style: {
                        backgroundColor: "transparent",
                        borderRadius: "0px",
                        borderBottom: "2px solid #00203f",
                        boxShadow: "none",
                    }
                }} variant="fullWidth">
                    <Tab label="Maintenance History" value="1" />
                    <Tab label="Usage Logs" value="2" />
                    <Tab label="Supplier" value="3" />
                </Tabs>
            </Card>
            <Card style={{ marginLeft: marginLeft, marginRight: marginRight }}>
                <TabPanel value={value} index={"3"}>
                    <ProviderDetails provider={equipment.providers}></ProviderDetails>
                </TabPanel>
                <TabPanel value={value} index={"1"}>
                    <Card style={{ backgroundColor: "#f7fafc", padding: "10px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px", marginBottom: "10px", boxShadow: "none" }}>
                        <Grid container style={{ display: "flex", alignItems: "center" }}>
                            <Grid item xs={2.3}><MDTypography variant="h5">Services Performed</MDTypography></Grid>
                            <Grid item xs={9.7}><hr style={{ color: "#344767" }}></hr></Grid>
                        </Grid>
                    </Card>
                    <Card id="card2" style={{ padding: "20px", borderRadius: "0px", boxShadow: "none" }}>
                        <InnerTable
                            values={maintenance}
                            headers={["Maintenance ID", "Technician Name", "Scheduled On", "Completed On", "Status"]}
                            attrib={["id", "technicianName", "scheduledStartDate", "serviceCompletionDate", "status"]}
                            linkIndex={0}
                            link={"/maintenance/"}
                        >
                        </InnerTable>
                    </Card>
                </TabPanel>
                <TabPanel value={value} index={"2"}>
                    <Card style={{ backgroundColor: "#f7fafc", padding: "10px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px", marginBottom: "10px", boxShadow: "none" }}>
                        <Grid container style={{ display: "flex", alignItems: "center" }}>
                            <Grid item xs={1.4}><MDTypography variant="h5">Usage Logs</MDTypography></Grid>
                            <Grid item xs={10.6}><hr style={{ color: "#344767" }}></hr></Grid>
                        </Grid>
                    </Card>
                    <Card id="card2" style={{ padding: "20px", borderRadius: "0px", boxShadow: "none" }}>
                        <InnerTable
                            values={log}
                            headers={["User", "Started Usage On", "Hours Used", "Noticed Problems", "Comments"]}
                            attrib={["users.userId(users.username)", "createdOn", "hoursUsed", "noticedProblems", "comments"]}
                        >
                        </InnerTable>
                    </Card>
                </TabPanel>
            </Card>
            <SuccessAlert open={showSnackbar} onClose={handleClose}/>
        </Container>
    )
}