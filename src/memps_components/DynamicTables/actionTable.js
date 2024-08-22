import { IconButton, Table, TableBody, TableHead, TableCell, TableContainer, TableRow, Collapse, Box, Divider, Card, Grid, Icon, TablePagination, TextField, InputAdornment, Tooltip, Snackbar } from "@mui/material";
import React from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MDTypography from "components/MDTypography";
import axios from "axios";
import { Close, Delete, Edit, Search } from "@mui/icons-material";
import NoDataFound from "assets/images/LookingIntoVoid.png"
import colors from "assets/theme/base/colors";
import { PopupForm } from "memps_components/Popup/popupForm";
import { ProviderForm } from "memps_components/ProviderComponents/providerForm";
import { SuccessAlert } from "memps_components/SuccessAlert/successAlert";
import { ConfirmDeletionForm } from "memps_components/ConfirmationScreen/confirmDeletionForm";

export default class ActionTable extends React.Component {
  constructor(props) {
    super(props);
    //sum of width array should be 10
    this.state = { data: this.props.values, headers: this.props.headers, attrib: this.props.attrib, page: 0, rowsPerPage: 6, width: this.props.width, searchTerm: "" };
    this.handlePageChange = this.handlePageChange.bind(this);
    console.log(this.props.form);
    this.concatObjectData = this.concatObjectData.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.values !== this.props.values) {
      this.setState({ data: this.props.values });
    }
  }
  handlePageChange(event, newPage) {
    this.setState({
      page: newPage
    });
  }
  concatObjectData(obj) {
    var res = "";
    if (this.props.attribToFilter)
      for (var temp of this.props.attribToFilter)
        res = res.concat(getNestedObjectVal(obj, temp), "¶");
    else
      for (var temp in obj)
        res = res.concat(getNestedObjectVal(obj, temp), "¶");
    console.log(res);
    return res;
  }
  render() {
    const { data, page, rowsPerPage, width } = this.state;
    const tableData = data.filter((obj) => this.concatObjectData(obj).toLowerCase().includes(this.state.searchTerm.toLowerCase()));
    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
    const startIndex = page * rowsPerPage;
    const endIndex = (startIndex + rowsPerPage) > tableData.length ? tableData.length : (startIndex + rowsPerPage);
    return (
      <React.Fragment>
        <div style={{ alignSelf: "start", display: this.props.disableSearch && "none" }}>
          <Tooltip title={this.props.tooltipText} placement="right-start">
            <TextField
              name="name"
              variant="outlined"
              fullWidth
              value={this.state.searchTerm}
              onChange={(event) => {
                const { value } = event.target;
                this.setState({ searchTerm: value });
              }}
              style={{ marginBottom: "15px", marginTop: "10px" }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search fontSize="medium" />
                  </InputAdornment>
                ),
              }}
              size="small"
              placeholder="Start typing to search..."
            />
          </Tooltip>
        </div>
        <TableContainer style={{ borderRadius: "10px", overflowX: "hidden" }}>
          <Card style={{ minHeight: "395px" }}>
            <Table aria-label="collapsible table" style={{ width: "100%", borderWidth: "0px" }}>
              <Card
                style={{
                  background: "linear-gradient(#1d403c, #25524c)",
                  borderRadius: "10px",
                  paddingBottom: "10px",
                  paddingTop: "5px",
                  paddingLeft: "10px"
                }}
              >
                <TableRow style={{ width: "100%", borderWidth: "0px" }}>
                  <Grid container spacing={1}>
                    {this.props.headers.map((header) => (
                      <Grid item xs={this.state.width[this.state.headers.indexOf(header)]}>
                        <TableCell align="center" style={{ borderBottom: "none" }}>
                          <MDTypography variant="h6" color="white" style={{ fontSize: "15px" }}>
                            {header}
                          </MDTypography>
                        </TableCell>
                      </Grid>))
                    }
                    <Grid item xs={0.5}><TableCell style={{ borderBottom: "none" }} /></Grid>
                    <Grid item xs={0.5}><TableCell style={{ borderBottom: "none" }} /></Grid>
                  </Grid>
                </TableRow>
              </Card>{
                tableData.length >= 1 ?
                  <TableBody style={{ width: "100%" }}>
                    {tableData.slice(startIndex, endIndex).map((data) => (
                      <Row data={data} attrib={this.state.attrib} width={this.state.width} ChildForm={this.props.form} initiateRerender={this.props.initiateRerender} title={this.props.title} postMethod={this.props.postMethod}></Row>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  :
                  <div style={{ pointerEvents: "none", marginTop: "2%", marginLeft: "34%" }}>
                    <img src={NoDataFound} style={{ height: "250px", width: "250px" }}></img>
                    <MDTypography variant="h5" fontWeight="regular" style={{ color: colors.grey["500"], fontSize: "18px" }}>Sigh! You are looking into a void.</MDTypography>
                  </div>
              }
            </Table>
          </Card>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          showFirstButton={true}
          showLastButton={true}
          count={tableData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          style={{ display: this.props.disableSearch && "none" }}
          onPageChange={this.handlePageChange}
          labelDisplayedRows={
            ({ from, to, count }) => {
              return (<MDTypography variant="h6" fontWeight="light" style={{ fontSize: "14px" }}>{"Record " + from + " - " + to + "  of  " + count}</MDTypography>);
            }
          }
        />
      </React.Fragment>
    );
  }
}

function Row({ data, attrib, width, ChildForm, initiateRerender, title, postMethod }) {
  const [open, setOpen] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  return (
    <React.Fragment>
      <Card style={{ marginTop: "3px", borderColor: "gray", paddingLeft: "10px" }}>
        <TableRow style={{ width: "100%", borderWidth: "0px" }}>
          <Grid container spacing={1}>
            {attrib.map((attribute => (<Grid item xs={width[attrib.indexOf(attribute)]}><TableCell align="center" style={{ borderBottom: "none" }}>
              <MDTypography variant="h6" fontWeight="regular" style={{ fontSize: "14.5px" }}>
                {
                  attribute.includes('(') ? getNestedObjectVal(data, attribute.split("(")[0]) + " (" + getNestedObjectVal(data, attribute.split("(")[1].substring(0, attribute.split("(")[1].length - 1)) + ")" :
                    !getNestedObjectVal(data, attribute) ? "-" : getNestedObjectVal(data, attribute)
                }
              </MDTypography>
            </TableCell></Grid>)))}
            <Grid item xs={0.5}>
              <TableCell style={{ borderBottom: "none" }}>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpen(true)}
                >
                  <Edit />
                </IconButton>
              </TableCell>
              <PopupForm open={open} onClose={() => setOpen(false)}>
                <ChildForm cancel={() => setOpen(false)} data={data} submit={() => { setSuccess(true); setOpen(false); initiateRerender(); }} />
              </PopupForm>
              <PopupForm open={openDelete} onClose={() => setOpenDelete(false)}>
                <ConfirmDeletionForm onClick={() => setOpenDelete(false)} pk={data[attrib[0]]} title={title} postMethod={()=>{postMethod(data); setSuccess(true);}} />
              </PopupForm>
            </Grid>
            <Grid item xs={0.5}>
              <TableCell style={{ borderBottom: "none" }}>
                <IconButton
                  aria-label="expand row"
                  size="small"
                  onClick={() => setOpenDelete(true)}
                >
                  <Delete />
                </IconButton>
              </TableCell>
            </Grid>
          </Grid>
        </TableRow>
      </Card>
      <SuccessAlert open={success} onClose={()=>setSuccess(false)}/>
    </React.Fragment>
  )
}
function getNestedObjectVal(obj, attrib) {
  if (obj == null)
    return null
  var index = attrib.indexOf('.');
  if (index != -1) {
    return getNestedObjectVal(obj[attrib.slice(0, index)], attrib.slice(index + 1))
  }
  return attrib.includes("On") || attrib.includes("Date") && obj[attrib] ? new Date(obj[attrib]).toDateString() : obj[attrib];;
}
