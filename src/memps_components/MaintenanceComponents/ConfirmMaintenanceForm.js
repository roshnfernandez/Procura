import { Box, Button, Card, Divider, Grid, InputAdornment, TextField } from "@mui/material";
import { providerDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import React, { useEffect, useState } from "react";
import ScheduleMaintenance from "assets/images/maintenanceImages/ScheduleMaintenanceImage.svg"
import MDTypography from "components/MDTypography";
import { AccountBox, AccountCircle, AdfScanner, AlternateEmail, CancelOutlined, Email, EventNote, LocationCity, Mail, Padding, Person, Person4, Phone, Save, Schedule, Signpost, WhereToVote } from "@mui/icons-material";
import { nameRegex } from "memps_components/RegexString/RegexString";
import { emailRegex } from "memps_components/RegexString/RegexString";
import { phoneRegex } from "memps_components/RegexString/RegexString";
import { addressRegex } from "memps_components/RegexString/RegexString";
import { numberRegex } from "memps_components/RegexString/RegexString";
import axios from "axios";
import { maintenanceDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import { DatePicker, LocalizationProvider, MobileDatePicker, StaticDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import textField from "assets/theme/components/form/textField";
import Calendar from "react-calendar";
import colors from "assets/theme/base/colors";


const calendarFormat = {
    width: "250px"
}
export function ConfirmMaintenanceForm({ onClick, currentMaintenance, initiateRender }) {
    const [maintenance, setMaintenance] = useState(JSON.parse(JSON.stringify(currentMaintenance == null ? maintenanceDetails : currentMaintenance)));
    const [error, setError] = useState("{}");
    const [requestedDate, setRequestedDate] = useState(JSON.parse(JSON.stringify(maintenance)).scheduledStartDate);
    const handleSubmit = async () => {
        console.log(maintenance);
        maintenance.status = "SCHEDULED"
        await axios.post("http://localhost:1072/trintel/maintenance", maintenance).then((response) => { setMaintenance(response.data); initiateRender && initiateRender(); });
        onClick();
    }
    const handleCancel = () => {
        onClick();
    }
    const handleValueChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "technicianName": maintenance.technicianName = value
                if (!(value.match(nameRegex)))
                    setError({ ...error, technicianName: value.length == 0 ? "This is a Required Field" : "Invald Name" });
                else {
                    setError({ ...error, technicianName: null });
                    console.log(maintenance.technicianName);
                }
                break;
                case "technicianEmail": maintenance.technicianEmail = value
                if (!(value.match(emailRegex)))
                    setError({ ...error, technicianEmail: value.length == 0 ? "This is a Required Field" : "Invald Name" });
                else {
                    setError({ ...error, technicianEmail: null });
                    console.log(maintenance.technicianEmail);
                }
                break;
        }
    }
    return (
        <Card style={{ padding: "10px", width: "800px" }}>
            <MDTypography variant="h4">Schedule Maintenance</MDTypography>
            <Divider></Divider>
            <Grid container spacing={4}>
                <Grid item xs={6}>
                    <Card style={{ boxShadow: "none", overflow: "hidden" }}>
                        <img src={ScheduleMaintenance} style={{ height: "350px", margin: "-20px" }}></img>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        name="equipment"
                        variant="outlined"
                        label="Equipment"
                        fullWidth
                        value={maintenance.equipment.catalog.productName + "(" + maintenance.equipment.equipmentId + ")"}
                        style={{ marginBottom: "15px", marginTop: "10px" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AdfScanner fontSize="medium" />
                                </InputAdornment>
                            ),
                            readOnly: "true"
                        }}
                        placeholder="EQXXXX"
                        required
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            value={dayjs(new Date(requestedDate))}
                            label="Requested Date"
                            readOnly
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: "outlined",
                                    InputProps: { 
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EventNote fontSize="medium" />
                                            </InputAdornment>
                                        )
                                    },
                                    style:{ marginBottom: "15px" }
                                }
                            }}
                        />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileDatePicker
                            value={dayjs(new Date(maintenance.scheduledStartDate))}
                            onChange={(value) => {
                                const maintenanceCopy = maintenance;
                                maintenanceCopy.scheduledStartDate = value.toDate().getTime();
                                setMaintenance(maintenanceCopy);

                            }}
                            label="Schedule For"
                            slotProps={{
                                textField: {
                                    fullWidth: true,
                                    variant: "outlined",
                                    InputProps: { 
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EventNote fontSize="medium" />
                                            </InputAdornment>
                                        )
                                    },
                                    style:{ marginBottom: "15px" }
                                }
                            }}
                        />
                    </LocalizationProvider>
                    <TextField
                        name="technicianName"
                        variant="outlined"
                        label="Technician Name"
                        fullWidth
                        value={maintenance.technicianName}
                        error={error["technicianName"]}
                        helperText={error["technicianName"]}
                        onChange={handleValueChange}
                        style={{ marginBottom: "15px" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person fontSize="medium"/>
                                </InputAdornment>
                            ),
                        }}
                        placeholder="Eg. Steve Smith"
                        required
                    />
                    <TextField
                        name="technicianEmail"
                        variant="outlined"
                        label="Technician Email"
                        fullWidth
                        error={error["technicianEmail"]}
                        helperText={error["technicianEmail"]}
                        value={maintenance.technicianEmail}
                        onChange={handleValueChange}
                        style={{ marginBottom: "15px" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AlternateEmail fontSize="medium"/>
                                </InputAdornment>
                            )
                        }}
                        placeholder="Eg. steve.smith@email.com"
                        required
                    />
                </Grid>
            </Grid>
            <Divider></Divider>
            <Grid container spacing={2.6} style={{ paddingLeft: "5px", paddingRight: "5px", justify: "flex-end", alignItems: "justify" }}>
                <Grid item xs={10}>
                    <Button variant="contained" size="small" color="secondary" style={{ color: "white" }} onClick={handleCancel} startIcon={<CancelOutlined fontSize="medium"></CancelOutlined>}>
                        Cancel
                    </Button>
                </Grid>
                <Grid item xs={1}>
                    <Button variant="contained" size="small" color="primary" style={{ color: "white", backgroundColor: colors.buttons.main }} onClick={handleSubmit} startIcon={<Schedule fontSize="medium"></Schedule>}>
                        Schedule
                    </Button>
                </Grid>
            </Grid>
        </Card>
    )
}