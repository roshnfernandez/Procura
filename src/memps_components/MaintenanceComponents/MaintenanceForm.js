import { Autocomplete, Box, Button, Card, createTheme, Divider, Grid, InputAdornment, TextField } from "@mui/material";
import { providerDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import React, { useEffect, useState } from "react";
import ScheduleMaintenance from "assets/images/maintenanceImages/ScheduleMaintenanceImage.svg"
import MDTypography from "components/MDTypography";
import { AccountBox, AccountCircle, AdfScanner, AlternateEmail, CancelOutlined, Email, LocationCity, Mail, Padding, Person, Person4, Phone, Save, Signpost, WhereToVote } from "@mui/icons-material";
import axios from "axios";
import { maintenanceDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import { CalendarIcon, DateCalendar, DatePicker, LocalizationProvider, MobileDatePicker, StaticDatePicker, StaticDateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import Calendar from "react-calendar";
import colors from "assets/theme/base/colors";
import { ThemeProvider } from "@emotion/react";
import { ActionSuccessfulScreen } from "memps_components/ConfirmationScreen/confirmationScreen";


const calendarFormat = {
    width: "250px"
}
const newTheme = (theme) => createTheme({
    ...theme,
    components: {
        MuiDateCalendar: {
            styleOverrides: {
                root: {
                    borderRadius: '8px',
                    borderColor: '#2196f3',
                    color: "white",
                    backgroundColor: colors.grey["600"],
                    height: "285px",
                    marginTop: "5px"
                }
            }
        },
        MuiDayCalendar: {
            styleOverrides: {
                root: {
                    backgroundColor: "rgba(240,242,245,0.95)",
                }
            }
        },
        MuiPickersDay: {
            root: {
                selected: {
                    backgroundColor: colors.applicationPrimary
                }
            }
        }
    }
})
export function MaintenanceForm({ onClick, currentMaintenance, initiateRender, equipment }) {
    const [maintenance, setMaintenance] = useState(JSON.parse(JSON.stringify(currentMaintenance == null ? maintenanceDetails : currentMaintenance)));
    const [error, setError] = useState("{}");
    const [equipments, setEquipments] = useState([]);
    const [scheduledStartDate, setScheduleStartDate] = useState();
    const [success, setSuccess] = useState(false);
    const loadEquipments = async () => {
        await axios.get("http://localhost:1071/trintel/maintenance/eligible/equipment").then((response) => { setEquipments(response.data)})
    }
    useEffect(
        () => {
            if (equipment) {
                maintenance.equipment = equipment;
                setMaintenance(maintenance);
            }
            loadEquipments();
        },
        []
    )

    const handleSubmit = async () => {
        console.log(maintenance);
        await axios.post("http://localhost:1071/trintel/maintenance", maintenance).then((response) => { setMaintenance(response.data); setSuccess(true) });
        //onClick();
    }
    const handleCancel = () => {
        onClick();
    }

    return (
        <React.Fragment>
            {
                success ?
                    <ActionSuccessfulScreen record={"Maintenance"} pk={maintenance.id} summaryURL="/maintenance/" onClick={()=>{initiateRender(); onClick()}} /> :
                    <Card style={{ padding: "10px", width: "950px"}}>
                        <MDTypography variant="h4">&nbsp;Schedule Maintenance</MDTypography>
                        <Divider style={{ marginBottom: "6px", marginTop: "4px" }} />
                        <Grid container spacing={4}>
                            <Grid item xs={5}>
                                <Card style={{ boxShadow: "none", overflow: "hidden" }}>
                                    <img src={ScheduleMaintenance} style={{ height: "350px", margin: "20px" }}></img>
                                </Card>
                            </Grid>
                            <Grid item xs={7}>
                                <Autocomplete
                                    value={maintenance.equipment.equipmentId}
                                    onChange={(event, newValue) => {
                                        if (newValue == null) {
                                            setMaintenance({...maintenance, equipment: {equipmentId:null}});
                                        }
                                        else {
                                            setMaintenance({...maintenance, equipment:equipments.filter((equipment) => equipment.equipmentId == newValue)[0]});
                                        }
                                    }}
                                    id="equipmentId"
                                    name="equipmentId"
                                    style={{ marginBottom: "5px", marginTop: "10px" }}
                                    options={equipments.map((equipment) => equipment.equipmentId)}
                                    isOptionEqualToValue={(option, value) => option == value}
                                    required
                                    renderInput={(params) => <TextField
                                        {...params}
                                        label="Equipment Id"
                                        fullWidth
                                        size="medium"
                                        placeholder="EQXXXX"
                                        InputProps={{
                                            ...params.InputProps,
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AdfScanner fontSize="medium" />
                                                </InputAdornment>
                                            ),
                                            readOnly: Boolean(equipment)
                                        }}
                                        style={{width : "300px"}}
                                    />}
                                />
                                <fieldset style={{ border: `0.5px solid ${colors.grey["400"]}`, borderRadius: "6px", width: "520px" }}>
                                    <legend style={{ marginLeft: "8px", fontSize: "12.5px", color: colors.grey["600"] }}>&nbsp; Request Maintenance On *&nbsp;</legend>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <ThemeProvider theme={newTheme}>
                                            <StaticDateTimePicker
                                                orientation="landscape"
                                                disablePast
                                                showDaysOutsideCurrentMonth
                                                value={dayjs(new Date(maintenance.scheduledStartDate))}
                                                maxDate={dayjs(new Date().setDate(new Date().getDate() + 45))}
                                                onChange={(value) => {
                                                    setMaintenance({ ...maintenance, scheduledStartDate: value.toDate().getTime() });
                                                }}
                                                slotProps={{
                                                    toolbar: {
                                                        toolbarFormat: 'DD, MMM',
                                                        toolbarPlaceholder: '__ , ___',
                                                        toolbarTitle: "",
                                                        sx: {
                                                            height: "300px",
                                                            width:"500px"
                                                        }
                                                    },
                                                    actionBar: {
                                                        actions: [''],
                                                    },
                                                    tabs:{
                                                        hidden: true,
                                                        sx: {
                                                            height: "10px"
                                                        }
                                                    },
                                                    yearButton: {
                                                        hidden: true
                                                    }
                                                }}
                                                sx={{ borderRadius: "10px", }}
                                            />
                                        </ThemeProvider>
                                    </LocalizationProvider>
                                </fieldset>
                            </Grid>
                        </Grid>
                        <Divider></Divider>
                        <Grid container spacing={10} style={{ paddingLeft: "5px", paddingRight: "5px", justify: "flex-end", alignItems: "justify", marginTop: "-85px" }}>
                            <Grid item xs={10}>
                                <Button variant="contained" size="small" color="secondary" style={{ color: "white" }} onClick={handleCancel} startIcon={<CancelOutlined fontSize="medium"></CancelOutlined>}>
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid item xs={1}>
                                <Button variant="contained" size="small" color="primary" style={{ color: "white", backgroundColor: colors.buttons.main }} onClick={handleSubmit} startIcon={<Save fontSize="medium"></Save>}>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Card>
            }
        </React.Fragment>
    )
}