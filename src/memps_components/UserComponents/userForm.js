import { Autocomplete, Button, Card, Divider, Grid, IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import MDTypography from "components/MDTypography";
import CreateUser from "assets/images/userImages/AddUserInfographic.png"
import { useEffect, useState } from "react";
import axios from "axios";
import { userDetails } from "memps_components/ObjectContainerStructure/containerStructure";
import { AlternateEmail, CancelOutlined, Draw, Group, Password, Person, Phone, Save } from "@mui/icons-material";
import { nameRegex } from "memps_components/RegexString/RegexString";
import { emailRegex } from "memps_components/RegexString/RegexString";
import { phoneRegex } from "memps_components/RegexString/RegexString";
import { passwordGenerator } from "assets/util/passwordGenerator";

export function UserForm({ data, submit, cancel }) {
    const [user, setUser] = useState(data || JSON.parse(JSON.stringify(userDetails)));
    const [roles, setRole] = useState([]);
    const [error, setError] = useState("{}");
    const handleSubmit = async () => {
        await axios.post("http://localhost:1074/trintel/users", user).then((response) => { submit(); });
    }
    const handleValueChange = (event) => {
        const { name, value } = event.target;
        switch (name) {
            case "name": user.username = value;
                if (!(value.match(nameRegex) && value.length > 3))
                    setError({ ...error, name: value.length == 0 ? "This is a Required Field" : "Invalid Name (Name must be longer than three characters and can contain only one space)" });
                else
                    setError({ ...error, name: null });
                break;
            case "email": user.email = value;
                if (!(value.match(emailRegex)))
                    setError({ ...error, email: value.length == 0 ? "This is a Required Field" : "Invalid Email" });
                else
                    setError({ ...error, email: null });
                break;
            case "phone": user.phone = value;
                if (!(value.match(phoneRegex)))
                    setError({ ...error, phone: value.length == 0 ? "This is a Required Field" : "Invalid Value. Phone should be of the form +XX XXXXXXXXXX" });
                else
                    setError({ ...error, phone: null });
                break;
            case "password": user.password = value;
                if (!(value.length>=6 && value.length<=12))
                    setError({ ...error, password: value.length == 0 ? "This is a Required Field" : "Invalid Value. Password should be longer than 5 characters and shorter than 13 characters." });
                else
                    setError({ ...error, password: null });
                break;
        }
    }
    const getRoles = async () => {
        await axios.get("http://localhost:1074/trintel/roles").then(response => setRole(response.data));
    }
    const handleAutoCompleteChange = (event, newValue) => {
        if (newValue == null) {
            setUser({...user, roles:JSON.parse(JSON.stringify(userDetails))});
        }
        else {
            setUser({...user, roles: roles.filter((role) => role.roleId == newValue)[0]});
        }
    }
    useEffect(() => { getRoles(); }, []);
    return (
        <Card style={{ padding: "15px", width: "720px" }}>
            <MDTypography variant="h4">{data == null ? "Add User" : "Edit User - #" + data.userId}</MDTypography>
            <Divider></Divider>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Card style={{ boxShadow: "none", overflow: "hidden" }}>
                        <img src={CreateUser} style={{ height: "280px", margin: "10px" }}></img>
                    </Card>
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        name="name"
                        variant="outlined"
                        label="Name"
                        fullWidth
                        error={error["name"] ? true : false}
                        value={user.username}
                        helperText={error["name"]}
                        onChange={handleValueChange}
                        style={{ marginBottom: "15px", marginTop: "10px" }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Person fontSize="medium" />
                                </InputAdornment>
                            )
                        }}
                        placeholder="Eg. Roshan Fernandez"
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
                        value={user.email}
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
                        value={user.phone}
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
                    <Autocomplete
                        value={user.roles.roleId}
                        onChange={handleAutoCompleteChange}
                        id="roleId"
                        name="roleId"
                        style={{ marginBottom: "15px" }}
                        options={roles.map((role) => role.roleId)}
                        isOptionEqualToValue={(option, value) => option == value}
                        renderInput={(params) => <TextField
                            {...params}
                            label="Role Id"
                            fullWidth
                            placeholder="Start typing the Role ID... "
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
                    <TextField
                        name="password"
                        variant="outlined"
                        label="Password"
                        fullWidth
                        style={{ marginBottom: "15px" }}
                        error={error["password"] ? true : false}
                        value={user.password}
                        helperText={error["password"]}
                        onChange={handleValueChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Password fontSize="medium" />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Tooltip title="Click to generate a strong password">
                                    <IconButton onClick={()=>{
                                        setUser({...user, password: passwordGenerator(true, true, true, true, 7)})
                                    }}>
                                        <Draw/>
                                    </IconButton>
                                    </Tooltip>
                                </InputAdornment>
                            )
                        }}
                        placeholder="*******"
                        required
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