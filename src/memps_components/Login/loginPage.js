import { Button, Card, Grid, IconButton, InputAdornment, TextField } from "@mui/material";
import colors from "assets/theme/base/colors";
import Background from "assets/images/loginImages/LoginBackground.png"
import MDTypography from "components/MDTypography";
import { AccountCircle, AdfScanner, AlternateEmail, Password, Person, Store, Visibility, VisibilityOff } from "@mui/icons-material";
import { useState } from "react";
import boxShadows from "assets/theme/base/boxShadows";
import axios from "axios";
import { useMEMPSContext } from "context";
import { setUser } from "context";
import { setRole } from "context";
import { emailRegex } from "memps_components/RegexString/RegexString";
import { equipmentIdRegex } from "memps_components/RegexString/RegexString";
import { providerIdRegex } from "memps_components/RegexString/RegexString";
import { setEquipment } from "context";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisiblity, setPasswordVisibility] = useState(false);
    const [isGuest, setIsGuest] = useState(false);
    const [error, setError] = useState(false);
    const [providerId, setProviderId] = useState("");
    const [equipmentId, setEquipmentId] = useState("");
    const [controller,dispatch] = useMEMPSContext();
    const authenticate = async ()=>{
        await axios.post("http://localhost:1071/trintel/authenticate",{email: email, password: password}).then(
            (response)=>{
                console.log(response.data);
                if(response.data){
                    console.log(response.data);
                    setUser(dispatch,response.data);
                    setRole(dispatch,response.data.roles.roleName);
                    setError({...error, auth: null})
                }else{
                    setError({...error, auth: "Invalid email or password"})
                }
            }
        )
    }
    const handleChange = (event)=>{
        const {name,value} = event.currentTarget;
        switch(name){
            case "email": if(value.match(emailRegex)){
                setEmail(value);
                setError({...error, email : null})
            }else{
                setEmail(value);
                setError({...error, email : "Invalid Email"})
            }
            break;
            case "password": if(value.length>=5 && value.length<10){
                setPassword(value);
                setError({...error, password : null})
            }else{
                setPassword(value);
                setError({...error, password : "Invalid Password"})
            }
            break;
            case "equipmentId": if(value.match(equipmentIdRegex)){
                setEquipmentId(value);
                setError({...error, equipmentId : null})
            }else{
                setEquipmentId(value);
                setError({...error, equipmentId : "Invalid Equipment ID"})
            }
            break;
            case "providerId": if(value.match(providerIdRegex)){
                setProviderId(value);
                setError({...error, providerId : null})
            }else{
                setProviderId(value);
                setError({...error, providerId : "Invalid Supplier ID"})
            }
            break;
        }
    }
    const authenticateGuest = async ()=>{
        await axios.get("http://localhost:1072/trintel//maintenance/tech/" + email).then(
            (response)=>{
                console.log("In", response.data);
                if(response.data.map((maintenance)=>maintenance.equipment.equipmentId + "||" + maintenance.equipment.providers.providerId).includes(equipmentId + "||" +providerId)){
                    console.log(equipmentId);
                    setEquipment(dispatch, equipmentId);
                    setRole(dispatch,"GUEST");
                }
                else{
                    setError({...error, guestAuth: "Invalid Credentials, Kindly re-check your details."});
                }
            }
        )
    }
    return (
        <Card style={{ width: "100%", height: window.innerHeight, backgroundColor: "rgb(240,242,245)", borderRadius: "0px", boxShadow: "none", backgroundImage: `linear-gradient(to right, ${colors.navbarColor} 86% ,${colors.applicationPrimary} 12%)`}}>
            <div style={{ width: "100%", height: window.innerHeight, backdropFilter: "blur(1.5px)", padding: "4%"}}>
            <Card style={{ height: "500px", width: "90%", marginLeft: "5%", backgroundColor: colors.applicationPrimary, boxShadow: boxShadows.xl, marginTop: "0.5%"}}>
                <Grid container style={{ height: "100%" }}>
                    <Grid item xs={7}>
                        <img src={Background} style={{ height: "100%", width: "140%", borderRadius: "4px" }}></img>
                    </Grid>
                    <Grid item xs={5}>
                        {
                            isGuest ?
                                <Card style={{ boxShadow: "none", height: "100%", borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px", paddingLeft: "15%", paddingTop: "80px" }}>
                                    <div onClick={() => { setIsGuest(false); setEmail(""); setError({...error, email: null})}} style={{ cursor: "pointer", marginBottom: "5px" }}><MDTypography variant="h5" fontWeight="Regular" style={{ fontSize: "10px" }}>{"← Go Back"}</MDTypography></div>
                                    <MDTypography variant="h5" fontWeight="Regular" style={{ fontSize: "22px" }}>Hey Technician!</MDTypography>
                                    <MDTypography variant="h5" fontWeight="light" style={{ fontSize: "12px", marginTop: "4px", width: "80%" }}>Enter to log your maintenance request.</MDTypography>
                                    <br></br>
                                    <TextField
                                        id="userEmail"
                                        value={email}
                                        onChange={handleChange}
                                        error={error["email"]}
                                        helperText={error["email"]}
                                        label="Email"
                                        name="email"
                                        size="small"
                                        required
                                        style={{ marginTop: "8%", width: "80%" }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AlternateEmail fontSize="medium" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        placeholder="Eg. dwayne.smith@email.com"
                                    />
                                    <TextField
                                        id="providerId"
                                        value={providerId}
                                        name="providerId"
                                        onChange={handleChange}
                                        error={error["providerId"]}
                                        helperText={error["providerId"]}
                                        label="Supplier ID"
                                        type="text"
                                        size="small"
                                        required
                                        style={{ marginTop: "4%", width: "80%" }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Store fontSize="medium" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        placeholder="Eg. PROVXXXX"
                                    />
                                    <TextField
                                        id="equipmentId"
                                        value={equipmentId}
                                        name="equipmentId"
                                        onChange={handleChange}
                                        error={error["equipmentId"]}
                                        helperText={error["equipmentId"]}
                                        label="Equipment ID"
                                        type="text"
                                        size="small"
                                        required
                                        style={{ marginTop: "4%", width: "80%" }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AdfScanner fontSize="medium" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        placeholder="Eg. EQXXXX"
                                    />
                                    <Button onClick={authenticateGuest} variant="contained" size="small" style={{ backgroundColor: colors.buttons.main, color: "white", width: "80%", marginTop: "6%", height: "40px" }}>Login</Button>
                                    <MDTypography fontWeight="ligth" style={{fontSize: "14px", color: colors.error.main, marginTop : "10px"}}>{error["guestAuth"]}</MDTypography>
                                </Card> :
                                <Card style={{ boxShadow: "none", height: "100%", borderTopLeftRadius: "0px", borderBottomLeftRadius: "0px", paddingLeft: "15%", paddingTop: "80px" }}>
                                    <MDTypography variant="h5" fontWeight="Regular" style={{ fontSize: "22px" }}>Welcome Back User!</MDTypography>
                                    <MDTypography variant="h5" fontWeight="light" style={{ fontSize: "12px", marginTop: "4px", width: "80%" }}>Enter into a world of seamless equipment management.</MDTypography>
                                    <TextField
                                        id="userEmail"
                                        name="email"
                                        value={email}
                                        onChange={handleChange}
                                        error={error["email"]}
                                        helperText={error["email"]}
                                        label="Email"
                                        type="email"
                                        size="small"
                                        required
                                        style={{ marginTop: "8%", width: "80%" }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AlternateEmail fontSize="medium" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        placeholder="Eg. dwayne.smith@email.com"
                                    />
                                    <TextField
                                        id="password"
                                        value={password}
                                        onChange={handleChange}
                                        error={error["password"]}
                                        helperText={error["password"]}
                                        label="Password"
                                        name="password"
                                        type={passwordVisiblity ? "text" : "password"}
                                        required
                                        size="small"
                                        style={{ marginTop: "4%", width: "80%" }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <Password fontSize="medium" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={() => setPasswordVisibility(!passwordVisiblity)} disableRipple>
                                                        {
                                                            passwordVisiblity ? <VisibilityOff /> : <Visibility />
                                                        }
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        placeholder="Enter your password here"
                                    />
                                    <MDTypography fontWeight="ligth" style={{fontSize: "14px", color: colors.error.main, marginTop : "10px"}}>{error["auth"]}</MDTypography>
                                    <Button onClick={authenticate} variant="contained" size="small" style={{ backgroundColor: colors.buttons.main, color: "white", width: "80%", marginTop: "6%", height: "40px" }}>Login</Button>
                                    <Grid container style={{ display: "flex", alignItems: "center", width: "80%", marginTop: "3%" }}>
                                        <Grid item xs={5.6}>
                                            <hr style={{ marginLeft: "30%", color: colors.grey["500"] }}></hr>
                                        </Grid>
                                        <Grid item xs={0.8}>
                                            <MDTypography fontWeight="light" style={{ fontSize: "11px", color: colors.grey["600"], marginLeft: "2.5px" }}>OR</MDTypography>
                                        </Grid>
                                        <Grid item xs={5.6}>
                                            <hr style={{ marginRight: "30%", color: colors.grey["500"] }}></hr>
                                        </Grid>
                                    </Grid>
                                    <Button onClick={() => { setIsGuest(true); setEmail("");setError({...error, email: null}); }} variant="text" size="medium" style={{ border: `0.5px solid ${colors.grey["600"]}`, color: colors.grey["700"], width: "80%", marginTop: "3%", height: "40px" }}><AccountCircle fontSize="large" style={{ marginRight: "5px" }} /> Sign-in as Guest</Button>
                                </Card>
                        }
                    </Grid>
                </Grid>
            </Card>
            </div>
        </Card>
    )
}