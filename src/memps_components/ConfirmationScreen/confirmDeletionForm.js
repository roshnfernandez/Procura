import { Button, Card, Divider } from "@mui/material";
import colors from "assets/theme/base/colors";
import MDTypography from "components/MDTypography";

export function ConfirmDeletionForm({title, postMethod, onClick, pk}){
    return(
        <Card style={{ padding: "10px", width: "500px" }}>
            <MDTypography variant="h4">Confirm Deletion of {title} - {pk}</MDTypography>
            <Divider></Divider>
            <div style={{paddingLeft: "10px", paddingRight: "10px"}}>
                <MDTypography variant="h6" fontWeight="regular">{"Are you sure you wish to proceed with the deletion of this record? Kindly note that this action cannot be undone."}</MDTypography>
            </div>
            <Divider></Divider>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
                <Button onClick={()=>onClick()} color="secondary" style={{color: "white"}} size="small" variant="contained">No</Button>
                <Button onClick={()=>{postMethod();onClick()}} size="small" style={{color: "white", backgroundColor: colors.error.main }} variant="contained">Yes</Button>
            </div>
        </Card>
    )
}