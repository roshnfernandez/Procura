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

export default class LookupScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            role: [],
            category: [],
            openRole: false,
            openCategory: false
        }
        this.changeDialogState = this.changeDialogState.bind(this);
    }
    loadRole = async () => {
        await axios.get("http://localhost:1074/trintel/roles").then((response) => {
            this.setState(
                { role: response.data});
        })
    }
    loadCategory = async () => {
        await axios.get("http://localhost:1074/trintel/categories").then((response) => {
            this.setState(
                { category: response.data});
        })
    }
    componentDidMount() {
        this.loadRole();
        this.loadCategory();
    }
    changeDialogState(val) {
        this.setState((prevState) => ({ open: val }))
    }
    render() {
        return (
            <Container>
                <HeaderAppBar />
                <Grid container spacing={4}>
                    <Grid item xs={6}>
                        <Card style={{ padding: "15px", width: "101.5%" }}>
                            <Grid container spacing={1} style={{ marginBottom: "20px" }}>
                                <Grid item xs={9.45}>
                                    <MDTypography variant="h5">Manage Categories</MDTypography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Button variant="contained" size="small" style={{ color: "white", backgroundColor: "#00203f" }} onClick={() => this.changeDialogState(true)} startIcon={<AddCircleOutline fontSize="medium"></AddCircleOutline>}>
                                        Create
                                    </Button>
                                    <PopupForm open={this.state.open} onClose={() => this.changeDialogState(false)} givenKey={1}>
                                        {/* <ProviderForm onClick = {()=>this.changeDialogState(false)} initiateRender={()=>this.compReRender()}></ProviderForm> */}
                                    </PopupForm>
                                </Grid>
                            </Grid>
                            <ActionTable
                                values={this.state.category}
                                headers={['ID', 'Category Name']}
                                attrib={['categoryId', 'categoryName']}
                                attribToFilter={['categoryId', 'categoryName']}
                                tooltipText="Search by ID or Name"
                                width={[3, 7]}
                                form={ProviderForm}
                                disableSearch={true}
                            ></ActionTable>
                        </Card>
                    </Grid>
                    <Grid item xs={6}>
                    <Card style={{padding:"15px", width: "101.5%"}}>
                        <Grid container spacing={1} style={{marginBottom: "20px"}}>
                            <Grid item xs={9.45}>
                                <MDTypography variant="h5">Manage Roles</MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" size="small" style={{color: "white", backgroundColor: "#00203f"}} onClick={()=>this.changeDialogState(true)} startIcon={<AddCircleOutline fontSize="medium"></AddCircleOutline>}>
                                    Create
                                </Button>
                                <PopupForm open={this.state.open} onClose={()=>this.changeDialogState(false)} givenKey={1}>
                                    {/* <ProviderForm onClick = {()=>this.changeDialogState(false)} initiateRender={()=>this.compReRender()}></ProviderForm> */}
                                </PopupForm>
                            </Grid>
                        </Grid>
                        <ActionTable
                            values={this.state.role}
                            headers={['ID', 'Role Name',]}
                            attrib={['roleId', 'roleName']}
                            attribToFilter={['roleId','roleName']}
                            tooltipText = "Search by ID or Name"
                            width={[3,7]}
                            form={ProviderForm}
                            disableSearch={true}
                        ></ActionTable>
                    </Card>
                    </Grid>
                </Grid>
            </Container>
        );
    }
}