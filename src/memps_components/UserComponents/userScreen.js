import { Box, TextField, Icon, Grid, Autocomplete, Card, Button, IconButton, CardActionArea } from "@mui/material";
import React, { useEffect, useState } from "react";
import ViewAllTable from "memps_components/DynamicTables/table";
import { AccountCircle, Add, AddCircle, AddCircleOutline, ArrowBack, FilterAlt, PageviewTwoTone, Search } from "@mui/icons-material";
import MDTypography from "components/MDTypography";
import HeaderAppBar from "memps_components/HeaderBar/HeaderAppBar";
import { Link } from "react-router-dom";
import axios from "axios";
import { PopupForm } from "memps_components/Popup/popupForm";
import { ProviderForm } from "memps_components/ProviderComponents/providerForm";
import Container from "memps_components/ContentContainers/Container";
import ActionTable from "memps_components/DynamicTables/actionTable";
import { UserForm } from "./userForm";
import { SuccessAlert } from "memps_components/SuccessAlert/successAlert";

export default class UserScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            open: false,
            success: false,
        }
        this.changeDialogState = this.changeDialogState.bind(this);
    }
    loadData = async () =>{
        await axios.get("http://localhost:1074/trintel/users").then((response)=>{this.setState(
            {users: response.data.sort((ml,mr)=>mr.userId.match("[0-9]{4}$")[0] - ml.userId.match("[0-9]{4}$")[0])});})
    }
    deleteUser = async (obj) =>{
        console.log(obj)
        obj.isActive = 'N';
        await axios.post("http://localhost:1074/trintel/users",obj).then((response)=>{this.loadData()})
    }
    componentDidMount(){
        this.loadData();
    }
    changeDialogState(val){
        this.setState((prevState)=>({open: val}))
    }
    onSuccessfulSubmit(){
        this.setState({success: true, open: false});
        this.loadData();
    }
    render() {
        return (
            <Container>
                <HeaderAppBar />
                    <Card style={{padding:"15px", width: "101.5%"}}>
                        <Grid container spacing={11} style={{marginBottom: "2px"}}>
                            <Grid item xs={10}>
                                <MDTypography variant="h5">Manage Users</MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" size="small" style={{color: "white", backgroundColor: "#00203f"}} onClick={()=>this.changeDialogState(true)} startIcon={<AddCircleOutline fontSize="medium"></AddCircleOutline>}>
                                    Create
                                </Button>
                                <PopupForm open={this.state.open} onClose={()=>this.changeDialogState(false)} givenKey={1}>
                                     <UserForm cancel={()=>this.changeDialogState(false)} submit={()=>this.onSuccessfulSubmit()}></UserForm>
                                </PopupForm>
                            </Grid>
                        </Grid>
                        <ActionTable
                            values={this.state.users}
                            headers={['ID', 'Name', 'Email', 'Phone', 'Role']}
                            attrib={['userId', 'username', 'email', 'phone', 'roles.roleName']}
                            attribToFilter={['userId','username','roles.roleName']}
                            tooltipText = "Search by User ID, Name, or Role"
                            width={[2,2.5,2.5,2,1.5]}
                            form={UserForm}
                            initiateRerender={()=>this.loadData()}
                            title="User"
                            postMethod={(obj)=>this.deleteUser(obj)}
                        ></ActionTable>
                    </Card>
                    <SuccessAlert open={this.state.success} onClose={()=>this.setState({success:false})}/>
            </Container>
        );
    }
}