import { Box, Button, Card, CardMedia, Divider, Grid, IconButton, Menu, MenuItem, Tab, Tabs, withStyles } from "@mui/material";
import axios from "axios";
import MDTypography from "components/MDTypography";
import HeaderAppBar from "memps_components/HeaderBar/HeaderAppBar";
import { providerDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ProviderForm } from "./providerForm";
import { AddCircleOutline, ArrowBack, ArrowBackIos, ArrowDropDown, ArrowDropDownCircle, Edit, MenuOpen } from "@mui/icons-material";
import { PopupForm } from "memps_components/Popup/popupForm";
import Background from "assets/images/providerImages/policySummaryBackground.png"
import { ProviderDetails } from "./providerDetails";
import { styled } from "@material-ui/styles";
import InnerTable from "memps_components/DynamicTables/innerTable";
import Container from "memps_components/ContentContainers/Container";
import colors from "assets/theme/base/colors";
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
export function ProviderSummary() {
    const { providerId } = useParams();
    const [value, setValue] = useState("1");
    const [open, setOpen] = useState(false);
    const [provider, setProvider] = useState(providerDetails);
    const [orders, setOrders] = useState();
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [maintenance, setMaintenance] = useState();
    const [val, setVal] = useState(0);
    const [showSnackbar, setShowSnackbar] = useState(false);

    const getData = async () => {
        await axios.get("http://localhost:1071/trintel/provider/" + providerId).then((response) => { console.log(response.data); setProvider(response.data) });
    }
    const getOrders = async () => {
        await axios.get("http://localhost:1071/trintel/order/provider/" + providerId).then((response) => { console.log(response.data); setOrders(response.data) });
    }
    const getMaintenance = async () => {
        await axios.get("http://localhost:1071/trintel/provider/maintenance/" + providerId).then((response) => { console.log(response.data); setMaintenance(response.data) });
    }
    useEffect(
        () => { getData(); getOrders(); getMaintenance(); },
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
                            <Link to="/supplier">
                            <IconButton style={{ color: "white" }} size="small">
                                <ArrowBack fontSize="small"></ArrowBack>
                            </IconButton>
                            </Link>
                        </Grid>
                        <Grid item xs={10.1}>
                            <MDTypography variant="h4" style={{ color: "white" }}>Supplier - {"#" + provider.providerId}</MDTypography>
                        </Grid>
                        <Grid item xs={1.5}>
                            <Button variant="contained" size="small" style={{ color: "white" }} onClick={(event) => setAnchorEl(event.currentTarget)} startIcon={<ArrowDropDownCircle fontSize="large"></ArrowDropDownCircle>}>
                                Actions
                            </Button>
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={menuOpen}
                                onClose={()=>{setAnchorEl(null)}}
                                style={{width: "130px"}}
                            >
                                <MenuItem onClick={() => {changeDialogState(true), setAnchorEl(null)}} style={{height: "30px", marginLeft: "-25px"}}>
                                <Button size="medium" startIcon={<Edit fontSize="large"></Edit>} style={{color: colors.buttons.main}}>Edit</Button>
                                </MenuItem>
                            </Menu>
                            <PopupForm open={open} onClose={() => changeDialogState(false)} givenKey={1}>
                                <ProviderForm onClick={() => changeDialogState(false)} currentProvider={provider} initiateRender={() => initiateRender()} showSnackbar={()=>setShowSnackbar(true)}></ProviderForm>
                            </PopupForm>
                        </Grid>
                    </Grid>
                </Card>
            </CardMedia>
            <Card style={{ marginLeft: marginLeft, marginRight: marginRight, marginTop: "-50px", padding: "10px", marginBottom: "20px" }}>
                <ProviderDetails provider={provider} insideProviderSummary={true}></ProviderDetails>
            </Card>
            <Card style={{ marginLeft: marginLeft, marginTop: "10px", padding: "0px", marginBottom: "10px", backgroundColor: "transparent", boxShadow:"none", marginRight: marginRight}}>
            <Tabs value={value} onChange={handleChange} sx={{ borderRadius: "0px", backgroundColor: "white", width: "500px" }} TabIndicatorProps={{
                    style: {
                        backgroundColor: "transparent",
                        borderRadius: "0px",
                        borderBottom: "2px solid #00203f",
                        boxShadow: "none",
                    }
                }} variant="fullWidth">
                    <Tab label="Orders" value="1" />
                    <Tab label="Maintenance History" value="2" />
                </Tabs>
            </Card>
            <Card style={{ marginLeft: marginLeft, marginRight: marginRight }}>
                <TabPanel value={value} index={"1"}>
                    <Card style={{ backgroundColor: "#f7fafc", padding: "10px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px", marginBottom: "10px", boxShadow:"none" }}>
                        <Grid container style={{ display: "flex", alignItems: "center" }}>
                            <Grid item xs={2.8}><MDTypography variant="h5">Orders Made to Supplier</MDTypography></Grid>
                            <Grid item xs={9.2}><hr style={{ color: "#344767" }}></hr></Grid>
                        </Grid>
                    </Card>
                    <Card id="card1" style={{ padding: "20px", borderRadius: "0px", boxShadow: "none" }}>
                        <InnerTable
                            values={orders}
                            headers={["Order Number", "Ordered On", "Order Status"]}
                            attrib={["orderNum", "orderedOn", "orderStatus"]}
                        >
                        </InnerTable>
                    </Card>
                </TabPanel>
                <TabPanel value={value} index={"2"}>
                    <Card style={{ backgroundColor: "#f7fafc", padding: "10px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px", marginBottom: "10px", boxShadow: "none" }}>
                        <Grid container style={{ display: "flex", alignItems: "center" }}>
                            <Grid item xs={2.3}><MDTypography variant="h5">Services Performed</MDTypography></Grid>
                            <Grid item xs={9.7}><hr style={{ color: "#344767" }}></hr></Grid>
                        </Grid>
                    </Card>
                    <Card id="card2" style={{ padding: "20px", borderRadius: "0px", boxShadow: "none" }}>
                        <InnerTable
                            values={maintenance}
                            headers={["Equipment", "Started On", "Completed On"]}
                            attrib={["equipment.equipmentId", "serviceStartDate", "serviceCompletionDate"]}
                        >
                        </InnerTable>
                    </Card>
                </TabPanel>
            </Card>
            <SuccessAlert open={showSnackbar} onClose={handleClose}/>
        </Container>
    )
}