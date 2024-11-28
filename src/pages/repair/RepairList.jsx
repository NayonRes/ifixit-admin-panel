import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import UpdateUser from "./UpdateUser";
import { IconButton, TablePagination } from "@mui/material";

const RepairList = ({
  loading,
  pageLoading,
  tableDataList,
  clearFilter,
  handleDeleteDialog,
  message,
  totalData,
  rowsPerPage,
  page,
  handleChangePage,
  handleChangeRowsPerPage,
}) => {
  return (
    <div>
      <div
        style={{
          overflowX: "auto",

          minWidth: "100%",
          width: "Calc(100vw - 385px)",
          // padding: "10px 16px 0px",
          boxSizing: "border-box",
        }}
      >
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell style={{ whiteSpace: "nowrap" }} colSpan={2}>
                Name
              </TableCell>

              <TableCell style={{ whiteSpace: "nowrap" }}>
                Designation
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Email</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Mobile Number
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Branch</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>

              <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              tableDataList.length > 0 &&
              tableDataList.map((row, i) => (
                <>
                  <TableRow
                    key={row?.user_id}
                    // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell sx={{ width: "30px", pr: 0 }}>
                      {/* {row?.image?.url?.length > 0 ? (
                          <> */}
                      <img
                        src={
                          row?.image?.url?.length > 0
                            ? row?.image?.url
                            : "/userpic.png"
                        }
                        alt=""
                        width="30px"
                        height="30px"
                        style={{
                          display: "block",
                          margin: "5px 0px",
                          borderRadius: "100px",
                          // border: "1px solid #d1d1d1",
                        }}
                      />

                      {/* </>
                        ) : (
                          "No Image"
                        )} */}
                    </TableCell>
                    <TableCell>{row?.name}</TableCell>
                    <TableCell>{row?.designation}</TableCell>
                    <TableCell>{row?.email}</TableCell>
                    <TableCell>
                      {row?.mobile ? row?.mobile : "-------"}
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {row?.branch_data[0]?.name
                        ? row?.branch_data[0]?.name
                        : "-------"}
                    </TableCell>

                    <TableCell>
                      {row?.status ? (
                        <>
                          <TaskAltOutlinedIcon
                            style={{
                              color: "#10ac84",
                              height: "16px",
                              position: "relative",
                              top: "4px",
                            }}
                          />{" "}
                          <span
                            style={{
                              color: "#10ac84",
                            }}
                          >
                            Active &nbsp;
                          </span>
                        </>
                      ) : (
                        <>
                          <HighlightOffOutlinedIcon
                            style={{
                              color: "#ee5253",
                              height: "16px",
                              position: "relative",
                              top: "4px",
                            }}
                          />
                          <span
                            style={{
                              color: "#ee5253",
                            }}
                          >
                            Inactive
                          </span>
                        </>
                      )}
                    </TableCell>

                    {/* <TableCell align="center" style={{ minWidth: "130px" }}>
                        <Invoice data={row} />
                      </TableCell> */}
                    <TableCell align="right">
                      <UpdateUser clearFilter={clearFilter} row={row} />
                      {/* <IconButton
                          variant="contained"
                          // color="success"
                          disableElevation
                          component={Link}
                          to={`/update-category`}
                          state={{ row }}
                        >
                        
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            id="Outline"
                            viewBox="0 0 24 24"
                            width="18"
                            height="18"
                          >
                            <path
                              d="M18.656.93,6.464,13.122A4.966,4.966,0,0,0,5,16.657V18a1,1,0,0,0,1,1H7.343a4.966,4.966,0,0,0,3.535-1.464L23.07,5.344a3.125,3.125,0,0,0,0-4.414A3.194,3.194,0,0,0,18.656.93Zm3,3L9.464,16.122A3.02,3.02,0,0,1,7.343,17H7v-.343a3.02,3.02,0,0,1,.878-2.121L20.07,2.344a1.148,1.148,0,0,1,1.586,0A1.123,1.123,0,0,1,21.656,3.93Z"
                              fill="#787878"
                            />
                            <path
                              d="M23,8.979a1,1,0,0,0-1,1V15H18a3,3,0,0,0-3,3v4H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2h9.042a1,1,0,0,0,0-2H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H16.343a4.968,4.968,0,0,0,3.536-1.464l2.656-2.658A4.968,4.968,0,0,0,24,16.343V9.979A1,1,0,0,0,23,8.979ZM18.465,21.122a2.975,2.975,0,0,1-1.465.8V18a1,1,0,0,1,1-1h3.925a3.016,3.016,0,0,1-.8,1.464Z"
                              fill="#787878"
                            />
                          </svg>
                        </IconButton> */}

                      <IconButton
                        variant="contained"
                        disableElevation
                        onClick={() => handleDeleteDialog(i, row)}
                      >
                        {/* <DeleteOutlineIcon color="error" /> */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          id="Outline"
                          viewBox="0 0 24 24"
                          width="20"
                          height="20"
                        >
                          <path
                            d="M21,4H17.9A5.009,5.009,0,0,0,13,0H11A5.009,5.009,0,0,0,6.1,4H3A1,1,0,0,0,3,6H4V19a5.006,5.006,0,0,0,5,5h6a5.006,5.006,0,0,0,5-5V6h1a1,1,0,0,0,0-2ZM11,2h2a3.006,3.006,0,0,1,2.829,2H8.171A3.006,3.006,0,0,1,11,2Zm7,17a3,3,0,0,1-3,3H9a3,3,0,0,1-3-3V6H18Z"
                            fill="#F91351"
                          />
                          <path
                            d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18Z"
                            fill="#F91351"
                          />
                          <path
                            d="M14,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"
                            fill="#F91351"
                          />
                        </svg>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </>
              ))}

            {!loading && tableDataList.length < 1 ? (
              <TableRow>
                <TableCell colSpan={15} style={{ textAlign: "center" }}>
                  <strong> {message}</strong>
                </TableCell>
              </TableRow>
            ) : null}
            {loading && pageLoading()}
          </TableBody>
        </Table>
      </div>
      {tableDataList.length > 0 ? (
        <div>
          <TablePagination
            style={{ display: "block", border: "none" }}
            rowsPerPageOptions={[]}
            count={totalData}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      ) : (
        <br />
      )}
    </div>
  );
};

export default RepairList;
