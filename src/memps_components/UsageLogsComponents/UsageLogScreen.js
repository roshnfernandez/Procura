import { Box, TextField, Icon, Grid, Autocomplete, Card, Button, IconButton, CardActionArea, Divider, Popper, Fade, InputAdornment, Tooltip } from "@mui/material";
import React from "react";
import ViewAllTable from "memps_components/DynamicTables/table";
import { Abc, AccountCircle, Add, AddCircle, AddCircleOutline, AdfScanner, ArrowBack, CancelOutlined, Checklist, Construction, EventAvailable, EventRepeat, FilterAlt, Functions, ManOutlined, PageviewTwoTone, ReportGmailerrorred, ReportProblem, RunningWithErrors, ScheduleSend, Search, StopCircleOutlined, Today } from "@mui/icons-material";
import MDTypography from "components/MDTypography";
import HeaderAppBar from "memps_components/HeaderBar/HeaderAppBar";
import { Link } from "react-router-dom";
import axios from "axios";
import { KPICard } from "memps_components/ActionCards/kpiCards";
import { PopupForm } from "memps_components/Popup/popupForm";
import { ProviderForm } from "memps_components/ProviderComponents/providerForm";
import colors from "assets/theme/base/colors";
import { Clock } from "memps_components/Clock/clock";
import { usageLogDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import { equipmentDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import { UsageTime } from "memps_components/Clock/usageTime";
import Container from "memps_components/ContentContainers/Container";
import { useMEMPSContext } from "context";


const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const { buttons } = colors;

class UsageLogScreenInner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logs: [],
            open: false,
            currentLog: JSON.parse(JSON.stringify(usageLogDetails)),
            anchorEl: null,
            equipment: [],
            user: "",
            allEquip: []
        }
        this.changeDialogState = this.changeDialogState.bind(this);
        this.compReRender = this.compReRender.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    userId = this.props.userId;
    handleClick(event) {
        this.setState({ anchorEl: event.currentTarget, open: true });
        console.log(this.state);
    }
    compReRender() {
        this.setState();
    }
    startLogging = async () => {
        const logCopy = this.state.currentLog;
        logCopy.createdOn = new Date().getTime();
        logCopy.users = this.state.user;
        await axios.post("http://localhost:1073/trintel/logs", this.state.currentLog).then((response) => { this.setState({ currentLog: response.data, open: false }); this.loadData() })
    }
    loadData = async () => {
        await axios.get("http://localhost:1073/trintel/logs/all/user/" + this.userId).then((response) => { this.setState({ logs: response.data.sort((dl, dr) => Number(dr.logId.match("[0-9]{4}$")[0]) - Number(dl.logId.match("[0-9]{4}$")[0])) }); })
    }
    loadUser = async () => {
        await axios.get("http://localhost:1073/trintel/user/" + this.userId).then((response) => { this.setState({ user: response.data }) })
    }
    loadEquipments = async () => {
        await axios.get("http://localhost:1073/trintel/equipment").then((response) => { this.setState({ equipment: response.data.filter((equip)=>equip.status=="FUNCTIONAL") }) })
    }
    loadAllEquipments = async () => {
        await axios.get("http://localhost:1073/trintel/equipment").then((response) => { this.setState({ allEquip: response.data}) })
    }
    loadCurrentLog = async () => {
        await axios.get("http://localhost:1073/trintel/logs/user/" + this.userId).then((response) => { this.setState({ currentLog: response.data || JSON.parse(JSON.stringify(usageLogDetails)) }); console.log("In curr log",response.data) })
    }
    getFavEquip() {
        const map = new Map();
        this.state.logs.filter(log => Boolean(log.logId)).forEach((log) => {
            map.has(log.equipment.equipmentId) ? map.set(log.equipment.equipmentId, (map.get(log.equipment.equipmentId) + 1)) : map.set(log.equipment.equipmentId, 1);
        })
        var res = [...map].sort((valL, valR) => valR[1] - valL[1]).map(val => val[0])[0];
        return res;
    }
    getHoursLoggedPerDay() {
        var map = new Map();
        this.state.logs.filter(logs => Boolean(logs.hoursUsed)).forEach(logs => {
            map.has(new Date(logs.createdOn).toDateString()) ? map.set(new Date(logs.createdOn).toDateString(), map.get(new Date(logs.createdOn).toDateString()) + 1) : map.set(new Date(logs.createdOn).toDateString(), 1);
        })
        return ([...map].map(val => val[1]).reduce((sum, val) => sum += val, 0) / map.size).toFixed(2) ;
    }
    componentDidMount() {
        this.loadData();
        this.loadAllEquipments();
        this.loadEquipments();
        this.loadUser();
        this.loadCurrentLog();
    }
    changeDialogState(val) {
        this.setState((prevState) => ({ open: val }))
    }
    endSession = async () => {
        const logCopy = this.state.currentLog;
        logCopy.hoursUsed = ((new Date().getTime() - new Date(this.state.currentLog.createdOn).getTime()) / (1000 * 60 * 60)).toFixed(2);
        await axios.post("http://localhost:1073/trintel/logs", this.state.currentLog).then((response) => { this.setState({ currentLog: JSON.parse(JSON.stringify(usageLogDetails)), open: false }); this.loadData() });
    }
    getContent(log) {
        return (
            <React.Fragment>
                <MDTypography style={{ fontSize: "15px" }}>
                    You started using the equipment, {log.equipment.equipmentId}, at {new Date(log.createdOn).toLocaleTimeString()}. {log.noticedProblems == "Y" ? "You noticed problems during your usage, and " : "You had not noticed any problems during the usage, and "}{log.comments ? `"${log.comments}" was your comment.` : "you had given no comment."}
                </MDTypography>
                <br></br>
            </React.Fragment>
        )
    }
    render() {
        const canBeOpen = this.state.open && Boolean(this.state.anchorEl);
        const id = canBeOpen ? "simple-popper" : undefined;
        return (
            <Container>
                <HeaderAppBar />
                <Grid container spacing={4}>
                    <Grid item xs={3}>
                        <KPICard title="Total Logged Hours" value={(this.state.logs.filter(log => Boolean(log.hoursUsed)).map(log => log.hoursUsed).reduce((sum, val) => sum += val, 0)).toFixed(2)} secValue="hrs.">
                            <Functions fontSize="large" style={{ color: buttons.main }} />
                        </KPICard>
                    </Grid>
                    <Grid item xs={3}>
                        <KPICard title="Hours Logged per Day" value={this.getHoursLoggedPerDay() || 0} secValue="hrs.">
                            <EventRepeat fontSize="large" style={{ color: buttons.main }} />
                        </KPICard>
                    </Grid>
                    <Grid item xs={3}>
                        <KPICard title="Today's Hours" value={this.state.logs.filter(log => (new Date(log.createdOn).toDateString() == new Date().toDateString()) && Boolean(log.hoursUsed)).map(log => log.hoursUsed).reduce((sum, val) => sum += val, 0)} secValue={"hrs."}>
                            <Today fontSize="large" style={{ color: buttons.main }} />
                        </KPICard>
                    </Grid>
                    <Grid item xs={3}>
                        <KPICard title="Problems Reported" value={this.state.logs.filter(log => log.noticedProblems == "Y").length} secValue="no.">
                            <ReportGmailerrorred fontSize="large" style={{ color: buttons.main }} />
                        </KPICard>
                    </Grid>
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs={4.2}>
                        <Card style={{ padding: "20px" }}>
                            <MDTypography variant="h1" fontWeight="light">{new Date().getDate()}</MDTypography>
                            <MDTypography variant="h5" fontWeight="light" style={{ marginBottom: "20px" }}>{weekday[new Date().getDay()]}</MDTypography>
                            <hr style={{ color: colors.applicationPrimary, backgroundColor: colors.applicationPrimary, width: "180px", height: "3px", border: "0px", borderRadius: "8px" }}></hr>
                            <MDTypography variant="h6" fontWeight="regular" style={{ marginTop: "15px", fontSize: "15px", marginBottom: "8px" }}>{new Date().toLocaleString('default', { month: 'long' }) + " " + new Date().getFullYear()}</MDTypography>
                            <Clock></Clock>
                            <Divider></Divider>
                            <Tooltip title={this.state.currentLog.logId ? "" : "No equipment is being used right now"} placement="top" arrow={false}>
                                <div>
                                    <Grid container spacing={2}>
                                        <Grid item xs={3.5}>
                                            <MDTypography variant="h6" fontWeight="regular" style={{ fontSize: "15px" }}>Equipment: </MDTypography>
                                        </Grid>
                                        <Grid item xs={8.5}>
                                            <Tooltip title={this.state.currentLog.equipment.catalog.productName ? "The equipment Being Used" : ""} arrow>
                                                <MDTypography variant="h6" fontWeight="regular" style={{ fontSize: "14px" }}>{this.state.currentLog.equipment.catalog.productName ? this.state.currentLog.equipment.catalog.productName + " (" + this.state.currentLog.equipment.equipmentId + ")" : "-"}</MDTypography>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                    <Grid container spacing={2}>
                                        <Grid item xs={3.5}>
                                            <MDTypography variant="h6" fontWeight="regular" style={{ fontSize: "15px" }}>Logged On: </MDTypography>
                                        </Grid>
                                        <Grid item xs={8.5}>
                                            <Tooltip title={this.state.currentLog.logId ? "Usage was started at this point" : ""} arrow>
                                                <MDTypography variant="h6" fontWeight="regular" style={{ fontSize: "14px" }}>{this.state.currentLog.createdOn ? new Date(this.state.currentLog.createdOn).toLocaleDateString() + " - " + new Date(this.state.currentLog.createdOn).toLocaleTimeString() : "-"}</MDTypography>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                </div>
                            </Tooltip>
                            <Grid container spacing={2}>
                                <Grid item xs={3.5}>
                                    <MDTypography variant="h6" fontWeight="regular" style={{ fontSize: "15px" }}>Used For: </MDTypography>
                                </Grid>
                                <Grid item xs={8.5}>
                                    {
                                        this.state.currentLog.createdOn ?
                                            <UsageTime startTime={this.state.currentLog.createdOn}></UsageTime> :
                                            <MDTypography variant="h6" fontWeight="regular" style={{ fontSize: "14px" }}>-</MDTypography>
                                    }
                                </Grid>
                            </Grid>
                            <Button size="small" style={{ color: "white", backgroundColor: colors.buttons.main, alignSelf: "end", marginTop: "15px" }} onClick={this.handleClick}>
                                {this.state.currentLog.logId ? "End Usage" : "Begin Usage"}
                            </Button>
                            <Popper
                                id={this.state.open ? "simple-popper" : undefined} open={this.state.open} anchorEl={this.state.anchorEl}
                                placement="right-start"
                            >
                                {
                                    this.state.currentLog.logId ?
                                        <Card style={{ width: "300px", border: `2px solid ${colors.buttons.main}`, padding: "15px" }}>
                                            <TextField
                                                label="Equipment ID"
                                                fullWidth
                                                size="small"
                                                placeholder="Equipment ID"
                                                value={this.state.currentLog.equipment.equipmentId}
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
                                                value={this.state.currentLog.equipment.catalog.productName}
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
                                            <Autocomplete
                                                value={this.state.currentLog.noticedProblems == "Y" ? "Yes" : "No"}
                                                onChange={(event, newValue) => {
                                                    if (newValue) {
                                                        const logCopy = this.state.currentLog;
                                                        logCopy.noticedProblems = newValue.charAt(0);
                                                        this.setState({ currentLog: logCopy });
                                                        console.log(logCopy);
                                                    }
                                                }}
                                                id="noticedProblems"
                                                name="noticedProblems"
                                                style={{ marginBottom: "15px" }}
                                                options={["Yes", "No"]}
                                                renderInput={(params) => <TextField
                                                    {...params}
                                                    label="Noticed Problems?"
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Yes/No"
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <ReportProblem fontSize="medium" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />}
                                            />
                                            <TextField
                                                label="Comments(Optional)"
                                                fullWidth
                                                size="small"
                                                placeholder="Please Enter your comment here"
                                                multiline
                                                minRows={4}
                                                value={this.state.currentLog.comments}
                                                onChange={(event) => {
                                                    const { name, value } = event.target;
                                                    const logCopy = this.state.currentLog;
                                                    logCopy.comments = value;
                                                    this.setState({ currentLog: logCopy });
                                                    console.log(this.state.currentLog);
                                                }}
                                            />
                                            <Grid container spacing={6.6}>
                                                <Grid item xs={7}>
                                                </Grid>
                                                <Grid item xs={5}>
                                                    <Tooltip title="Cick to close">
                                                        <IconButton onClick={() => this.setState({ open: false })} size="medium" style={{ alignSelf: "end", color: colors.error.main, marginTop: "10px" }}>
                                                            <CancelOutlined />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Cick to end your usage">
                                                        <IconButton onClick={this.endSession} size="medium" style={{ alignSelf: "end", color: colors.buttons.main, marginTop: "10px" }}>
                                                            <StopCircleOutlined />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                        :
                                        <Card style={{ width: "300px", border: `2px solid ${colors.buttons.main}`, padding: "15px" }}>
                                            <Autocomplete
                                                value={this.state.currentLog.equipment.equipmentId}
                                                onChange={(event, newValue) => {
                                                    const logCopy = this.state.currentLog;
                                                    if (newValue == null) {
                                                        logCopy.equipment = JSON.parse(JSON.stringify(equipmentDetails));
                                                    }
                                                    else {
                                                        logCopy.equipment = this.state.equipment.filter((equipment) => equipment.equipmentId == newValue)[0];
                                                    }
                                                    this.setState({ currentLog: logCopy });
                                                }}
                                                id="equipmentId"
                                                name="equipmentId"
                                                style={{ marginBottom: "15px", marginTop: "10px" }}
                                                options={this.state.equipment.map((equipment) => equipment.equipmentId)}
                                                isOptionEqualToValue={(option, value) => option == value}
                                                renderInput={(params) => <TextField
                                                    {...params}
                                                    label="Equipment ID"
                                                    fullWidth
                                                    size="small"
                                                    placeholder="Start typing the Equipment ID... "
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <AdfScanner fontSize="medium" />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                />}
                                            />
                                            <TextField
                                                label="Equipment Name"
                                                fullWidth
                                                size="small"
                                                placeholder="Equipment Name"
                                                value={this.state.currentLog.equipment.catalog.productName}
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <Abc fontSize="medium" />
                                                        </InputAdornment>
                                                    ),
                                                    readOnly: true
                                                }}
                                            />
                                            <Grid container spacing={6.6}>
                                                <Grid item xs={7}>
                                                </Grid>
                                                <Grid item xs={5}>
                                                    <Tooltip title="Cick to close">
                                                        <IconButton onClick={() => this.setState({ open: false, currentLog: JSON.parse(JSON.stringify(usageLogDetails)) })}
                                                            size="medium" style={{ alignSelf: "end", color: colors.error.main, marginTop: "10px" }}>
                                                            <CancelOutlined />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Cick to mark the begining of your usage">
                                                        <IconButton onClick={this.startLogging} size="medium" style={{ alignSelf: "end", color: colors.buttons.main, marginTop: "10px" }}>
                                                            <ScheduleSend />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Grid>
                                            </Grid>
                                        </Card>
                                }
                            </Popper>
                        </Card>
                        <Card style={{ height: "180px", marginTop: "25px", marginBottom: "10px", padding: "20px", paddingTop: "10px", pointerEvents: "none" }}>
                            <MDTypography variant="h6" style={{ fontSize: "16px" }} fontWeight="regular">Most Used Equipment</MDTypography>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop:"20px", fontSize:"55px" }}>
                                <AdfScanner fontSize="inherit" style={{ color: buttons.main }}/>
                                <div>
                                <MDTypography variant="h6" style={{ fontSize: "35px" }} fontWeight="regular">{this.getFavEquip()}</MDTypography>
                                <MDTypography variant="h6" style={{ fontSize: "15px" }} fontWeight="regular">{this.state.allEquip.filter(equipment=>equipment.equipmentId == this.getFavEquip()).map(equipment=>equipment.catalog.productName)[0]}</MDTypography>
                                </div>
                            </div>
                        </Card>
                    </Grid>
                    <Grid item xs={7.8}>
                        <Card style={{ padding: "15px", width: "101.5%" }}>
                            <Grid container spacing={2}>
                                <Grid item xs={10}>
                                    <MDTypography variant="h5">Your Logs</MDTypography>
                                </Grid>
                                <Grid item xs={2}>
                                </Grid>
                            </Grid>
                            <ViewAllTable
                                values={this.state.logs}
                                headers={['ID', 'Logged On', 'Equipment Name', 'Hours Used']}
                                attrib={['logId','createdOn', 'equipment.catalog.productName', 'hoursUsed']}
                                attribToFilter={['logId','equipment.catalog.productName','equipment.equipmentId']}
                                width={[1.5, 3, 4, 2.25]}
                                content={this.getContent}
                                tooltipText = "Search by Log ID, Equipment ID or Equipment Name"
                                disableExpansion = {true}
                                rows={7}
                            ></ViewAllTable>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}

export default function UsageLogScreen(){
    const [controller, dispatch] = useMEMPSContext();
    const {user} = controller;
    return (
        <UsageLogScreenInner userId = {user.userId}/>
    );
}
