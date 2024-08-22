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
import { UserForm } from "memps_components/UserComponents/userForm";
import { CatalogForm } from "./catalogForm";
import { SuccessAlert } from "memps_components/SuccessAlert/successAlert";

export default class CatalogScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            catalog: [],
            open: false,
            success: false
        }
        this.changeDialogState = this.changeDialogState.bind(this);
        this.compReRender = this.compReRender.bind(this);
    }
    compReRender(){
        this.loadData();
    }
    loadData = async () =>{
        await axios.get("http://localhost:1074/trintel/catalog").then((response)=>{this.setState(
            {catalog: response.data.sort((ml,mr)=>mr.catalogId.match("[0-9]{4}$")[0] - ml.catalogId.match("[0-9]{4}$")[0])});})
    }
    deleteCatalog = async (obj) =>{
        console.log(obj)
        obj.isActive = 'N';
        await axios.post("http://localhost:1074/trintel/catalog",obj).then((response)=>{this.loadData()})
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
                                <MDTypography variant="h5">Manage Catalog</MDTypography>
                            </Grid>
                            <Grid item xs={2}>
                                <Button variant="contained" size="small" style={{color: "white", backgroundColor: "#00203f"}} onClick={()=>this.changeDialogState(true)} startIcon={<AddCircleOutline fontSize="medium"></AddCircleOutline>}>
                                    Create
                                </Button>
                                <PopupForm open={this.state.open} onClose={()=>this.changeDialogState(false)} givenKey={1}>
                                    <CatalogForm cancel={()=>this.changeDialogState(false)} submit={()=>this.onSuccessfulSubmit()}></CatalogForm>
                                </PopupForm>
                            </Grid>
                        </Grid>
                        <ActionTable
                            values={this.state.catalog}
                            headers={['ID', 'Product', 'Manufacturer', 'Marked Price', 'Category']}
                            attrib={['catalogId', 'productName', 'manufacturerName', 'markedPrice', 'categories.categoryName']}
                            attribToFilter={['catalogId','productName','manufacturerName','categories.categoryName']}
                            tooltipText = "Search by ID, Name, Manufacturer Name or Category"
                            width={[1.5,2.5,2,2,2.5]}
                            form={CatalogForm}
                            initiateRerender={()=>this.loadData()}
                            title="Product"
                            postMethod={(obj)=>this.deleteCatalog(obj)}
                        ></ActionTable>
                    </Card>
                    <SuccessAlert open={this.state.success} onClose={()=>this.setState({success:false})}/>
            </Container>
        );
    }
}