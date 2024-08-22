import { Card, Divider, Grid, Icon, IconButton } from "@mui/material";
import 'react-calendar/dist/Calendar.css';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ArrowCircleRightIcon from '@mui/icons-material/ArrowCircleRight';
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MarkUnreadChatAltIcon from '@mui/icons-material/MarkUnreadChatAlt';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import { CardInHome } from "cps_components/ActionCards/cardInHome";
import InnerContainer from "cps_components/ContentContainers/innerContainer";
import OuterContainer from "cps_components/ContentContainers/outerContainer";
import HeaderAppBar from "cps_components/HeaderBar/HeaderAppBar";
import React, { createRef } from "react";
import { CardsForInsurance } from "cps_components/CardContent/cardContent";
import { Chart } from "react-google-charts";
import rgba from "assets/theme/functions/rgba";
import { red } from "@mui/material/colors";
import { useMEMPSContext } from "context";
import { CardsForHospital } from "cps_components/CardContent/cardContent";
import { CardsForPatient } from "cps_components/CardContent/cardContent";

class HomeScreenInner extends React.Component {

    notifications = [
        {
            Title: "A Policy has been added",
            Desc: "A new policy (POL012) has been added",
            icon: <Icon fontSize="small">layers</Icon>
        },
        {
            Title: "A Policy has been added",
            Desc: "A new policy (POL013) has been added",
            icon: <Icon fontSize="small">layers</Icon>
        },
        {
            Title: "Your query has been responded",
            Desc: "Query QUR001 has recieved a response",
            icon: <Icon fontSize="small"><MarkUnreadChatAltIcon></MarkUnreadChatAltIcon></Icon>
        },
        {
            Title: "A claim has been created",
            Desc: "A new claim (CL013) has been created",
            icon: <Icon fontSize="small"><HealthAndSafetyIcon></HealthAndSafetyIcon></Icon>
        }
    ]
    chartData = [
        ["Claim Status", "Percentage"],
        ["Approved", 11],
        ["Denied", 2],
        ["On Hold", 4]
    ];
    latestClaims = [
        {
            claimId: "CLM105",
            policyId: "POL001",
            policyName: "Jeevan Anand",
            createdOn: "Jul 07, 2024"
        },
        {
            claimId: "CLM104",
            policyId: "POL002",
            policyName: "Jeevan",
            createdOn: "Jul 07, 2024"
        },
        {
            claimId: "CLM103",
            policyId: "POL001",
            policyName: "Jeevan Anand",
            createdOn: "Jul 07, 2024"
        },
        {
            claimId: "CLM102",
            policyId: "POL002",
            policyName: "Jeevan",
            createdOn: "Jul 07, 2024"
        },
        {
            claimId: "CLM101",
            policyId: "POL001",
            policyName: "Jeevan Anand",
            createdOn: "Jul 07, 2024"
        },
    ]
    scrollDivWidth = 585;

    claimsPerDayHistory = [
        ["", "Claims Per Day"],
        ["", 20],
        ["", 22],
        ["", 18],
        ["", 10],
        ["", 15],
        ["", 19],
        ["", 19],
        ["", 12],
        ["", 19],
        ["", 12],
    ]
    smallDim = {
        height: "150px",
        width: "200px"
    }

