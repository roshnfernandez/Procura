import { Box, Button, Card, Divider, Grid, InputAdornment, TextField } from "@mui/material";
import { providerDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import React, { useState } from "react";
import CreateProvider from "assets/images/providerImages/createProviderInfographic.png"
import MDTypography from "components/MDTypography";
import { AccountBox, AccountCircle, AlternateEmail, CancelOutlined, Email, LocationCity, Mail, Padding, Person, Person4, Phone, Save, Signpost, WhereToVote } from "@mui/icons-material";
import { nameRegex } from "memps_components/RegexString/RegexString";
import { emailRegex } from "memps_components/RegexString/RegexString";
import { phoneRegex } from "memps_components/RegexString/RegexString";
import { addressRegex } from "memps_components/RegexString/RegexString";
import { numberRegex } from "memps_components/RegexString/RegexString";
import axios from "axios";
import { passwordGenerator } from "assets/util/passwordGenerator";
import { ActionSuccessfulScreen } from "memps_components/ConfirmationScreen/confirmationScreen";

export function ProviderForm({ onClick, currentProvider, initiateRender, showSnackbar}) {
  const [provider, setProvider] = useState(JSON.parse(JSON.stringify(currentProvider == null ? providerDetails : currentProvider)));
  const addressArray = provider.providerAddress.split("@#$");
  const [error, setError] = useState("{}")
  const [success, setSuccess] = useState(false)
  const [address, setAddress] = useState(addressArray.length != 4 ? [null, null, null, null] : addressArray);
  const handleSubmit = async () => {
    provider.users.username = provider.providerName;
    provider.users.password = passwordGenerator(true, true, true, true, 6);
    provider.providerAddress = address.join("@#$");
    await axios.post("http://localhost:1071/trintel/provider", provider).then((response) => { setProvider(response.data); setSuccess(true); if(currentProvider){onClick(); initiateRender();showSnackbar()}});
  }
  const handleCancel = () => {
    onClick();
  }
  const handleValueChange = (event) => {
    const { name, value } = event.target;
    switch (name) {
      case "name": provider.providerName = value;
        if (!(value.match(nameRegex) && value.length > 3))
          setError({ ...error, name: value.length == 0 ? "This is a Required Field" : "Invalid Name (Name must be longer than three characters and can contain only one space)" });
        else
          setError({ ...error, name: null });
        break;
      case "email": provider.users.email = value;
        if (!(value.match(emailRegex)))
          setError({ ...error, email: value.length == 0 ? "This is a Required Field" : "Invalid Email" });
        else
          setError({ ...error, email: null });
        break;
      case "phone": provider.users.phone = value;
        if (!(value.match(phoneRegex)))
          setError({ ...error, phone: value.length == 0 ? "This is a Required Field" : "Invalid Value. Phone should be of the form +XX XXXXXXXXXX" });
        else
          setError({ ...error, phone: null });
        break;
      case "phone": provider.users.phone = value;
        if (!(value.match(phoneRegex)))
          setError({ ...error, phone: value.length == 0 ? "This is a Required Field" : "Invalid Value. Phone should be of the form +XX XXXXXXXXXX" });
        else
          setError({ ...error, phone: null });
        break;
      case "strt": setAddress([value, address[1], address[2], address[3]]);
        if (!(value.match(addressRegex)))
          setError({ ...error, strt: value.length == 0 ? "This is a Required Field" : "Street Address can only contain letters, numbers, space and the following special characters #/-" });
        else
          setError({ ...error, strt: null });
        break;
      case "city": setAddress([address[0], value, address[2], address[3]]);
        if (!(value.match(nameRegex)))
          setError({ ...error, city: value.length == 0 ? "This is a Required Field" : "Invalid City" });
        else
          setError({ ...error, city: null });
        break;
      case "state": setAddress([address[0], address[1], value, address[3]]);
        if (!(value.match(nameRegex)))
          setError({ ...error, state: value.length == 0 ? "This is a Required Field" : "Invalid State" });
        else
          setError({ ...error, state: null });
        break;
      case "zip": setAddress([address[0], address[1], address[2], value]);
        if (!(value.match(numberRegex) && value.length == 6))
          setError({ ...error, zip: value.length == 0 ? "This is a Required Field" : "Invalid Zip Code" });
        else
          setError({ ...error, zip: null });
        break;
    }
  }
  return (
    <React.Fragment>
    {
      success && !Boolean(currentProvider)? 
        <ActionSuccessfulScreen record={"Supplier"} pk={provider.providerId} summaryURL="/suppliers/" onClick={()=>{initiateRender(); onClick()}} />:
        <Card style={{ padding: "15px", width: "980px" }}>
          <MDTypography variant="h4">{currentProvider == null ? "Add Supplier" : "Edit Supplier - #" + currentProvider.providerId}</MDTypography>
          <Divider></Divider>
          <Grid container spacing={2}>
            <Grid item xs={5.2}>
              <Card style={{ boxShadow: "none", overflow: "hidden" }}>
                <img src={CreateProvider} style={{ height: "400px", margin: "-40px" }}></img>
              </Card>
            </Grid>
            <Grid item xs={6.8}>
              <TextField
                name="name"
                variant="outlined"
                label="Supplier Name"
                fullWidth
                error={error["name"] ? true : false}
                value={provider.providerName}
                helperText={error["name"]}
                onChange={handleValueChange}
                style={{ marginBottom: "15px", marginTop: "10px" }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="medium" />
                    </InputAdornment>
                  ),
                }}
                placeholder="What is your Supplier's Name?"
                required
              />
              <br></br>
              <TextField
                name="email"
                variant="outlined"
                label="Email"
                fullWidth
                style={{ marginBottom: "15px" }}
                error={error["email"] ? true : false}
                value={provider.users.email}
                helperText={error["email"]}
                onChange={handleValueChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmail fontSize="medium" />
                    </InputAdornment>
                  ),
                }}
                placeholder="example@email.com"
                required
              />
              <br></br>
              <TextField
                name="phone"
                variant="outlined"
                label="Phone"
                fullWidth
                style={{ marginBottom: "15px" }}
                error={error["phone"] ? true : false}
                value={provider.users.phone}
                helperText={error["phone"]}
                onChange={handleValueChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Phone fontSize="medium" />
                    </InputAdornment>
                  ),
                }}
                placeholder="+XX XXXXXXXXXX"
                required
              />
              <br></br>
              <TextField
                variant="outlined"
                label="Street Address"
                name="strt"
                fullWidth
                style={{ marginBottom: "15px" }}
                error={error["strt"] ? true : false}
                value={address[0]}
                helperText={error["strt"]}
                onChange={handleValueChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Signpost fontSize="medium" />
                    </InputAdornment>
                  ),
                }}
                required
                placeholder="Eg. 112 Rch Strt."
              />
              <br></br>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    name="city"
                    variant="outlined"
                    label="City"
                    fullWidth
                    style={{ marginBottom: "15px" }}
                    error={error["city"] ? true : false}
                    value={address[1]}
                    helperText={error["city"]}
                    onChange={handleValueChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LocationCity fontSize="medium" />
                        </InputAdornment>
                      ),
                    }}
                    required
                    placeholder="Eg. Bangalore"
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    variant="outlined"
                    label="State"
                    fullWidth
                    name="state"
                    style={{ marginBottom: "15px" }}
                    error={error["state"] ? true : false}
                    value={address[2]}
                    helperText={error["state"]}
                    onChange={handleValueChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <WhereToVote fontSize="medium" />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="Eg. Karnataka"
                    required
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    name="zip"
                    variant="outlined"
                    label="Postal Code"
                    fullWidth
                    error={error["zip"] ? true : false}
                    value={address[3]}
                    helperText={error["zip"]}
                    onChange={handleValueChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Mail fontSize="medium" />
                        </InputAdornment>
                      ),
                    }}
                    placeholder="XXXXXX"
                    required
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider></Divider>
          <Grid container spacing={11.3} style={{ paddingLeft: "5px", paddingRight: "5px", justify: "flex-end", alignItems: "justify" }}>
            <Grid item xs={10}>
              <Button variant="contained" size="small" color="secondary" style={{ color: "white" }} onClick={handleCancel} startIcon={<CancelOutlined fontSize="medium"></CancelOutlined>}>
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
    }
    </React.Fragment>
  )
}