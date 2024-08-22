import MDTypography from "components/MDTypography";
import { useState } from "react";

export function Clock(){
    const [time, setTime] = useState(new Date().toLocaleTimeString());
    const updateTime = () =>{
        setTime(new Date().toLocaleTimeString());
    }
    setInterval(updateTime,1000);
    return (<MDTypography variant="h6" fontWeight="regular" style={{fontSize: "18px"}}>{time}</MDTypography>)
}