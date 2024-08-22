import { Box, TextField, Icon, Grid, Autocomplete, Card, Button, IconButton, CardActionArea } from "@mui/material";
import React, { useEffect, useState } from "react";
import ViewAllTable from "memps_components/DynamicTables/table";
import { AccountCircle, Add, AddCircle, AddCircleOutline, ArrowBack, FilterAlt, PageviewTwoTone, Search } from "@mui/icons-material";
import MDTypography from "components/MDTypography";
import HeaderAppBar from "memps_components/HeaderBar/HeaderAppBar";
import { Link } from "react-router-dom";
import axios from "axios";
import { KPICard } from "memps_components/ActionCards/kpiCards";
import { PopupForm } from "memps_components/Popup/popupForm";
import { ProviderForm } from "./providerForm";
import Container from "memps_components/ContentContainers/Container";
import { equipmentDetails } from "memps_components/ObjectContainerStructure/containerStructure";

export default class ProviderScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            providers: [],
            open: false
        }
        this.changeDialogState = this.changeDialogState.bind(this);
        this.compReRender = this.compReRender.bind(this);
    }
    compReRender(){
        this.loadData();
    }
    loadData = async () =>{
        await axios.get("http://localhost:1071/trintel/provider").then((response)=>{this.setState(
            {providers: response.data.sort((ml,mr)=>mr.providerId.match("[0-9]{4}$")[0] - ml.providerId.match("[0-9]{4}$")[0])});})
    }
    componentDidMount(){
        this.loadData();
    }
    changeDialogState(val){
        this.setState((prevState)=>({open: val}))
    }
    getContent(provider) {
        const [equipment, setEquipment] = useState([]);
        const [maintenance,setMaintenance] = useState([]);
        const [order, setOrder] = useState([]);
        const getData = async () =>{
            await axios.get("http://localhost:1071/trintel/equipment/provider/" + provider.providerId).then((response)=>{setEquipment(response.data)});
            await axios.get("http://localhost:1071/trintel/provider/maintenance/" + provider.providerId).then((response)=>{setMaintenance(response.data)});
            await axios.get("http://localhost:1071/trintel//order/provider/" + provider.providerId).then((response)=>{setOrder(response.data)});
        }
        useEffect(()=>{getData();},[]);
        return (
            <React.Fragment>
                <MDTypography style={{ fontSize: "15px" }}>
                    {provider.providerName} is located at the address, {provider.providerAddress.split("@#$").join(", ")}. It has been associated with {order.length} orders, {equipment.length} equipments, and {maintenance.length} maintenance requests.
                </MDTypography>
                <MDTypography style={{ fontSize: "15px" }}>
                    <u><Link to={"/suppliers/" + provider.providerId}>Click here</Link></u> to know more about the it.
                </MDTypography>
                <br></br>
            </React.Fragment>
        )
    }
    render() {
        return (
            <Container>
                <HeaderAppBar />
                    <Card style={{padding:"15px", width: "101.5%"}}>
                        <Grid container spacing={11} style={{marginBottom: "2px"}}>
                            <Grid item xs={10}>
                                <MDTypography variant="h5">Manage Suppliers</MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" size="small" style={{color: "white", backgroundColor: "#00203f"}} onClick={()=>this.changeDialogState(true)} startIcon={<AddCircleOutline fontSize="medium"></AddCircleOutline>}>
                                    Create
                                </Button>
                                <PopupForm open={this.state.open} onClose={()=>this.changeDialogState(false)} givenKey={1}>
                                    <ProviderForm onClick = {()=>this.changeDialogState(false)} initiateRender={()=>this.compReRender()}></ProviderForm>
                                </PopupForm>
                            </Grid>
                        </Grid>
                        <ViewAllTable
                            values={this.state.providers}
                            headers={['ID', 'Name', 'Email', 'Phone']}
                            attrib={['providerId', 'providerName', 'users.email', 'users.phone']}
                            attribToFilter={['providerId','providerName','provider.address']}
                            tooltipText = "Search by Supplier ID, Name, or Address"
                            width={[2,3,3,3]}
                            content={this.getContent}
                            apiLink="http://localhost:1071/trintel/provider"
                        ></ViewAllTable>
                    </Card>
            </Container>
        );
    }
}