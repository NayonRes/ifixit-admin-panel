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
  Checkbox,
} from "@mui/material";
import moment from "moment";
import { Link } from "react-router-dom";
import { statusList } from "../../data";
import { AuthContext } from "../../context/AuthContext";

import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";

const TransactionList = ({
  loading,
  pageLoading,
  tableDataList,
  clearFilter,
  handleDeleteDialog,
  message,
}) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);

  console.log(
    "statusList",
    statusList?.find((el) => el.name === "Rework")?.color
  );
  const calculateTotalAmount = (transactionInfo) => {
    return transactionInfo?.length
      ? transactionInfo.reduce((acc, item) => acc + (item.amount || 0), 0)
      : 0;
  };

  const formatPaymentMethods = (transactionInfo) => {
    return transactionInfo?.length
      ? transactionInfo.map((item) => `${item.name}: ${item.amount}`).join(", ")
      : "N/A";
  };

  // Calculate total debit and credit amounts
  const calculateTotals = () => {
    let totalDebit = 0;
    let totalCredit = 0;

    tableDataList.forEach((transaction) => {
      const amount = calculateTotalAmount(transaction.transaction_info);
      if (transaction.transaction_type === "debit") {
        totalDebit += amount;
      } else if (transaction.transaction_type === "credit") {
        totalCredit += amount;
      }
    });

    return { totalDebit, totalCredit };
  };

  const { totalDebit, totalCredit } = calculateTotals();

  return (
    <div>
      {/* Summary Section */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          padding: "16px",
          backgroundColor: "#f8f9fa",
          borderRadius: "8px",
          border: "1px solid #e9ecef",
        }}
      >
        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "12px",
            backgroundColor: "#fff",
            borderRadius: "6px",
            border: "1px solid #dee2e6",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#2E7D32",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            Total Income
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: "#2E7D32",
              fontWeight: "bold",
            }}
          >
            {totalCredit.toLocaleString()}
          </Typography>
        </div>

        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "12px",
            backgroundColor: "#fff",
            borderRadius: "6px",
            border: "1px solid #dee2e6",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#D32F2F",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            Total Outgoings (Expenses/ refunds)
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: "#D32F2F",
              fontWeight: "bold",
            }}
          >
            {totalDebit.toLocaleString()}
          </Typography>
        </div>

        <div
          style={{
            flex: 1,
            textAlign: "center",
            padding: "12px",
            backgroundColor: "#fff",
            borderRadius: "6px",
            border: "1px solid #dee2e6",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: "#1976D2",
              fontWeight: "bold",
              marginBottom: "4px",
            }}
          >
            Net Balance
          </Typography>
          <Typography
            variant="h4"
            sx={{
              color: totalCredit - totalDebit >= 0 ? "#2E7D32" : "#D32F2F",
              fontWeight: "bold",
            }}
          >
            {(totalCredit - totalDebit).toLocaleString()}
          </Typography>
        </div>
      </div>

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
              <TableCell style={{ whiteSpace: "nowrap" }}>Date</TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Transaction Name
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Source Type
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Transaction Type
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Payment Methods
              </TableCell>
              <TableCell style={{ whiteSpace: "nowrap" }}>
                Total Amount
              </TableCell>
              {/* <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              tableDataList.length > 0 &&
              tableDataList.map((row, i) => (
                <>
                  <TableRow
                    key={row?._id}
                    // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      {moment(row?.created_at).format("DD/MM/YYYY")}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {row?.transaction_name}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          row?.transaction_source_type
                            ?.charAt(0)
                            .toUpperCase() +
                          row?.transaction_source_type?.slice(1)
                        }
                        variant="outlined"
                        sx={{
                          backgroundColor:
                            row?.transaction_source_type === "repair"
                              ? "#E3F2FD"
                              : row?.transaction_source_type === "warranty"
                              ? "#F3E5F5"
                              : "#FFF3E0",
                          color:
                            row?.transaction_source_type === "repair"
                              ? "#1976D2"
                              : row?.transaction_source_type === "warranty"
                              ? "#7B1FA2"
                              : "#F57C00",
                          border: "none",
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          row?.transaction_type?.charAt(0).toUpperCase() +
                          row?.transaction_type?.slice(1)
                        }
                        variant="outlined"
                        sx={{
                          backgroundColor:
                            row?.transaction_type === "credit"
                              ? "#E8F5E8"
                              : "#FFEBEE",
                          color:
                            row?.transaction_type === "credit"
                              ? "#2E7D32"
                              : "#D32F2F",
                          border: "none",
                        }}
                      />
                    </TableCell>

                    <TableCell
                      sx={{ maxWidth: "200px", wordWrap: "break-word" }}
                    >
                      {formatPaymentMethods(row?.transaction_info)}
                    </TableCell>

                    <TableCell sx={{ fontWeight: "bold" }}>
                      {calculateTotalAmount(
                        row?.transaction_info
                      ).toLocaleString()}
                    </TableCell>

                    {/* <TableCell>
                      <Chip
                        label={row?.status ? "Active" : "Inactive"}
                        variant="outlined"
                        sx={{
                          backgroundColor: row?.status ? "#E8F5E8" : "#FFEBEE",
                          color: row?.status ? "#2E7D32" : "#D32F2F",
                          border: "none",
                        }}
                      />
                    </TableCell> */}
                  </TableRow>
                </>
              ))}

            {!loading && tableDataList.length < 1 ? (
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell colSpan={8} style={{ textAlign: "center" }}>
                  <strong> {message}</strong>
                </TableCell>
              </TableRow>
            ) : null}
            {loading && pageLoading()}
          </TableBody>
        </Table>
      </div>
      {/* {tableDataList.length > 0 ? (
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
      )} */}
    </div>
  );
};

export default TransactionList;
