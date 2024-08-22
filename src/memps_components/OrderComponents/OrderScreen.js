import { Box, TextField, Icon, Grid, Autocomplete, Card, Button, IconButton, CardActionArea } from "@mui/material";
import React from "react";
import ViewAllTable from "memps_components/DynamicTables/table";
import { AccountCircle, Add, AddCircle, AddCircleOutline, AllInbox, ArrowBack, AssignmentTurnedIn, BuildCircle, EventAvailable, FilterAlt, HourglassBottom, LocalShipping, PageviewTwoTone, Pending, RemoveShoppingCart, Search, Timeline, TrendingDown } from "@mui/icons-material";
import MDTypography from "components/MDTypography";
import HeaderAppBar from "memps_components/HeaderBar/HeaderAppBar";
import { Link } from "react-router-dom";
import axios from "axios";
import { KPICard } from "memps_components/ActionCards/kpiCards";
import { PopupForm } from "memps_components/Popup/popupForm";
import colors from "assets/theme/base/colors";
import { OrderForm } from "./OrderForm";
import Container from "memps_components/ContentContainers/Container";
import { ClockIcon } from "@mui/x-date-pickers";
import { useMEMPSContext } from "context";
import { ActionSuccessfulScreen } from "memps_components/ConfirmationScreen/confirmationScreen";


const { buttons } = colors;
class OrderScreenInner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            open: false,
            orderKPI: ""
        }
        this.changeDialogState = this.changeDialogState.bind(this);
    }
    loadData = async () => {
        await axios.get(this.props.role == "HOSPITAL" ? "http://localhost:1071/trintel/orders" : "http://localhost:1072/trintel/orders/provider/" + this.props.user).then((response) => { this.setState({ orders: response.data }); console.log("In Parent", response.data) })
    }
    getOrderKPIs = async () => {
        await axios.get(
            this.props.role == "HOSPITAL" ? 
            "http://localhost:1071/trintel/orders/kpi" : "http://localhost:1072/trintel/orders/kpi/" + this.props.user
        ).then((response) => this.setState({ orderKPI: response.data }));
    }
    componentDidMount() {
        this.loadData();
        this.getOrderKPIs();
    }
    changeDialogState(val) {
        this.setState((prevState) => ({ open: val }))
    }
    getContent(order) {
        const itemLength = order.orderItems.length;
        return (
            <React.Fragment>
                <MDTypography style={{ fontSize: "15px" }}>
                    This Order ({order.orderNum}) was created for {itemLength} {itemLength == 1 ? "item" : "items"}, on {new Date(order.orderedOn).toLocaleDateString()}. The estimated total for the order is {order.estimatedTotal} and {order.billNumber ? "its bill number is " + order.billNumber : "it is yet to be billed."}
                </MDTypography>
                <MDTypography style={{ fontSize: "15px" }}>
                    <u><Link to={"/orders/" + order.orderNum}>Click here</Link></u> to know more about the Order.
                </MDTypography>
                <br></br>
            </React.Fragment>
        )
    }
    render() {
        return (
            <Container>
                <HeaderAppBar />
                <Grid container spacing={4}>
                    <Grid item xs={3}>
                        <KPICard title="Orders Awaiting Delivery" value={this.state.orders.filter(order => order.orderStatus == "SHIPPED").length} secValue="no.">
                            <Pending fontSize="large" style={{ color: buttons.main }} />
                        </KPICard>
                    </Grid>
                    <Grid item xs={3}>
                        {
                            this.props.role == "HOSPITAL" ?
                                <KPICard title="Order Estimate Deviation" value={Number(this.state.orderKPI.split("@#$")[0]).toFixed(2)||" - "} secValue="Rs.">
                                    <Timeline fontSize="large" style={{ color: buttons.main }} />
                                </KPICard> :
                                <KPICard title="Cancelled Orders" value={this.state.orders.filter(order=>order.orderStatus == "CANCELLED").length} secValue="no.">
                                    <RemoveShoppingCart fontSize="large" style={{ color: buttons.main }} />
                                </KPICard>
                        }

                    </Grid>
                    <Grid item xs={3}>
                        <KPICard title="Avg. Delivery Time" value={this.state.orderKPI.split("@#$")[this.props.role == "HOSPITAL" ? 2: 1] || " - "} secValue="days">
                            <ClockIcon fontSize="large" style={{ color: buttons.main }} />
                        </KPICard>
                    </Grid>
                    <Grid item xs={3}>
                        <KPICard title="Avg. Shipping Time" value={this.state.orderKPI.split("@#$")[this.props.role == "HOSPITAL" ? 1: 0] || " - "} secValue="days">
                            <LocalShipping fontSize="large" style={{ color: buttons.main }} />
                        </KPICard>
                    </Grid>
                </Grid>
                <Card style={{ padding: "15px", width: "101.1%" }}>
                    <Grid container spacing={11}>
                        <Grid item xs={10}>
                            <MDTypography variant="h5">Your Orders</MDTypography>
                        </Grid>
                        <Grid item xs={2}>
                            <Button variant="contained" size="small" style={{ color: "white", backgroundColor: buttons.main, display: this.props.role == "HOSPITAL" ? "" : "none" }} onClick={() => this.changeDialogState(true)} startIcon={<AddCircleOutline fontSize="medium"></AddCircleOutline>}>
                                Create
                            </Button>
                            <PopupForm open={this.state.open} onClose={() => this.changeDialogState(false)} givenKey={1}>
                                <OrderForm onClick={() => this.changeDialogState(false)} reloadData = {()=>{this.loadData(); this.changeDialogState(false);}}></OrderForm>
                            </PopupForm>
                        </Grid>
                    </Grid>
                    <ViewAllTable
                        values={this.state.orders}
                        headers={['Order Number', 'Ordered On', 'Supplier', 'Status']}
                        attrib={['orderNum', 'orderedOn', 'providers.providerName', 'orderStatus']}
                        attribToFilter={['orderNum','orderStatus','providers.providerName']}
                        width={[2, 3, 3, 3]}
                        content={this.getContent}
                        tooltipText = "Search by Order Number, Order Status or Supplier Name"
                    ></ViewAllTable>
                </Card>
            </Container>
        );
    }
}
export default function OrderScreen() {
    const [controller, dispatch] = useMEMPSContext();
    const { role, user } = controller;
    return (
        <OrderScreenInner role={role} user ={user.userId}/>
    )
}