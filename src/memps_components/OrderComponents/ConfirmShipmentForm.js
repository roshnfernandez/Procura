import { Table, TableCell } from "@material-ui/core";
import { CancelOutlined, DoneAll } from "@mui/icons-material";
import { Button, Card, Divider, Grid, TableBody, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import axios from "axios";
import MDTypography from "components/MDTypography";
import dayjs from "dayjs";
import { equipmentDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import { numberRegex } from "memps_components/RegexString/RegexString";
import { useState } from "react";

export function ConfirmShipmentForm({ onClick, currentOrder, initiateRender }) {
    const [equipment, setEquiment] = useState(currentOrder.orderItems.map((orderItem) => {
        const equipment = JSON.parse(JSON.stringify(equipmentDetails));
        equipment.orderNum = currentOrder.orderNum,
        equipment.catalog = orderItem.catalog;
        equipment.providers = currentOrder.providers;
        return equipment;
    }));
    const[order,setOrder] = useState(JSON.parse(JSON.stringify(currentOrder)));
    const [orderItems, setOrderItems] = useState(order.orderItems);
    const [error, setError] = useState({});

    const handleSubmit = async () => {
        const orderDup = order;
        orderDup.orderStatus = "SHIPPED";
        orderDup.shippedOn = new Date().getTime();
        orderDup.actualTotal = orderItems.map((orderItem) => orderItem.actualTotal).reduce((sum, value) => sum += Number.parseInt(value || 0), 0);
        setOrder(orderDup);
        console.log(equipment);
        onClick();
        const allEquipment =  orderItems.map((orderItem,index)=>{
            var res = [];
            for(var i = 0; i< orderItem.quantity; i++){
                res.push(equipment[index]);
            }
            return res;
        }).flat();
        await axios.post("http://localhost:1072/trintel/orders", order).then((response) => { setOrder(response.data) });
        await axios.post("http://localhost:1072/trintel/equipment/addAll", allEquipment).then((response)=>{initiateRender && initiateRender();});
    }
    const handleCancel = () => {
        onClick();
    }
    return (
        <Card style={{ padding: "15px", width: "1200px" }}>
            <MDTypography variant="h4">Confirm Shipment</MDTypography>
            <Divider></Divider>
            <div style={{ paddingLeft: "0.5%", paddingRight: "0.5%", minHeight: "280px" }}>
                <TableContainer style={{ borderRadius: "5px" }}>
                    <Table>
                        <TableHead sx={{ display: "table-header-group", background: "linear-gradient(#1d403c, #25524c)" }}>
                            <TableRow>
                                <TableCell width="16%">
                                    <MDTypography variant="h6" color="white">Product Name</MDTypography>
                                </TableCell>
                                <TableCell width="8%">
                                    <MDTypography variant="h6" color="white">Quantity</MDTypography>
                                </TableCell>
                                <TableCell>
                                    <MDTypography variant="h6" color="white">Manufactured On</MDTypography>
                                </TableCell>
                                <TableCell>
                                    <MDTypography variant="h6" color="white">Service Duration(In Days)</MDTypography>
                                </TableCell>
                                <TableCell>
                                    <MDTypography variant="h6" color="white">Service Duration(In Hours)</MDTypography>
                                </TableCell>
                                <TableCell>
                                    <MDTypography variant="h6" color="white">Estimated Total</MDTypography>
                                </TableCell>
                                <TableCell>
                                    <MDTypography variant="h6" color="white">Actual Total</MDTypography>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                orderItems.map(
                                    (orderItem, index) => {
                                        const indexEven = index % 2 == 0;
                                        const orderItemCopy = [...orderItems];
                                        const equipmentCopy = [...equipment];
                                        const handleChange = (event) => {
                                            const { name, value } = event.target;
                                            console.log("In handler");
                                            switch (name) {
                                                case "serviceDurationInDays" + index:
                                                    if (!(value.match(numberRegex))) {
                                                        setError({ ...error, ["serviceDurationInDays" + index]: value ? "Value should be a number" : "Duration cannot be empty" });
                                                        equipmentCopy[index].serviceDurationInDays = value;
                                                        setEquiment(equipmentCopy);
                                                    }
                                                    else {
                                                        setError({ ...error, ["serviceDurationInDays" + index]: null });
                                                        equipmentCopy[index].serviceDurationInDays = value;
                                                        setEquiment(equipmentCopy);
                                                        console.log("Handled");
                                                    }
                                                    break;
                                                case "serviceDurationInHoursUsed" + index:
                                                    if (!(value.match(numberRegex))) {
                                                        setError({ ...error, ["serviceDurationInHoursUsed" + index]: value ? "Value should be a number" : "Duration cannot be empty" });
                                                        equipmentCopy[index].serviceDurationInHoursUsed = value;
                                                        setEquiment(equipmentCopy);
                                                    }
                                                    else {
                                                        setError({ ...error, ["serviceDurationInHoursUsed" + index]: null });
                                                        equipmentCopy[index].serviceDurationInHoursUsed = value < 1 ? 1 : value;
                                                        setEquiment(equipmentCopy);
                                                        console.log("Handled");
                                                    }
                                                    break;
                                                case "actualTotal" + index:
                                                    if (!(value.match(numberRegex))) {
                                                        setError({ ...error, ["actualTotal" + index]: value ? "Total should be a number" : "Total cannot be empty" });
                                                        orderItemCopy[index].actualTotal = value;
                                                    }
                                                    else {
                                                        setError({ ...error, ["actualTotal" + index]: null });
                                                        orderItemCopy[index].actualTotal = value;
                                                        equipmentCopy[index].cost = value / orderItemCopy[index].quantity;
                                                        setOrderItems(orderItemCopy)
                                                        setEquiment(equipmentCopy);
                                                        // orderItemCopy[index].estimatedTotal = orderItemCopy[index].catalog ? orderItemCopy[index].catalog.markedPrice * value : 0;
                                                        // setOrderItems(orderItemCopy);
                                                        console.log(equipment[index]);
                                                    }
                                                    break;
                                            }
                                        }
                                        return (
                                            <TableRow style={{ backgroundColor: indexEven ? "#FFFFFF" : "#f7f7f7" }}>
                                                <TableCell>
                                                    <TextField
                                                        name="name"
                                                        variant="standard"
                                                        fullWidth
                                                        value={orderItem.catalog.productName}
                                                        InputProps={{
                                                            disableUnderline: true,
                                                            readOnly: true
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        name="quantity"
                                                        variant="standard"
                                                        fullWidth
                                                        value={orderItem.quantity}
                                                        InputProps={{
                                                            disableUnderline: true,
                                                            readOnly: true
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                        <MobileDatePicker
                                                            value={dayjs(new Date(equipment[index].manufacturedOn))}
                                                            disableFuture
                                                            onChange={(value) => {
                                                                equipmentCopy[index].manufacturedOn = value.toDate().getTime();
                                                                setEquiment(equipmentCopy);

                                                            }}
                                                            slotProps={{
                                                                textField: {
                                                                    fullWidth: true,
                                                                    variant: "standard",
                                                                    InputProps: { disableUnderline: true }
                                                                }
                                                            }}
                                                        />
                                                    </LocalizationProvider>
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        value={equipment[index].serviceDurationInDays}
                                                        onChange={handleChange}
                                                        name={"serviceDurationInDays" + index}
                                                        placeholder="In Days"
                                                        variant="standard"
                                                        fullWidth
                                                        helperText={error["serviceDurationInDays" + index]}
                                                        error={error["serviceDurationInDays" + index]}
                                                        InputProps={{
                                                            disableUnderline: true,
                                                            fullWidth: true
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        value={equipment[index].serviceDurationInHoursUsed}
                                                        onChange={handleChange}
                                                        name={"serviceDurationInHoursUsed" + index}
                                                        placeholder="In Hours"
                                                        variant="standard"
                                                        fullWidth
                                                        helperText={error["serviceDurationInHoursUsed" + index]}
                                                        error={error["serviceDurationInHoursUsed" + index]}
                                                        InputProps={{
                                                            disableUnderline: true,
                                                            fullWidth: true
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        name="estimatedTotal"
                                                        variant="standard"
                                                        fullWidth
                                                        value={orderItem.estimatedTotal}
                                                        InputProps={{
                                                            disableUnderline: true,
                                                            readOnly: true
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <TextField
                                                        name={"actualTotal" + index}
                                                        variant="standard"
                                                        value={orderItem.actualTotal}
                                                        onChange={handleChange}
                                                        placeholder="In Rupees"
                                                        fullWidth
                                                        helperText={error["actualTotal" + index]}
                                                        error={error["actualTotal" + index]}
                                                        InputProps={{
                                                            disableUnderline: true,
                                                        }}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        )
                                    }
                                )
                            }
                            <TableRow>
                                <TableCell>
                                    <MDTypography variant="h6" style={{ marginLeft: "1px", fontSize: "15px" }}>Order Total</MDTypography>
                                </TableCell>
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell />
                                <TableCell>
                                    <MDTypography variant="h6" style={{ marginLeft: "1px", fontSize: "15px" }}>
                                        {orderItems.map((orderItem) => orderItem.actualTotal).reduce((sum, value) => sum += Number.parseInt(value || 0), 0)}
                                    </MDTypography>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <Divider></Divider>
            <Grid container spacing={13} style={{ paddingLeft: "5px", paddingRight: "5px", justify: "flex-end", alignItems: "justify" }}>
                <Grid item xs={10}>
                    <Button variant="contained" size="small" color="secondary" style={{ color: "white" }} onClick={handleCancel} startIcon={<CancelOutlined fontSize="medium"></CancelOutlined>}>
                        Cancel
                    </Button>
                </Grid>
                <Grid item xs={1}>
                    <Button variant="contained" size="small" color="primary" style={{ color: "white", backgroundColor: "#00203f" }} onClick={handleSubmit} startIcon={<DoneAll fontSize="medium"></DoneAll>}>
                        Confirm
                    </Button>
                </Grid>
            </Grid>
        </Card>
    )
}