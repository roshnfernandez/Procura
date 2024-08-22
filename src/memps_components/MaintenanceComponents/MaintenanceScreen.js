import { Box, TextField, Icon, Grid, Autocomplete, Card, Button, IconButton, CardActionArea } from "@mui/material";
import React from "react";
import ViewAllTable from "memps_components/DynamicTables/table";
import { AccountCircle, Add, AddCircle, AddCircleOutline, ArrowBack, AssignmentTurnedIn, BuildCircle, Checklist, Construction, EventAvailable, FilterAlt, PageviewTwoTone, RunningWithErrors, Search } from "@mui/icons-material";
import MDTypography from "components/MDTypography";
import HeaderAppBar from "memps_components/HeaderBar/HeaderAppBar";
import { Link } from "react-router-dom";
import axios from "axios";
import { KPICard } from "memps_components/ActionCards/kpiCards";
import { PopupForm } from "memps_components/Popup/popupForm";
import colors from "assets/theme/base/colors";
import { MaintenanceForm } from "./MaintenanceForm";
import Container from "memps_components/ContentContainers/Container";
import { useMEMPSContext } from "context";


const {buttons} = colors;
class MaintenanceScreenInner extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            maintenance: [],
            open: false,
            role: this.props.role
        }
        this.changeDialogState = this.changeDialogState.bind(this);
        this.compReRender = this.compReRender.bind(this);
    }
    compReRender(){
        this.loadData();
    }
    loadData = async () =>{
        await axios.get(this.state.role == "HOSPITAL"?"http://localhost:1071/trintel/maintenance":"http://localhost:1072/trintel/maintenance/provider/" + this.props.user).then((response)=>{
            this.setState(
                {maintenance: response.data.sort((ml,mr)=>mr.id.match("[0-9]{4}$")[0] - ml.id.match("[0-9]{4}$")[0])}
            )
        })
    }
    componentDidMount(){
        this.loadData();
    }
    changeDialogState(val){
        this.setState((prevState)=>({open: val}))
    }
    getAverageEquipmentDowntime(){
        var length = this.state.maintenance.filter(maintenance=>maintenance.status =="COMPLETED").length;
        var sum = this.state.maintenance.filter(maintenance=>maintenance.status =="COMPLETED").map(maintenance=>(new Date(maintenance.serviceCompletionDate).getTime() - new Date(maintenance.serviceStartDate).getTime())/(1000 * 60 * 60 * 24)).reduce((sum,val)=>sum+=val,0);
        var res = (sum/length).toFixed(2);
        return isNaN(res)? "- " : res;
    }
    getAverageScheduleStartGap(){
        var length = this.state.maintenance.filter(maintenance=>maintenance.status =="STARTED" || maintenance.status =="COMPLETED").length;
        var sum = this.state.maintenance.filter(maintenance=>maintenance.status =="STARTED" || maintenance.status =="COMPLETED").map(maintenance=>(new Date(maintenance.serviceStartDate).getTime() - new Date(maintenance.scheduledStartDate).getTime())/(1000 * 60 * 60 * 24)).reduce((sum,val)=>sum+=val,0);
        var res = (sum/length).toFixed(2);
        return isNaN(res)? "- " : res;
    }
    getContent(maintenance) {
        return (
            <React.Fragment>
                <MDTypography style={{ fontSize: "15px" }}>
                    This Maintenance ({maintenance.id}) was initiated for {maintenance.equipment.catalog.productName} ({maintenance.equipment.equipmentId}). 
                    {
                        maintenance.status=="INITIATED"?
                        ` The supplier (${maintenance.equipment.providers.providerName}) is yet to confirm the schedule.`
                        :
                        maintenance.status=="SCHEDULED"?
                        ` The task has been assigned to ${maintenance.technicianName}, an employee of ${maintenance.equipment.providers.providerName}`
                        :
                        ` It was performed by ${maintenance.technicianName}, an employee of ${maintenance.equipment.providers.providerName} on ${new Date(maintenance.serviceStartDate).toDateString()}(${new Date(maintenance.serviceStartDate).toLocaleTimeString()})`
                    }
                </MDTypography>
                <MDTypography style={{ fontSize: "15px" }}>
                    <u><Link to={"/maintenance/" + maintenance.id}>Click here</Link></u> to know more about the Record.
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
                        <KPICard title="Scheduled Services" value={this.state.maintenance.filter(maintenance=>maintenance.status =="SCHEDULED").length} secValue="no.">
                            <EventAvailable fontSize="large" style={{color: buttons.main}}></EventAvailable>
                        </KPICard>
                    </Grid>
                    <Grid item xs={3}>
                        <KPICard title="Completed Services" value={this.state.maintenance.filter(maintenance=>maintenance.status =="COMPLETED").length} secValue="no.">
                            <Checklist fontSize="large" style={{color: buttons.main}}/>
                        </KPICard>
                    </Grid>
                    <Grid item xs={3}>
                        <KPICard title="Avg. Equipment Downtime" value={this.getAverageEquipmentDowntime()} secValue={this.getAverageEquipmentDowntime()==1? "day":"days"}>
                            <RunningWithErrors fontSize="large" style={{color: buttons.main}}/>
                        </KPICard>
                    </Grid>
                    <Grid item xs={3}>
                        <KPICard title="Avg. Schedule - Start Gap" value={this.getAverageScheduleStartGap()} secValue="days">
                            <Construction fontSize="large" style={{color: buttons.main}}/>
                        </KPICard>
                    </Grid>
                </Grid>
                    <Card style={{padding:"15px", width: "101.1%"}}>
                        <Grid container spacing={10.4} style={{marginBottom: "2px"}}>
                            <Grid item xs={10}>
                                <MDTypography variant="h5">Equipment Maintenance Requests</MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" size="small" style={{color: "white", backgroundColor: buttons.main, display: this.state.role != "HOSPITAL"?"none":""}} onClick={()=>this.changeDialogState(true)} startIcon={<AddCircleOutline fontSize="medium"></AddCircleOutline>}>
                                    initiate
                                </Button>
                                <PopupForm open={this.state.open} onClose={()=>this.changeDialogState(false)} givenKey={1}>
                                    <MaintenanceForm onClick = {()=>this.changeDialogState(false)} initiateRender={()=>this.compReRender()}></MaintenanceForm>
                                </PopupForm>
                            </Grid>
                        </Grid>
                        <ViewAllTable
                            values={this.state.maintenance}
                            headers={['ID','Equipment', 'Scheduled For', 'Completed On', 'Status']}
                            attrib={['id','equipment.catalog.productName(equipment.equipmentId)', 'scheduledStartDate','serviceCompletionDate','status']}
                            attribToFilter={['id','status','equipment.equipmentId','equipment.catalog.productName']}
                            width={[1.5,3.25,2,2.25,2]}
                            content={this.getContent}
                            apiLink="http://localhost:1071/trintel/maintenance"
                            tooltipText = "Search by ID, Equipment ID, Equipment Name or Status"
                        ></ViewAllTable>
                    </Card>
            </Container>
        );
    }
}

export default function MaintenanceScreen(){
    const [controller] = useMEMPSContext();
    const { role,user } = controller;
    console.log(role);
    return(
        <MaintenanceScreenInner role={role} user={user.userId}></MaintenanceScreenInner>
    )
}