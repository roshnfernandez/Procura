import MDTypography from "components/MDTypography";
import { useEffect, useState } from "react";

export function UsageTime({startTime}){
    const [usageTime, setUsageTime] = useState("");
    const updateUsageTime = () =>{
        const timeDiff = new Date().getTime() - new Date(startTime).getTime();
        setUsageTime(String(Math.floor(timeDiff/(1000 * 60 * 60),2)).padStart(2,'0') + " H : " + String((Math.floor(timeDiff/(1000 * 60)) - Math.floor(timeDiff/(1000 * 60 * 60))*60)).padStart(2,'0') + " M",60000);
    }
    setTimeout(updateUsageTime,10);
    setInterval(updateUsageTime,60000);
    return (<MDTypography variant="h6" fontWeight="regular" style={{ fontSize: "14px" }}>{usageTime}</MDTypography>)
}