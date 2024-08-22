import { Autocomplete, Box, Button, Card, createTheme, Divider, Grid, IconButton, InputAdornment, Step, StepIcon, StepLabel, Stepper, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, ThemeProvider } from "@mui/material";
import { providerDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import React, { useEffect, useState } from "react";
import AddOrder from "assets/images/orderImages/addOrderInfographic.png"
import MDTypography from "components/MDTypography";
import { AccountBox, AccountCircle, Add, AddCircle, AdfScanner, AlternateEmail, ArrowBackIos, ArrowForwardIos, ArrowLeft, ArrowRight, Cancel, CancelOutlined, Close, CompassCalibration, DoneAll, Email, LocationCity, Mail, Padding, Person, Person4, Phone, Save, Shop, Signpost, Store, WhereToVote } from "@mui/icons-material";
import { nameRegex } from "memps_components/RegexString/RegexString";
import { emailRegex } from "memps_components/RegexString/RegexString";
import { phoneRegex } from "memps_components/RegexString/RegexString";
import { addressRegex } from "memps_components/RegexString/RegexString";
import { numberRegex } from "memps_components/RegexString/RegexString";
import axios from "axios";
import { DatePicker, LocalizationProvider, MobileDatePicker, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import textField from "assets/theme/components/form/textField";
import Calendar from "react-calendar";
import colors from "assets/theme/base/colors";
import { orderDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';
import VerifiedIcon from '@mui/icons-material/Verified';
import { useAsyncDebounce } from "react-table";
import InnerTable from "memps_components/DynamicTables/innerTable";
import { ActionSuccessfulScreen } from "memps_components/ConfirmationScreen/confirmationScreen";
import pxToRem from "assets/theme/functions/pxToRem";


const stepperIcon = {
    borderRadius: "50%", padding: "4px", backgroundColor: colors.stepperIcon, color: "white"
}
const visitedStepperIcon = {
    borderRadius: "50%", padding: "4px", backgroundColor: colors.applicationPrimary, color: colors.stepperIcon
}
const localTableTheme = (theme) => createTheme({
    ...theme,
    components: {
        ...theme.components,
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.white.main,
                    boxShadow: "none",
                    borderRadius: "4px",
                    border: `1px solid ${colors.grey["500"]}`
                }
            }
        },
        MuiTableHead: {
            styleOverrides: {
              root: {
                padding: `${pxToRem(16)} ${pxToRem(16)} 0  ${pxToRem(16)}`,
                borderRadius: `4px 4px 0 0`,
                border: `1px solid ${colors.navbarColor}`
              },
            },
          }
    }
})
const localCardTheme = (theme) => createTheme({
    ...theme,
    components: {
        ...theme.components,
        MuiCard: {
            styleOverrides: {
                root: {
                    backgroundColor: colors.white.main,
                    boxShadow: "none",
                    borderRadius: "4px",
                    border: `1px solid ${colors.grey["500"]}`
                }
            }
        }
    }
})
const labelValue = { width: "500px", marginBottom: "5px" }
export function OrderForm({ onClick, currentOrder, reloadData}) {
    const [order, setOrder] = useState(JSON.parse(JSON.stringify(currentOrder == null ? orderDetails : currentOrder)));
    const [error, setError] = useState("{}");
    const [orderItems, setOrderItems] = useState(JSON.parse(JSON.stringify(order.orderItems)));
    const [provider, setProvider] = useState(JSON.parse(JSON.stringify(providerDetails)));
    const [allProviders, setAllProviders] = useState([]);
    const [address, setAddress] = useState(provider.providerAddress.split("@#$"));
    const [orderItemCount, setOrderItemCount] = useState(currentOrder == null ? "" : order.orderItems.length);
    const [activeStep, setActiveStep] = useState(0);
    const [catalog, setCatalog] = useState([]);
    const [success, setSuccess] = useState(false);
    const steps = [
        {
            label: "Supplier",
            index: 0,
            icon: <Store fontSize="inherit" style={activeStep >= 0 ? visitedStepperIcon : stepperIcon} />
        },
        {
            label: "Order Items",
            index: 1,
            icon: <AddShoppingCartIcon fontSize="inherit" style={activeStep >= 1 ? visitedStepperIcon : stepperIcon} />
        },
        {
            label: "Confirmation",
            index: 2,
            icon: <VerifiedIcon fontSize="inherit" style={activeStep >= 2 ? visitedStepperIcon : stepperIcon} />
        }
    ]
    const [completed, setCompleted] = useState({});
    const loadProviders = async () => {
        await axios.get("http://localhost:1071/trintel/provider").then((response) => { setAllProviders(response.data) })
    }
    const loadCatalog = async () => {
        await axios.get("http://localhost:1071/trintel/catalog").then((response) => { setCatalog(response.data) })
    }
    useEffect(
        () => { loadProviders(); loadCatalog() },
        []
    )

    const handleSubmit = async () => {
        order.orderedOn = new Date().getTime();
        order.orderItems = orderItems;
        order.providers = provider;
        order.estimatedTotal = orderItems.map((orderItem) => orderItem.estimatedTotal).reduce((sum, value) => sum += value, 0)
        console.log(order);
        await axios.post("http://localhost:1071/trintel/orders", order).then((response) => { setOrder(response.data); setSuccess(true) });
        //onClick();
    }
    const handleCancel = () => {
        onClick();
    }

    const addItem = () => {
        setOrderItems([...orderItems, ...JSON.parse(JSON.stringify(order.orderItems))]);
    }
    const removeItem = (index) => {
        setOrderItems([...orderItems.slice(0, index), ...orderItems.slice(index + 1, orderItems.length)]);
    }
    const handlePrev = () => {
        completed[activeStep] = false;
        setActiveStep((prevActiveStep) => prevActiveStep - 1)
    }
    const handleNext = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
    const handleAutoCompleteChange = (event, newValue) => {
        if (newValue == null) {
            setProvider(JSON.parse(JSON.stringify(providerDetails)));
            setAddress([null, null, null, null]);
            setError({...error,supplierId: "Cannot be Empty"})
        }
        else {
            console.log("Here");
            setError({...error,supplierId: null})
            setAddress(allProviders.filter((provider) => provider.providerId == newValue)[0].providerAddress.split("@#$"));
            setProvider(allProviders.filter((provider) => provider.providerId == newValue)[0]);
        }
    }
    return (
        <React.Fragment>
            {
                success ?
                    <ActionSuccessfulScreen record={"Order"} pk={order.orderNum} summaryURL = "/orders/" onClick = {reloadData} /> :
                    <Card style={{ padding: "10px", width: "900px" }}>
                        <MDTypography variant="h4">Create Order</MDTypography>
                        <Divider></Divider>
                        <Stepper activeStep={activeStep} style={{ paddingLeft: "15%", paddingRight: "15%", marginBottom: "30px" }}>
                            {steps.map((step) => (
                                <Step key={step.label} completed={completed[step.index]} style={{ fontSize: "25px" }}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <StepIcon icon={step.icon}></StepIcon>
                                        <MDTypography variant="h6" style={{ marginLeft: "5px", fontSize: "14px" }}>{step.label}</MDTypography>
                                    </div>
                                </Step>
                            ))}
                        </Stepper>
                        {
                            activeStep == 0 ?
                                <Grid container spacing={4} style={{ paddingRight: "5px", minHeight: "300px" }}>
                                    <Grid item xs={5.2}>
                                        <Card style={{ boxShadow: "none", overflow: "hidden" }}>
                                            <img src={AddOrder} style={{ height: "320px", margin: "-20px" }}></img>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6.8}>
                                        <Autocomplete
                                            value={provider.providerId}
                                            onChange={handleAutoCompleteChange}
                                            id="providerId"
                                            name="providerId"
                                            style={{ marginBottom: "10px" }}
                                            options={allProviders.map((provider) => provider.providerId)}
                                            isOptionEqualToValue={(option, value) => option == value}
                                            renderInput={(params) => <TextField
                                                {...params}
                                                label="Supplier Id"
                                                fullWidth
                                                placeholder="Start typing the Supplier's ID... "
                                                InputProps={{
                                                    ...params.InputProps,
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Person fontSize="medium" />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                            />}
                                        />
                                        <TextField
                                            name="name"
                                            variant="outlined"
                                            label="Supplier Name"
                                            fullWidth
                                            value={provider.providerName}
                                            style={{ marginBottom: "15px", marginTop: "10px" }}
                                            placeholder="Selected Supplier's Name"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Person fontSize="medium" />
                                                    </InputAdornment>
                                                ),
                                                inputProps: {
                                                    readOnly: true
                                                }
                                            }}
                                        />
                                        <br></br>
                                        <TextField
                                            variant="outlined"
                                            label="Street Address"
                                            name="strt"
                                            fullWidth
                                            style={{ marginBottom: "15px" }}
                                            value={address[0]}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <Signpost fontSize="medium" />
                                                    </InputAdornment>
                                                ),
                                                inputProps: {
                                                    readOnly: true
                                                }
                                            }}
                                            placeholder="Seleted Supplier's Street Address"
                                        />
                                        <br></br>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <TextField
                                                    name="city"
                                                    variant="outlined"
                                                    label="City"
                                                    fullWidth
                                                    style={{ marginBottom: "15px" }}
                                                    value={address[1]}
                                                    placeholder="City Name"
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <LocationCity fontSize="medium" />
                                                            </InputAdornment>
                                                        ),
                                                        inputProps: {
                                                            readOnly: true
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField
                                                    variant="outlined"
                                                    label="State"
                                                    fullWidth
                                                    name="state"
                                                    placeholder="State Name"
                                                    style={{ marginBottom: "15px" }}
                                                    value={address[2]}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <WhereToVote fontSize="medium" />
                                                            </InputAdornment>
                                                        ),
                                                        inputProps: {
                                                            readOnly: true
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField
                                                    name="zip"
                                                    variant="outlined"
                                                    label="Postal Code"
                                                    fullWidth
                                                    placeholder="XXXXXX"
                                                    value={address[3]}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Mail fontSize="medium" />
                                                            </InputAdornment>
                                                        ),
                                                        inputProps: {
                                                            readOnly: true
                                                        }
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid> :
                                activeStep == 1 ?
                                    <div style={{ paddingLeft: "5%", paddingRight: "5%", minHeight: "280px" }}>
                                        <ThemeProvider theme={localTableTheme}>
                                            <TableContainer style={{ borderRadius: "5px" }}>
                                            <Table>
                                                <TableHead sx={{ display: "table-header-group", background: "linear-gradient(#1d403c, #25524c)" }}>
                                                    <TableRow>
                                                        <TableCell width={"22%"}>
                                                            <MDTypography variant="h6" color="white">Product ID</MDTypography>
                                                        </TableCell>
                                                        <TableCell width={"25%"}>
                                                            <MDTypography variant="h6" color="white">Product Name</MDTypography>
                                                        </TableCell>
                                                        <TableCell width={"15%"}>
                                                            <MDTypography variant="h6" color="white">Unit Cost</MDTypography>
                                                        </TableCell>
                                                        <TableCell width={"15%"}>
                                                            <MDTypography variant="h6" color="white">Quantity</MDTypography>
                                                        </TableCell>
                                                        <TableCell width={"20%"}>
                                                            <MDTypography variant="h6" color="white">Estimated Total</MDTypography>
                                                        </TableCell>
                                                        <TableCell></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {
                                                        orderItems.map(
                                                            (orderItem, index) => {
                                                                const indexEven = index % 2 == 0;
                                                                const orderItemCopy = [...orderItems];
                                                                const handleChange = (event) => {
                                                                    const { name, value } = event.target;
                                                                    switch (name) {
                                                                        case "quantity":
                                                                            if (!value.match(numberRegex) || value > 10 || value < 1) {
                                                                                orderItemCopy[index].quantity = value;
                                                                                setError({ ...error, ["quantity" + index]: value ? "Quantity should be a number between 1 and 10" : "Quantity cannot be empty" });
                                                                            }
                                                                            else {
                                                                                setError({ ...error, ["quantity" + index]: null });
                                                                                orderItemCopy[index].quantity = value;
                                                                                orderItemCopy[index].estimatedTotal = orderItemCopy[index].catalog ? orderItemCopy[index].catalog.markedPrice * value : 0;
                                                                                setOrderItems(orderItemCopy);
                                                                            }
                                                                            break;
                                                                    }
                                                                }
                                                                return (
                                                                    <TableRow style={{ backgroundColor: indexEven ? "#FFFFFF" : "#f7f7f7" }}>
                                                                        <TableCell>
                                                                            <Autocomplete
                                                                                value={orderItem.catalog.catalogId}
                                                                                disableClearable
                                                                                onChange={(event, newValue) => {
                                                                                    orderItemCopy[index].catalog = catalog.filter((catalogItem) => catalogItem.catalogId == newValue)[0];
                                                                                    orderItemCopy[index].estimatedTotal = orderItemCopy[index].quantity * orderItemCopy[index].catalog.markedPrice;
                                                                                    setError({...error,["productId" + index]: null})
                                                                                    setOrderItems(orderItemCopy);
                                                                                }}
                                                                                id="providerId"
                                                                                name="providerId"
                                                                                options={catalog.map((catalogItem) => catalogItem.catalogId)}
                                                                                renderInput={(params) => <TextField
                                                                                    {...params}
                                                                                    placeholder="CATXXXX"
                                                                                    variant="standard"
                                                                                    InputProps={{
                                                                                        ...params.InputProps,
                                                                                        disableUnderline: true
                                                                                    }}
                                                                                    fullWidth
                                                                                />}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            < TextField
                                                                                value={orderItem.catalog.productName}
                                                                                name="quantity"
                                                                                placeholder="Product Name"
                                                                                variant="standard"
                                                                                fullWidth
                                                                                InputProps={{
                                                                                    disableUnderline: true,
                                                                                    fullWidth: true,
                                                                                    readOnly: true
                                                                                }}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            < TextField
                                                                                value={orderItem.catalog.markedPrice}
                                                                                name="price"
                                                                                placeholder="XXXX.XX"
                                                                                variant="standard"
                                                                                fullWidth
                                                                                InputProps={{
                                                                                    disableUnderline: true,
                                                                                    fullWidth: true,
                                                                                    readOnly: true
                                                                                }}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            < TextField
                                                                                value={orderItem.quantity}
                                                                                onChange={handleChange}
                                                                                name="quantity"
                                                                                placeholder="XX"
                                                                                variant="standard"
                                                                                fullWidth
                                                                                helperText={error["quantity" + index]}
                                                                                error={error["quantity" + index]}
                                                                                InputProps={{
                                                                                    disableUnderline: true,
                                                                                    fullWidth: true
                                                                                }}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <TextField
                                                                                value={orderItem.estimatedTotal}
                                                                                placeholder="Start typing"
                                                                                variant="standard"
                                                                                InputProps={{
                                                                                    disableUnderline: true,
                                                                                    readOnly: true
                                                                                }}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <IconButton onClick={() => removeItem(index)}>
                                                                                <Close fontSize="small" style={{ color: colors.error.main }}></Close>
                                                                            </IconButton>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )
                                                            }
                                                        )
                                                    }
                                                    <TableRow>
                                                        <TableCell colSpan={2}>
                                                            <MDTypography variant="h6" style={{ marginLeft: "1px", fontSize: "15px" }}>Estimated Order Total</MDTypography>
                                                        </TableCell>
                                                        <TableCell />
                                                        <TableCell />
                                                        <TableCell>
                                                            <MDTypography variant="h6" style={{ marginLeft: "1px", fontSize: "15px" }}>
                                                                {orderItems.map((orderItem) => orderItem.estimatedTotal).reduce((sum, value) => sum += value, 0)}
                                                            </MDTypography>
                                                        </TableCell>
                                                        <TableCell/>
                                                    </TableRow>
                                                    <TableRow>
                                                        <TableCell>
                                                            <div style={{ display: "flex", alignItems: "center", height: "10px", marginLeft: "-15px" }} onClick={() => { }}>
                                                                <Button size="small" onClick={addItem} startIcon={<AddCircle style={{ color: colors.buttons.main }}></AddCircle>}>
                                                                    <MDTypography variant="h6" style={{ marginLeft: "1px", fontSize: "13px" }}>Add Item</MDTypography>
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                           </TableContainer>
                                        </ThemeProvider>
                                    </div> :
                                    <div style={{ paddingLeft: "1%", paddingRight: "1%", minHeight: "280px" }}>
                                        <ThemeProvider theme={localCardTheme}>
                                        <Card>
                                            <Card style={{
                                                padding: "10px",
                                                marginBottom: "8px",
                                                background: "linear-gradient(#1d403c, #25524c)"
                                            }}>
                                                <Grid container style={{ display: "flex", alignItems: "center" }}>
                                                    <Grid item xs={1.6}><MDTypography variant="h6" style={{ fontSize: "16px", color: "white" }}>Order Details</MDTypography></Grid>
                                                    <Grid item xs={10.4}><hr style={{ color: "white" }}></hr></Grid>
                                                </Grid>
                                            </Card>
                                            <div style={{ padding: "10px" }}>
                                                <Grid container style={labelValue}>
                                                    <Grid item xs={4}>
                                                        <MDTypography variant="h6" style={{ fontSize: "14px" }}>Supplier Name:</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <MDTypography variant="h6" fontWeight="light" style={{ fontSize: "14px" }}>{provider.providerName}</MDTypography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container style={labelValue}>
                                                    <Grid item xs={4}>
                                                        <MDTypography variant="h6" style={{ fontSize: "14px" }}>Street Address:</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <MDTypography variant="h6" fontWeight="light" style={{ fontSize: "14px" }}>{address[0]}</MDTypography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container style={labelValue}>
                                                    <Grid item xs={4}>
                                                        <MDTypography variant="h6" style={{ fontSize: "14px" }}>City:</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <MDTypography variant="h6" fontWeight="light" style={{ fontSize: "14px" }}>{address[1]}</MDTypography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container style={labelValue}>
                                                    <Grid item xs={4}>
                                                        <MDTypography variant="h6" style={{ fontSize: "14px" }}>State:</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <MDTypography variant="h6" fontWeight="light" style={{ fontSize: "14px" }}>{address[2]}</MDTypography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container style={labelValue}>
                                                    <Grid item xs={4}>
                                                        <MDTypography variant="h6" style={{ fontSize: "14px" }}>Postal Code:</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <MDTypography variant="h6" fontWeight="light" style={{ fontSize: "14px" }}>{address[3]}</MDTypography>
                                                    </Grid>
                                                </Grid>
                                                <Grid container style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                                                    <Grid item xs={1.2}>
                                                        <MDTypography variant="h6" style={{ fontSize: "14px" }}>Order Items</MDTypography>
                                                    </Grid>
                                                    <Grid item xs={10.8}>
                                                        <hr></hr>
                                                    </Grid>
                                                </Grid>
                                                <ThemeProvider theme={localTableTheme}>
                                                <InnerTable
                                                    values={orderItems}
                                                    headers={["Product Name", "Manufactured By", "Quantity(In Number)", "Estimated Total"]}
                                                    attrib={["catalog.productName", "catalog.manufacturerName", "quantity", "estimatedTotal"]}
                                                    fontSize="12px"
                                                    disableSearch = {true}
                                                    disableMinWidth = {true}
                                                />
                                                </ThemeProvider>
                                            </div>
                                        </Card>
                                        </ThemeProvider>
                                    </div>
                        }
                        <Divider></Divider>
                        <Grid container spacing={10.6} style={{ paddingLeft: "5px", paddingRight: "5px", justify: "flex-end", alignItems: "justify" }}>
                            <Grid item xs={8.5}>
                                <Button variant="contained" size="small" color="secondary" style={{ color: "white" }} onClick={handleCancel} startIcon={<CancelOutlined fontSize="medium"></CancelOutlined>}>
                                    Cancel
                                </Button>
                                &nbsp;
                                <Button variant="contained" size="small" color="secondary" style={{ color: "white" }} onClick={handlePrev} disabled={activeStep == 0} startIcon={<ArrowBackIos fontSize="large"></ArrowBackIos>}>
                                    Back
                                </Button>
                            </Grid>
                            <Grid item xs={3.5}>
                                <Button variant="contained" size="small" color="secondary" style={{ color: "white" }} onClick={handleNext} disabled={
                                    activeStep == steps.length - 1
                                    } endIcon={<ArrowForwardIos fontSize="large"></ArrowForwardIos>}>
                                    Next
                                </Button>
                                &nbsp;
                                <Button variant="contained" size="small" color="primary" disabled={activeStep != steps.length - 1} style={{ color: "white", backgroundColor: colors.buttons.main }} onClick={handleSubmit} endIcon={<DoneAll fontSize="medium"></DoneAll>}>
                                    Confirm
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
            }
        </React.Fragment>
    )
}