    largeDim = {
        height: "170px",
        width: "220px"
    }
    constructor(props) {
        super(props);
        this.scrollDivRef = createRef();
        this.state = {
            indexInMiddle: 2,
            cardData: this.props.role == "INSURANCE" ? CardsForInsurance : this.props.role== "HOSPITAL" ? CardsForHospital : CardsForPatient
        }
        this.handleScroll = this.handleScroll.bind(this);
    }
    handleScroll() {
        var origContainer = this.scrollDivRef.current;
        var totalLengthOfData = this.state.cardData.length;
        var maxScrollLength = origContainer.scrollWidth;
        var ratioBtwDataAndScroll = maxScrollLength / totalLengthOfData;
        var scrollStart = origContainer.scrollLeft;
        var center = scrollStart + origContainer.clientWidth / 2;
        var index = Math.ceil(center / ratioBtwDataAndScroll);
        this.setState({
            indexInMiddle: index
        }, () => { })
    }
    RightButtonAction(){
        var origContainer = this.scrollDivRef.current;
        origContainer.scrollLeft += 220;
    }
    LeftButtonAction(){
        var origContainer = this.scrollDivRef.current;
        origContainer.scrollLeft -= 220;
    }
    render() {
        return (
            <OuterContainer>
                <HeaderAppBar />
                <InnerContainer>
                    <Grid container spacing={2}>
                        <Grid item xs={9} style={{ height: "500px" }}>
                            <Card style={{ height: "54%", width: "100%", marginBottom: "16px", padding: "10px" }}>
                                <MDTypography variant="h6" style={{ marginBottom: "-8px" }}>Quick Navigation</MDTypography>
                                <Divider></Divider>
                                <Grid container style={{ display: "flex", alignItems: "center", padding: "20px" }} spacing={3}>
                                    <Grid item xs={1}>
                                        <IconButton onClick={()=>this.LeftButtonAction()}>
                                            <ArrowCircleLeftIcon></ArrowCircleLeftIcon>
                                        </IconButton>
                                    </Grid>
                                    <Grid item xs={10}>
                                        <div ref={this.scrollDivRef} style={{ display: "flex", width: this.scrollDivWidth + "px", overflowX: "hidden", scrollbarWidth: "none", height: "180px", alignItems: "center", gap: "10px", marginTop: "-20px" }} onScroll={this.handleScroll}>
                                            {
                                                this.state.cardData.map(
                                                    (cardVal) => (
                                                        <div key={cardVal.key} style={{ width: "220px", boxShadow: (cardVal.id == this.state.indexInMiddle) ? "0 0 10px rgba(0, 0, 0, 0.1)" : "", pointerEvents:(cardVal.id == this.state.indexInMiddle) ? "" : "none" }}>
                                                                {
                                                                    cardVal.comp? 
                                                                    <CardInHome
                                                                    icon={cardVal.icon}
                                                                    height={(cardVal.id == this.state.indexInMiddle) ? this.largeDim.height : this.smallDim.height}
                                                                    width={(cardVal.id == this.state.indexInMiddle) ? this.largeDim.width : this.smallDim.width}
                                                                    title={cardVal.title}
                                                                    desc={cardVal.desc}
                                                                    comp={cardVal.comp}
                                                                ></CardInHome>
                                                                    : 
                                                                <CardInHome
                                                                    icon={cardVal.icon}
                                                                    height={(cardVal.id == this.state.indexInMiddle) ? this.largeDim.height : this.smallDim.height}
                                                                    width={(cardVal.id == this.state.indexInMiddle) ? this.largeDim.width : this.smallDim.width}
                                                                    title={cardVal.title}
                                                                    desc={cardVal.desc}
                                                                    to={cardVal.to} 
                                                                ></CardInHome>
                                                                }
                                                        </div>
                                                    )
                                                )
                                            }
                                        </div>
                                    </Grid>
                                    <Grid item xs={1}>
                                        <IconButton onClick={()=>this.RightButtonAction()}>
                                            <ArrowCircleRightIcon></ArrowCircleRightIcon>
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Card>
                            <Grid container spacing={2} style={{ height: "45%" }}>
                                <Grid item xs={7}>
                                    <Card style={{ height: "212px", width: "100%", padding: "10px" }}>
                                        <MDTypography variant="h6" style={{ marginBottom: "-8px" }}>Latest Claims</MDTypography>
                                        <Divider></Divider>
                                        <div style={{ padding: "5px", overflow: "scroll", paddingTop: "0px", scrollbarWidth: "none", marginTop: "-10px" }}>
                                            {
                                                this.latestClaims.map(
                                                    (claim) => (
                                                        <Card style={{ borderRadius: "0px", marginBottom: "5px", padding: "5px", border: "1px solid #B2BEB5", borderLeft: "5px solid #1F3651" }}>
                                                            <Grid container spacing={0.5}>
                                                                <Grid item>
                                                                    <MDTypography variant="h6" style={{ fontSize: "12px" }}>{claim.claimId + ": "}</MDTypography>
                                                                </Grid>
                                                                <Grid item>
                                                                    <MDTypography variant="h6" fontWeight="light" style={{ fontSize: "12px" }}>{"Created for " + claim.policyName + " (" + claim.policyId + ") on " + claim.createdOn}</MDTypography>
                                                                </Grid>
                                                            </Grid>
                                                        </Card>
                                                    )
                                                )
                                            }
                                        </div>
                                    </Card>
                                </Grid>
                                <Grid item xs={5}>
                                    <Card style={{ height: "212px", width: "100%", padding: "10px" }}>
                                        <MDTypography variant="h6">Claims By Status</MDTypography>
                                        <div style={{ overflowY: "hidden", overflowX: "hidden" }}>
                                            <Chart
                                                chartType="PieChart"
                                                data={this.chartData}
                                                options={{ legend: "right", height: "220px", width: "380px", backgroundColor: "transparent", colors: ["#003737", "#005F60", "#009596", "#73C5C5", "#A2D9D9",] }}
                                                style={{
                                                    marginTop: "-15px",
                                                    padding: "-10px",
                                                    marginLeft: "-18px"
                                                }}
                                            />
                                        </div>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={3}>
                            <Card style={{ height: "150px", width: "105%", padding: "20px", paddingTop: "10px",marginBottom: "15px", pointerEvents:"none" }}>
                                <MDTypography variant="h6" style={{ fontSize: "14px" }} fontWeight="light">Claims Made Today</MDTypography>
                                <MDTypography variant="h6" style={{ fontSize: "30px" }}>12</MDTypography>
                                <Chart
                                    chartType="Line"
                                    data={this.claimsPerDayHistory}
                                    options={{
                                        tooltip:{
                                            height: "10px"
                                        },
                                        legend: {position: "none"},
                                        enaableInteractivity: false,
                                        backgroundColor: "transparent",
                                        height: "75px",
                                        hAxis: {textPosition: "none"},
                                        yAxis: {textPosition: "none"},
                                        curveType: 'function'
                                    }}
                                    style={{
                                        paddingTop: "2px",
                                        marginTop: "-5px"
                                    }}
                                />
                            </Card>
                            <Card style={{ height: "325px", width: "105%", padding: "10px" }}>
                                <MDTypography variant="h6" style={{ marginBottom: "-8px" }}>Notifications</MDTypography>
                                <Divider></Divider>
                                <div style={{ padding: "5px", overflow: "scroll", paddingTop: "0px", scrollbarWidth: "none", marginTop: "-10px" }}>
                                    {
                                        this.notifications.map(
                                            (notif) => (
                                                <Card style={{ borderRadius: "0px", marginBottom: "5px", padding: "5px", borderLeft: "5px solid #1F3651" }}>
                                                    <Grid container spacing={1} style={{ display: "flex", alignItems: "center" }}>
                                                        <Grid item xs={2}>
                                                            {notif.icon}
                                                        </Grid>
                                                        <Grid item xs={10}>
                                                            <MDTypography variant="h6" style={{ fontSize: "13px" }}>{notif.Title}</MDTypography>
                                                            <MDTypography variant="h6" fontWeight="light" style={{ fontSize: "12px" }}>{notif.Desc}</MDTypography>
                                                        </Grid>
                                                    </Grid>
                                                </Card>
                                            )
                                        )
                                    }
                                </div>
                            </Card>
                        </Grid>
                    </Grid>
                </InnerContainer>
            </OuterContainer>
        );
    }
}

export  function HomeScreen(){
    const [controller,dispatch] = useMEMPSContext();
    const {role} = controller
    return(
        <HomeScreenInner role={role}></HomeScreenInner>
    )
}