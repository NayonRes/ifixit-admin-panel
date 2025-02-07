import React, { useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import UpdateUser from "./UpdateUser";
import { Chip, IconButton, TablePagination, Typography } from "@mui/material";
import moment from "moment";
import { Link } from "react-router-dom";
import { statusList } from "../../data";
import { AuthContext } from "../../context/AuthContext";

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
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  console.log(
    "statusList",
    statusList?.find((el) => el.name === "Rework")?.color
  );
  const calculateTotalAmount = (data) => {
    const issueTotal = data?.issues?.length
      ? data.issues.reduce((acc, issue) => acc + (issue.repair_cost || 0), 0)
      : 0;

    const sparePartsTotal = data?.spare_parts?.length
      ? data.spare_parts.reduce((acc, part) => acc + (part.price || 0), 0)
      : 0;

    const totalCost = issueTotal + sparePartsTotal;

    return <TableCell>{totalCost}</TableCell>;
  };
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
              {/* <TableCell
                style={{ whiteSpace: "nowrap" }}
                colSpan={2}
              ></TableCell> */}

              <TableCell style={{ whiteSpace: "nowrap" }}>
                Date / Branch
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Name / Number
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Job / Invoice No
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Issues</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Spare Parts
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Paid Amount
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Due Amount</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Total Amount
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>
              {ifixit_admin_panel?.user?.permission?.includes(
                "update_repair"
              ) && (
                <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                  Actions
                </TableCell>
              )}
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
                    {/* <TableCell sx={{ width: "30px", pr: 0 }}>
                 
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

                  
                    </TableCell> */}
                    <TableCell>
                      {" "}
                      {moment(row?.created_at).format("DD/MM/YYYY")}
                      <br />
                      <span style={{ color: "#4B46E5" }}>
                        {row?.branch_data[0]?.name}
                      </span>
                    </TableCell>
                    <TableCell>
                      {row?.customer_data[0]?.name}

                      <br />
                      <span style={{ color: "#424949" }}>
                        {row?.customer_data[0]?.mobile}
                      </span>
                    </TableCell>

                    <TableCell>
                      {row?.repair_id ? row?.repair_id : "-------"}
                    </TableCell>

                    <TableCell>
                      {row?.issues?.length > 0 ? (
                        <>
                          {row?.issues?.map((item, index) => (
                            <Chip
                              size="small"
                              label={item.name}
                              variant="outlined"
                              sx={{
                                mr: 1,
                                px: 1,
                                my: 0.5,
                              }}
                            />
                          ))}
                        </>
                      ) : (
                        "----------"
                      )}
                    </TableCell>
                    <TableCell>
                      {row?.spare_parts?.length > 0 ? (
                        <>
                          {row?.spare_parts?.map((item, index) => (
                            <Chip
                              size="small"
                              label={item.name}
                              variant="outlined"
                              sx={{
                                mr: 1,
                                px: 1,
                                my: 0.5,
                              }}
                            />
                          ))}
                        </>
                      ) : (
                        "----------"
                      )}
                    </TableCell>

                    <TableCell>
                      {row?.payment_info?.length > 0
                        ? row?.payment_info.reduce(
                            (sum, item) => sum + item.amount,
                            0
                          )
                        : 0}
                    </TableCell>
                    <TableCell sx={{ color: "#D92D20" }}>
                      {row?.due_amount ? row?.due_amount : "-------"}
                    </TableCell>
                    <TableCell sx={{ color: "#D92D20" }}>
                      {calculateTotalAmount(row)}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={row.repair_status}
                        variant="outlined"
                        // color="info"
                        sx={{
                          border: "0px",
                          backgroundColor:
                            statusList.find(
                              (el) => el.name === row.repair_status
                            )?.color || "black",
                        }}
                      />
                    </TableCell>

                    {/* <TableCell align="center" style={{ minWidth: "130px" }}>
                        <Invoice data={row} />
                      </TableCell> */}

                    {ifixit_admin_panel?.user?.permission?.includes(
                      "update_repair"
                    ) && (
                      <TableCell align="right">
                        {/* <UpdateUser clearFilter={clearFilter} row={row} /> */}
                        <IconButton
                          variant="contained"
                          // color="success"
                          disableElevation
                          component={Link}
                          to={`/repair-search?repairId=${row?._id}`}
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
                        </IconButton>

                        {/* <IconButton
                        variant="contained"
                        disableElevation
                        onClick={() => handleDeleteDialog(i, row)}
                      >
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
                      </IconButton> */}
                      </TableCell>
                    )}
                  </TableRow>
                </>
              ))}

            {!loading && tableDataList.length < 1 ? (
              <TableRow>
                <TableCell colSpan={10} style={{ textAlign: "center" }}>
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
