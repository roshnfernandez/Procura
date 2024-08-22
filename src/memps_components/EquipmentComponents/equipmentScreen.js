import { Grid, Card, Button, } from "@mui/material";
import React from "react";
import ViewAllTable from "memps_components/DynamicTables/table";
import { AddCircleOutline, AdfScanner, AssignmentTurnedIn, BuildCircle, Construction, EventAvailable, HourglassBottom, LocalShipping, PriorityHighRounded } from "@mui/icons-material";
import MDTypography from "components/MDTypography";
import HeaderAppBar from "memps_components/HeaderBar/HeaderAppBar";
import axios from "axios";
import { KPICard } from "memps_components/ActionCards/kpiCards";
import { PopupForm } from "memps_components/Popup/popupForm";
import { ProviderForm } from "memps_components/ProviderComponents/providerForm";
import Container from "memps_components/ContentContainers/Container";
import { Link } from "react-router-dom";
import colors from "assets/theme/base/colors";
import { equipmentDetails } from "memps_components/ObjectContainerStructure/containerStructure";


const { buttons } = colors;
export default class EquipmentScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            equipments: [],
            open: false,
            equipmentKPI: ""
        }
        this.changeDialogState = this.changeDialogState.bind(this);
        this.compReRender = this.compReRender.bind(this);
    }
    
    compReRender() {
        this.setState();
    }
    loadData = async () => {
        await axios.get("http://localhost:1071/trintel/equipment").then((response) => { this.setState({ equipments: response.data }); console.log("In Parent", response.data) })
    }
    getKPIs = async () =>{
        await axios.get("http://localhost:1071/trintel/equipment/kpi").then(response=>{this.setState({equipmentKPI: response.data}); console.log(response.data)});
    }
    componentDidMount() {
        this.loadData(); this.getKPIs();
    }
    changeDialogState(val) {
        this.setState((prevState) => ({ open: val }))
    }
    getContent(equipment) {
        return (
            <React.Fragment>
                <MDTypography style={{ fontSize: "15px" }}>
                    This Equipment ({equipment.equipmentId}) was purchased on {new Date(equipment.purchasedOn).toLocaleDateString()} from {equipment.providers.providerName} ({equipment.providers.providerId}) for {equipment.cost}.
                </MDTypography>
                <MDTypography style={{ fontSize: "15px" }}>
                    <u><Link to={"/equipment/" + equipment.equipmentId}>Click here</Link></u> to know more about the Equipment.
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
                        <KPICard title="Equipment Being Used" value={this.state.equipmentKPI.split("@#$")[0]} secValue="no.">
                            <AdfScanner fontSize="large" style={{ color: buttons.main }}/>
                        </KPICard>
                    </Grid>
                    <Grid item xs={3}>
                        <KPICard title="Equipment Being Serviced" value={this.state.equipments.filter(equipment=>equipment.status == "UNDER_MAINTENANCE").length} secValue="no.">
                            <Construction fontSize="large" style={{ color: buttons.main }}/>
                        </KPICard>
                    </Grid>
                    <Grid item xs={3}>
                        <KPICard title="Today's Equipment Usage" value={this.state.equipmentKPI.split("@#$")[1]} secValue="hrs">
                            <HourglassBottom fontSize="large" style={{ color: buttons.main }}/>
                        </KPICard>
                    </Grid>
                    <Grid item xs={3}>
                        <KPICard title="Equipment Awaiting Delivery" value={this.state.equipments.filter(equipment=>equipment.status == "SHIPPED").length} secValue="no.">
                            <LocalShipping fontSize="large" style={{ color: buttons.main }}/>
                        </KPICard>
                    </Grid>
                </Grid>
                <Card style={{ padding: "15px", width: "101.1%" }}>
                <MDTypography variant="h5" style={{marginBottom: "2px"}}>Your Equipment</MDTypography>
                    <ViewAllTable
                        values={this.state.equipments}
                        headers={['Equipment ID','Equipment Name','Category','Manufactured On', 'Status']}
                        attrib={['equipmentId','catalog.productName','catalog.categories.categoryName','manufacturedOn', 'status']}
                        attribToFilter={['equipmentId','catalog.productName','status','catalog.categories.categoryName']}
                        tooltipText = "Search by Equipment ID, Name, Category, or Status"
                        width={[2, 3, 2, 2, 2]}
                        content={this.getContent}
                    ></ViewAllTable>
                </Card>
            </Container>
        );
    }
}