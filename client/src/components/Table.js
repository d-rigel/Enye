import React from "react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import {
  ProfilesContext,
  getProfileDetails,
  closeModal,
} from "../context";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import TablePagination from "@material-ui/core/TablePagination";
import ProfileModal from "./ProfileModal";


const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&:hover": {
      backgroundColor: "black",
      "& td": {
        color: "white !important",
      },
    },
  },
}))(TableRow);

const useStyles = makeStyles({
  table: {
    minWidth: 700,
  },
});

const CustomizedTable = () => {
  const classes = useStyles();
  const [rowsPerPage, setRowsPerPage] = React.useState(20);
  const [page, setPage] = React.useState(0);
  const { state, dispatch } = React.useContext(ProfilesContext);
  const { profiles, profile, open } = state;

  const rows = profiles;

  const handleClickOpen = (data) => {
    getProfileDetails(dispatch, data);
  };

  const handleClose = () => {
    closeModal(dispatch);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>First Name</StyledTableCell>
              <StyledTableCell align="right">Last Name</StyledTableCell>
              <StyledTableCell align="right">Gender</StyledTableCell>
              <StyledTableCell align="right">Payment Method</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <StyledTableRow
                  key={index}
                  onClick={() => handleClickOpen(row)}
                >
                  <StyledTableCell scope="row">{row.FirstName}</StyledTableCell>
                  <StyledTableCell align="right">
                    {row.LastName}
                  </StyledTableCell>
                  <StyledTableCell align="right">{row.Gender}</StyledTableCell>
                  <StyledTableCell align="right">
                    {row.PaymentMethod}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[20]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </TableContainer>
      {open ? (
        <ProfileModal
          open={open}
          scroll={"paper"}
          handleClose={handleClose}
          info={profile}
        />
      ) : null}
    </>
  );
};

export default CustomizedTable;
