import { Button, Card, Divider } from "@mui/material";
import colors from "assets/theme/base/colors";
import MDTypography from "components/MDTypography";

export function EquipmentConfirmationForm({title, postMethod, onClick}){
    return(
        <Card style={{ padding: "10px", width: "500px" }}>
            <MDTypography variant="h4">Mark Equipment as {title}</MDTypography>
            <Divider></Divider>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
                <MDTypography variant="h6" fontWeight="regular">{title == "Functional" ? "Are you sure you wish to mark this equipment as functional? Kindly note that this would allow usage of the equipment.":"Are you sure you wish to mark this equipment as broken down? Kindly note that this would prevent the usage of this equipment"}</MDTypography>
            </div>
            <Divider></Divider>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <Button onClick={()=>onClick()} color="secondary" style={{color: "white"}} size="small" variant="contained">No</Button>
                <Button onClick={()=>{postMethod();onClick()}} size="small" style={{color: "white", backgroundColor: title == "Broken Down"? colors.error.main :colors.buttons.main}} variant="contained">Yes</Button>
            </div>
        </Card>
    )
}