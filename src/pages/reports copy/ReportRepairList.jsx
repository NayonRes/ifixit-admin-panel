import React, { useContext } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import {
  Button,
  Chip,
  IconButton,
  TablePagination,
  Typography,
} from "@mui/material";
import moment from "moment";
import { Link } from "react-router-dom";
import { statusList } from "../../data";
import { AuthContext } from "../../context/AuthContext";

import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

const ReportRepairList = ({
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

    const sparePartsTotal = data?.product_details?.length
      ? data.product_details.reduce((acc, part) => acc + (part.price || 0), 0)
      : 0;

    const totalCost = issueTotal + sparePartsTotal;

    return totalCost;
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

              <TableCell style={{ whiteSpace: "nowrap" }}>
                Paid Amount
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Due Amount</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Discount Amount
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Total Amount
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>
              <TableCell align="center" style={{ whiteSpace: "nowrap" }}>
                View Details
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
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
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
                      {row?.discount_amount ? row?.discount_amount : "-------"}
                    </TableCell>
                    <TableCell>{calculateTotalAmount(row)}</TableCell>

                    <TableCell>
                      {row?.repair_status_history_data?.length > 0
                        ? (() => {
                            const lastStatus =
                              row.repair_status_history_data[
                                row.repair_status_history_data.length - 1
                              ];
                            const statusColor =
                              statusList.find(
                                (el) =>
                                  el.name === lastStatus.repair_status_name
                              )?.color || "";

                            return (
                              <Chip
                                label={lastStatus.repair_status_name}
                                variant="outlined"
                                sx={{
                                  border: "0px",
                                  backgroundColor: statusColor,
                                }}
                              />
                            );
                          })()
                        : "----------"}
                    </TableCell>

                    <TableCell align="center" style={{ minWidth: "130px" }}>
                      <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        startIcon={<ListAltOutlinedIcon />}
                        component={Link}
                        to={`/repair/details/${row?._id}`}
                      >
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                </>
              ))}

            {!loading && tableDataList.length < 1 ? (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell colSpan={11} style={{ textAlign: "center" }}>
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

export default ReportRepairList;
