import { Box, Button, Card, CardMedia, Divider, Grid, IconButton, Menu, MenuItem, Tab, Tabs, Tooltip, withStyles } from "@mui/material";
import axios from "axios";
import MDTypography from "components/MDTypography";
import HeaderAppBar from "memps_components/HeaderBar/HeaderAppBar";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AddCircleOutline, ArrowBack, ArrowBackIos, ArrowDropDownCircle, Cancel, EditCalendar, LocalShipping, ReceiptLong } from "@mui/icons-material";
import { PopupForm } from "memps_components/Popup/popupForm";
import Background from "assets/images/providerImages/policySummaryBackground.png"
import { ProviderDetails } from "memps_components/ProviderComponents/providerDetails";
import { styled } from "@material-ui/styles";
import InnerTable from "memps_components/DynamicTables/innerTable";
import { orderDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import { ConfirmShipmentForm } from "./ConfirmShipmentForm";
import Container from "memps_components/ContentContainers/Container";
import colors from "assets/theme/base/colors";
import { useMEMPSContext } from "context";
import { billDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import { ConfirmationForm } from "./ConfirmationForm";
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

export function OrderSummary() {
    const { orderNum } = useParams();
    const [value, setValue] = useState("1");
    const [open,setOpen] = useState(false);
    const [equipment,setEquiment] = useState([]);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [openCancel, setOpenCancel] = useState(false);
    const [bill,setBill] = useState(JSON.parse(JSON.stringify(billDetails)));
    const [billItems, setBillItems] = useState([]);
    const [order, setOrder] = useState(orderDetails);
    const [val, setVal] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const menuOpen = Boolean(anchorEl);
    const [controller, dispatch] = useMEMPSContext();
    const { role } = controller;
    const [showSnackbar, setShowSnackbar] = useState(false);

    const getOrder = async () => {
        await axios.get("http://localhost:1071/trintel/orders/" + orderNum).then((response) => { console.log(response.data); setOrder(response.data); setBillItems(response.data.orderItems.map((orderItem)=>{
            const billItem = JSON.parse(JSON.stringify(billDetails.billItems[0]));
            billItem.mpPerUnit = orderItem.catalog.markedPrice;
            billItem.quantity = orderItem.quantity;
            billItem.spPerUnit = orderItem.actualTotal / billItem.quantity;
            billItem.totalPrice = orderItem.actualTotal;
            billItem.catalog = orderItem.catalog;
            return billItem;
        })) });
    }
    const getEquipment = async() =>{
        await axios.get("http://localhost:1071/trintel/equipment/order/" + orderNum).then((response)=>setEquiment(response.data))
    }
    const updateOrder = async (billNumber) =>{
        const orderCopy = order;
        orderCopy.billNumber = billNumber;
        setOrder(orderCopy);
        await axios.post("http://localhost:1071/trintel/orders",order).then((response) => {setOrder(response.data);setShowSnackbar(true)});
    }
    const confirmOrderDelivery = async () =>{
        const orderCopy = order;
        orderCopy.orderStatus = "DELIVERED";
        orderCopy.deliveredOn = new Date().getTime();
        setOrder(orderCopy);
        const equipmentCopy = equipment.map((equipment)=>{const currEuip = equipment; currEuip.status = "DELIVERED"; currEuip.purchasedOn = new Date().getTime(); return currEuip;});
        await axios.post("http://localhost:1071/trintel/orders",order).then((response) => {setOrder(response.data);setShowSnackbar(true)});
        await axios.post("http://localhost:1072/trintel/equipment/addAll", equipmentCopy).then((response)=>{getEquipment()});
    }
    const cancelOrder = async () =>{
        const orderCopy = order;
        orderCopy.orderStatus = "CANCELLED";
        setOrder(orderCopy);
        await axios.post("http://localhost:1071/trintel/orders",order).then((response) => {setOrder(response.data);setShowSnackbar(true)});
    }
    const generateBill = async () => {
        bill.billedOn = new Date().getTime();
        bill.providers = order.providers;
        bill.billItems = billItems;
        await axios.post("http://localhost:1072/trintel/bills",bill).then((response) => { console.log(response.data); setBill(response.data); updateOrder(response.data.billNumber)});
    }
    useEffect(
        () => { getOrder(); getEquipment() },
        [val]
    )
    const changeDialogState = (val) => {
        setOpen(val);
    }
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setShowSnackbar(false);
    };
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
                                <Link to="/orders">
                                    <IconButton style={{ color: "white" }} size="small">
                                        <ArrowBack fontSize="small"></ArrowBack>
                                    </IconButton>
                                </Link>
                            </Tooltip>
                        </Grid>
                        <Grid item xs={10.1}>
                            <MDTypography variant="h4" style={{ color: "white" }}>Order - {"#" + order.orderNum}</MDTypography>
                        </Grid>
                        <Grid item xs={1.5}>
                                <Button variant="contained" size="small" style={{ color: "white" }} onClick={(event) => setAnchorEl(event.currentTarget)} startIcon={<ArrowDropDownCircle fontSize="large"></ArrowDropDownCircle>}>
                                    Actions
                                </Button>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={menuOpen}
                                    onClose={() => { setAnchorEl(null) }}
                                    style={{ width: "184px" }}
                                >
                                    <Tooltip title={order.orderStatus == "CANCELLED" ? "The order has already been cancelled" : order.orderStatus != "PLACED" ? "Order cannot be cancelled at this time" : ""} placement="left">
                                        <MenuItem style={{ height: "30px", marginLeft: "-33px", width: "184px"}}>
                                            <Button onClick={() => {  setOpenCancel(true); setAnchorEl(null) }} size="medium" startIcon={<Cancel fontSize="large"></Cancel>} disableRipple style={{ color: colors.buttons.main }} disabled={order.orderStatus != "PLACED"}>Cancel Order</Button>
                                        </MenuItem>
                                    </Tooltip>
                                    {
                                        role=="SUPPLIER"?
                                        <div>
                                        <Tooltip title={order.orderStatus == "SHIPPED" ||order.orderStatus == "DELIVERED" ? "The order has already been shipped" : order.orderStatus == "CANCELLED" ? "The order has been cancelled":""} placement="left">
                                        <MenuItem style={{ height: "30px", marginLeft: "-10px", }}>
                                            <Button size="medium" onClick={() => { changeDialogState(true), setAnchorEl(null) }} disableRipple startIcon={<LocalShipping fontSize="large"></LocalShipping>} style={{ color: colors.buttons.main }} disabled={order.orderStatus != "PLACED"}>Mark As Shipped</Button>
                                        </MenuItem>
                                        </Tooltip>
                                        {/* <Tooltip title={order.orderStatus == "CANCELLED" ? "The order has been cancelled": order.orderStatus == "PLACED" ? "The order is yet to be shipped" : order.billNumber && "The bill for this order has already been generated"} placement="left">
                                        <MenuItem style={{ height: "30px", marginLeft: "-32px", width:"184px" }}>
                                            <Button disabled={order.billNumber || !(["DELIVERED","SHIPPED"].includes(order.orderStatus))} onClick={() => { setAnchorEl(null); generateBill(); }} size="medium"  disableRipple startIcon={<ReceiptLong fontSize="large"></ReceiptLong>} style={{ color: colors.buttons.main }}>Generate Bill</Button>
                                        </MenuItem>
                                        </Tooltip> */}
                                        </div>
                                        :
                                        <div>
                                        <Tooltip title={order.orderStatus == "DELIVERED" ? "The order has already been delivered" : order.orderStatus =="CANCELLED" ? "The order has been cancelled" :  order.orderStatus =="PLACED"?"The order hasn't been shipped yet":""} placement="left">
                                        <MenuItem style={{ height: "30px", marginLeft: "-21px", width: "184px" }}>
                                            <Button size="medium" onClick={() => { setOpenConfirm(true), setAnchorEl(null) }} disableRipple startIcon={<LocalShipping fontSize="large"></LocalShipping>} style={{ color: colors.buttons.main }} disabled={order.orderStatus != "SHIPPED"}>Confirm Delivery</Button>
                                        </MenuItem>
                                        </Tooltip>
                                        </div>
                                    }
                                </Menu>
                                <PopupForm open={open} onClose={() => changeDialogState(false)} givenKey={1}>
                                    <ConfirmShipmentForm onClick={() => changeDialogState(false)} currentOrder={order} initiateRender={() => initiateRender()}></ConfirmShipmentForm>
                                </PopupForm>
                                <PopupForm open={openConfirm} onClose={() => setOpenConfirm(false)} givenKey={2}>
                                    <ConfirmationForm onClick={() => setOpenConfirm(false)} postMethod={confirmOrderDelivery} title={"Delivery"}></ConfirmationForm>
                                </PopupForm>
                                <PopupForm open={openCancel} onClose={() => setOpenCancel(false)} givenKey={3}>
                                    <ConfirmationForm onClick={() => setOpenCancel(false)} postMethod={cancelOrder} title={"Cancellation"}></ConfirmationForm>
                                </PopupForm>
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
                        <Grid item xs={1.5}><MDTypography variant="h5">Order Details</MDTypography></Grid>
                        <Grid item xs={10.5}><hr style={{ color: "#344767" }}></hr></Grid>
                    </Grid>
                </Card>
                <Grid container style={{ padding: "10px" }}>
                    <Grid item xs={6}>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Order Number:</MDTypography></Grid>
                            <Grid item xs={7}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{order.orderNum}</MDTypography></Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Supplier:</MDTypography></Grid>
                            <Grid item xs={7}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{order.providers.providerName + " (" + order.providers.providerId + ")"}</MDTypography></Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Ordered On:</MDTypography></Grid>
                            <Grid item xs={7}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{new Date(order.orderedOn).toLocaleDateString()}</MDTypography></Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Shipped On:</MDTypography></Grid>
                            <Grid item xs={7}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{order.shippedOn ? new Date(order.shippedOn).toLocaleDateString() : "-"}</MDTypography></Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={5}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Delivered On:</MDTypography></Grid>
                            <Grid item xs={7}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{order.deliveredOn ? new Date(order.deliveredOn).toLocaleDateString() : "-"}</MDTypography></Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={6}>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Estimated Total:</MDTypography></Grid>
                            <Grid item xs={8}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{order.estimatedTotal}</MDTypography></Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Actual Total:</MDTypography></Grid>
                            <Grid item xs={8}><MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="light">{order.actualTotal || "-"}</MDTypography></Grid>
                        </Grid>
                        <Grid container style={{ marginBottom: "3px" }}>
                            <Grid item xs={4}><MDTypography variant="h6" style={{ fontSize: "15px" }}>Order Status:</MDTypography></Grid>
                            <Grid item xs={8}><MDTypography variant="h6" fontWeight="light" style={{ fontSize: "15px" }}>{order.orderStatus}</MDTypography></Grid>
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
                    <Tab label="Order Items" value="1" />
                    <Tab label="Equipment" value="2" />
                    {role=="HOSPITAL"&&<Tab label="Supplier" value="3" />}
                </Tabs>
            </Card>
            <Card style={{ marginLeft: marginLeft, marginRight: marginRight }}>
                <TabPanel value={value} index={"1"}>
                    <Card style={{ backgroundColor: "#f7fafc", padding: "10px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px", marginBottom: "10px", boxShadow: "none" }}>
                        <Grid container style={{ display: "flex", alignItems: "center" }}>
                            <Grid item xs={1.4}><MDTypography variant="h5">Order Items</MDTypography></Grid>
                            <Grid item xs={10.6}><hr style={{ color: "#344767" }}></hr></Grid>
                        </Grid>
                    </Card>
                    <Card id="card2" style={{ padding: "20px", borderRadius: "0px", boxShadow: "none" }}>
                        <InnerTable
                            values={order.orderItems}
                            headers={["Product Name", "Quantity(In Number)", "Estimated Total", "Actual Total"]}
                            attrib={["catalog.productName", "quantity", "estimatedTotal", "actualTotal"]}
                        >
                        </InnerTable>
                    </Card>
                </TabPanel>
                <TabPanel value={value} index={"2"}>
                    <Card style={{ backgroundColor: "#f7fafc", padding: "10px", borderBottomRightRadius: "0px", borderBottomLeftRadius: "0px", marginBottom: "10px", boxShadow: "none" }}>
                        <Grid container style={{ display: "flex", alignItems: "center" }}>
                            <Grid item xs={1.4}><MDTypography variant="h5">Equipment</MDTypography></Grid>
                            <Grid item xs={10.6}><hr style={{ color: "#344767" }}></hr></Grid>
                        </Grid>
                    </Card>
                    <Card id="card2" style={{ padding: "20px", borderRadius: "0px", boxShadow: "none" }}>
                        <InnerTable
                            values={equipment}
                            headers={["Equipment ID", "Product Name", "Cost", "Category"]}
                            attrib={["equipmentId", "catalog.productName", "cost", "catalog.categories.categoryName"]}
                        >
                        </InnerTable>
                    </Card>
                </TabPanel>
                <TabPanel value={value} index={"3"}>
                    <ProviderDetails provider={order.providers}></ProviderDetails>
                </TabPanel>
            </Card>
            <SuccessAlert open={showSnackbar} onClose={handleClose}/>
        </Container>
    )
}