import { IconButton, Table, TableBody, TableHead, TableCell, TableContainer, TableRow, Collapse, Box, Divider, Card, Grid, Icon, TablePagination, TextField, InputAdornment, Tooltip } from "@mui/material";
import React from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MDTypography from "components/MDTypography";
import axios from "axios";
import { Search } from "@mui/icons-material";
import NoDataFound from "assets/images/EmptyCart.png"
import colors from "assets/theme/base/colors";

export default class ViewAllTable extends React.Component {
  constructor(props) {
    super(props);
    //sum of width array should be 11
    this.state = { data: this.props.values, headers: this.props.headers, attrib: this.props.attrib, content: this.props.content, apiLink: this.props.apiLink, page: 0, rowsPerPage: this.props.rows || 6, width: this.props.width, searchTerm: "" };
    this.handlePageChange = this.handlePageChange.bind(this);
  }
  loadData = async () => {
    await axios.get(this.state.apiLink).then((response) => { this.setState({ data: response.data }); console.log(response.data) })
  }
  componentDidMount() {
    //this.loadData();
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
        <div style={{ alignSelf: "start" }}>
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
                    <Grid item xs={1}><TableCell style={{ borderBottom: "none" }} /></Grid>
                  </Grid>
                </TableRow>
              </Card>{
                tableData.length >= 1 ?
                  <TableBody style={{ width: "100%" }}>
                    {tableData.slice(startIndex, endIndex).map((data) => (
                      <Row data={data} attrib={this.state.attrib} content={this.state.content} width={this.state.width} disableExpansion = {this.props.disableExpansion}></Row>
                    ))}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                  :
                  <div style={{ pointerEvents: "none", marginTop: "2%", marginLeft: "34%", alignItems: "center" }}>
                    <img src={NoDataFound} style={{ height: "250px", width: "300px" }}></img>
                    <MDTypography variant="h5" fontWeight="regular" style={{ color: colors.grey["500"], fontSize: "20px", marginLeft: "60px", marginTop: "-10px" }}>No Data Found!</MDTypography>
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

function Row({ data, attrib, content, width, disableExpansion }) {
  const [open, setOpen] = React.useState(false);
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
            <Grid item xs={1}>
              <TableCell style={{ borderBottom: "none" }}>
                {
                  disableExpansion || <IconButton
                    aria-label="expand row"
                    size="small"
                    onClick={() => setOpen(!open)}
                  >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                  </IconButton>
                }
              </TableCell>
            </Grid>
          </Grid>
        </TableRow>
        {
          disableExpansion ||
          <TableRow>
          <TableCell style={{ paddingBottom: "0px", paddingTop: "0px", borderBottom: "none" }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              {content(data)}
            </Collapse>
          </TableCell>
        </TableRow>
        }
      </Card>
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
