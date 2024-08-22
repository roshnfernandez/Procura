import { IconButton, Table, TableBody, TableHead, TableCell, TableContainer, TableRow, Collapse, Box, Divider, Tooltip, TextField, InputAdornment, TablePagination } from "@mui/material";
import React from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import MDTypography from "components/MDTypography";
import { Link } from "react-router-dom";
import { Search } from "@mui/icons-material";
import NoDataFound from "assets/images/EmptyCart.png"
import colors from "assets/theme/base/colors";

export default class InnerTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: this.props.values || [], headers: this.props.headers, attrib: this.props.attrib, fontSize: this.props.fontSize, page: 0, rowsPerPage: 5, searchTerm: "" };
    this.handlePageChange = this.handlePageChange.bind(this);
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
              style={{ marginBottom: "15px", marginTop: "-10px" }}
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
        <TableContainer style={{ borderRadius: "4px", minHeight: this.props.disableMinWidth || "330px" }}>
          <Table>
            <TableHead sx={{ display: "table-header-group", background: "linear-gradient(#1d403c, #25524c)" }}>
              <TableRow>
                {this.state.headers.map((header) => (
                  <TableCell align="left">
                    <MDTypography variant="h6" color="white" style={{ fontSize: this.state.fontSize }}>
                      {header}
                    </MDTypography>
                  </TableCell>))
                }
              </TableRow>
            </TableHead>
            {tableData.length >= 1 ?
              <TableBody>
                {tableData.slice(startIndex, endIndex).map((data) => (
                  <Row data={data} attrib={this.state.attrib} linkIndex={this.props.linkIndex} link={this.props.link} indexEven={this.state.data.indexOf(data) % 2 == 0} fontSize={this.state.fontSize}></Row>
                ))}
              </TableBody> :
              <TableRow>
              <TableCell/>
              <TableCell colSpan={this.state.attrib.length-1}>
              <div style={{ pointerEvents: "none", marginTop: "2%", alignItems: "center", marginLeft: "10%" }}>
                <img src={NoDataFound} style={{ height: "200px", width: "250px" }}></img>
              </div>
              </TableCell>
              </TableRow>
            }
          </Table>
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
          style={{ display: this.props.disableSearch && "none" }}
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

function Row({ data, attrib, indexEven, fontSize, linkIndex, link }) {
  return (
    <React.Fragment>
      <TableRow style={{ backgroundColor: indexEven ? "#FFFFFF" : "#f7f7f7" }}>
        {attrib.map((attribute, index) => {
          console.log(attribute, index, linkIndex)
          return (
            <TableCell align="left">
              {
                linkIndex == index ?
                  <Link to={link + data[attribute]}>
                    <MDTypography variant="h6" fontWeight="regular" style={{ fontSize: fontSize }}><u>{
                      attribute.includes('(') ? getNestedObjectVal(data, attribute.split("(")[0]) + " (" + getNestedObjectVal(data, attribute.split("(")[1].substring(0, attribute.split("(")[1].length - 1)) + ")" :
                        !getNestedObjectVal(data, attribute) ? "-" : getNestedObjectVal(data, attribute)
                    }
                    </u>
                    </MDTypography>
                  </Link> :
                  <MDTypography variant="h6" fontWeight="regular" style={{ fontSize: fontSize }}>{
                    attribute.includes('(') ? getNestedObjectVal(data, attribute.split("(")[0]) + " (" + getNestedObjectVal(data, attribute.split("(")[1].substring(0, attribute.split("(")[1].length - 1)) + ")" :
                      !getNestedObjectVal(data, attribute) ? "-" : getNestedObjectVal(data, attribute)
                  }
                  </MDTypography>
              }
            </TableCell>)
        })}
      </TableRow>
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
  return (attrib.includes("On") || attrib.includes("Date")) && obj[attrib] ? new Date(obj[attrib]).toDateString() : obj[attrib];
}  