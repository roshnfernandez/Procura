import { Autocomplete, Button, Card, Divider, Grid, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import MDTypography from "components/MDTypography";
import CreateUser from "assets/images/catalogImages/AddProduct.png"
import { useEffect, useState } from "react";
import axios from "axios";
import { userDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import { AdfScanner, AlternateEmail, CancelOutlined, CurrencyRupee, Draw, Factory, Group, Password, Person, Phone, Save } from "@mui/icons-material";
import { nameRegex } from "memps_components/RegexString/RegexString";
import { emailRegex } from "memps_components/RegexString/RegexString";
import { phoneRegex } from "memps_components/RegexString/RegexString";
import { passwordGenerator } from "assets/util/passwordGenerator";
import { catalogDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import { numberRegex } from "memps_components/RegexString/RegexString";
import { categoryDetails } from "memps_components/ObjectContainerStructure/containerStructure";

export function CatalogForm({ data, submit, cancel }) {
    const [catalog, setCatalog] = useState(data || JSON.parse(JSON.stringify(catalogDetails)));
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState("{}");
    const handleSubmit = async () => {
        await axios.post("http://localhost:1074/trintel/catalog", catalog).then((response) => { submit(); });
    }
    const handleValueChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "productName": setCatalog({...catalog,productName:value});
            break;
            case "manufName": catalog.manufacturerName = value;
                if (!(value.match(nameRegex)))
                    setError({ ...error, manufName: value.length == 0 ? "This is a Required Field" : "Invalid Name (Name must be longer than three characters and can contain only one space)" });
                else
                    setError({ ...error, manufName: null });
                break;
            case "markedPrice": catalog.markedPrice = value;
                if (!(value.match(numberRegex)))
                    setError({ ...error, markedPrice: value.length == 0 ? "This is a Required Field" : "Invalid Value. Marked Price can only be a number" });
                else
                    setError({ ...error, markedPrice: null });
                break;
        }
    }
    const getCategories = async () => {
        await axios.get("http://localhost:1074/trintel/categories").then(response => setCategories(response.data));
    }
    const handleAutoCompleteChange = (event, newValue) => {
        if (newValue == null) {
            setCatalog({...catalog, categories:JSON.parse(JSON.stringify(categoryDetails))});
        }
        else {
            setCatalog({...catalog, categories: categories.filter((cat) => cat.categoryId == newValue)[0]});
        }
    }
    useEffect(() => { getCategories(); }, []);
    return (
        <Card style={{ padding: "15px", width: "720px" }}>
            <MDTypography variant="h4">{data == null ? "Add Product" : "Edit Product - #" + data.catalogId}</MDTypography>
            <Divider></Divider>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Card style={{ boxShadow: "none", overflow: "hidden" }}>
                        <img src={CreateUser} style={{ height: "280px", margin: "10px" }}></img>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        name="productName"
                        variant="outlined"
                        label="Product Name"
                        fullWidth
                        error={error["productName"]}
                        value={catalog.productName}
                        helperText={error["productName"]}
                        onChange={handleValueChange}
                        style={{ marginBottom: "15px", marginTop: "10px" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <AdfScanner fontSize="medium" />
                                </InputAdornment>
                            )
                        }}
                        placeholder="Eg. X-Ray Scanner"
                        required
                    />
                    <br></br>
                    <TextField
                        name="manufName"
                        variant="outlined"
                        label="Manufacturer"
                        fullWidth
                        style={{ marginBottom: "15px" }}
                        error={error["manufName"] ? true : false}
                        value={catalog.manufacturerName}
                        helperText={error["manufName"]}
                        onChange={handleValueChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Factory fontSize="medium" />
                                </InputAdornment>
                            ),
                        }}
                        placeholder="Eg. Tesla Ltd."
                        required
                    />
                    <br></br>
                    <TextField
                        name="markedPrice"
                        variant="outlined"
                        label="Marked Retail Price"
                        fullWidth
                        style={{ marginBottom: "15px" }}
                        error={error["markedPrice"] ? true : false}
                        value={catalog.markedPrice}
                        helperText={error["markedPrice"]}
                        onChange={handleValueChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CurrencyRupee fontSize="medium" />
                                </InputAdornment>
                            ),
                        }}
                        placeholder="In Rupees"
                        required
                    />
                    <br></br>
                    <Autocomplete
                        value={catalog.categories.categoryId}
                        onChange={handleAutoCompleteChange}
                        id="catId"
                        name="catId"
                        style={{ marginBottom: "15px" }}
                        options={categories.map((cat) => cat.categoryId)}
                        isOptionEqualToValue={(option, value) => option == value}
                        renderInput={(params) => <TextField
                            {...params}
                            label="Category"
                            fullWidth
                            placeholder="Start typing the Category ID... "
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Group fontSize="medium" />
                                    </InputAdornment>
                                ),
                            }}
                        />}
                    />
                </Grid>
            </Grid>
            <Divider></Divider>
            <Grid container spacing={5} style={{ paddingLeft: "5px", paddingRight: "5px", justify: "flex-end", alignItems: "justify" }}>
                <Grid item xs={10}>
                    <Button variant="contained" size="small" color="secondary" style={{ color: "white" }} onClick={cancel} startIcon={<CancelOutlined fontSize="medium"></CancelOutlined>}>
                        Cancel
                    </Button>
                </Grid>
                <Grid item xs={1}>
                    <Button variant="contained" size="small" color="primary" style={{ color: "white", backgroundColor: "#00203f" }} onClick={handleSubmit} startIcon={<Save fontSize="medium"></Save>}>
                        Save
                    </Button>
                </Grid>
            </Grid>
        </Card>
    )
}