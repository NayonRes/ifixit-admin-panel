import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  useContext,
} from "react";
import { AuthContext } from "../../context/AuthContext";
import Grid from "@mui/material/Grid2";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import { Box, Divider, TextField, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import PulseLoader from "react-spinners/PulseLoader";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { getDataWithToken } from "../../services/GetDataService";

import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import Checkbox from "@mui/material/Checkbox";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextEditor from "../../utils/TextEditor";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TableContainer } from "@mui/material";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import { handlePutData } from "../../services/PutDataService";

import { handlePostData } from "../../services/PostDataService";
import moment from "moment";
import { transferStatusList } from "../../data";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "16px 24px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#EAECF0",
  borderStyle: "dashed",
  backgroundColor: "#fff",
  // color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
  borderRadius: "12px",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#F9FAFB",
  padding: "16px 12px",
  borderRadius: "8px !important",
  border: "1px solid #EAECF0",
  cursor: "pointer",
}));
const DetailsStockTransfer = ({ clearFilter }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const [addDialog, setAddDialog] = useState(false);
  const [supplierList, setSupplierList] = useState([]);
  const [supplier, setSupplier] = useState("");
  const [branchList, setBranchList] = useState([]);
  const [transferFrom, setTransferFrom] = useState("");
  const [transferTo, setTransferTo] = useState("");

  const [purchaseDate, setPurchaseDate] = useState(null);
  const [shippingCharge, setShippingCharge] = useState("");

  const [note, setNote] = useState("");
  const [transferStatus, setTransferStatus] = useState("");

  const [branch, setBranch] = useState("");
  const [purchaseStatus, setPurchaseStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [invoiceNo, setInvoiceNo] = useState("");
  const [searchProductText, setsearchProductText] = useState("");
  const [productList, setProductList] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [purchaseBy, setPurchaseBy] = useState("");
  const [userList, setUserList] = useState([]);

  const [brandId, setBrandId] = useState([]);
  const [categoryId, setCategoryId] = useState([]);

  const [brandList, setBrandList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);

  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState("");

  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading3, setLoading3] = useState(false);

  const [message, setMessage] = useState("");
  const [details, setDetails] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const handleDialogClose = (event, reason) => {
    if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
      setAddDialog(false);
    }
  };

  const handleSnakbarOpen = (msg, vrnt) => {
    let duration;
    if (vrnt === "error") {
      duration = 3000;
    } else {
      duration = 1000;
    }
    enqueueSnackbar(msg, {
      variant: vrnt,
      autoHideDuration: duration,
    });
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (productList.length < 1) {
      return handleSnakbarOpen("Please enter product", "error");
    }
    setLoading(true);

    // var formdata = new FormData();
    // formdata.append("name", name);

    // formdata.append("parent_id", parent_id);
    const skus = productList.map((product) => parseInt(product?.sku_number));

    let data = {
      transfer_from: transferFrom,
      transfer_to: transferTo,
      shipping_charge: parseInt(shippingCharge),
      remarks: note,
      transfer_stocks_sku: skus,
    };
    console.log("data", data);

    let response = await handlePutData(
      `/api/v1/transferStock/update/${id}`,
      data,
      false
    );

    console.log("response", response);
    if (response?.status === 401) {
      logout();
      return;
    }
    if (response.status >= 200 && response.status < 300) {
      setLoading(false);
      handleSnakbarOpen("Added successfully", "success");
      setProductList([]);
      setTransferFrom("");
      setTransferTo("");
      setShippingCharge("");
      setNote("");
      navigate("/stock-transfer-list");
    } else {
      setLoading(false);
      handleSnakbarOpen(response?.data?.message, "error");
    }

    // }
  };

  const customeTextFeild = {
    boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
    // padding: "15px 20px",

    // "& label.Mui-focused": {
    //   color: "#A0AAB4",
    // },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-input": {
      // padding: "15px 24px 15px 0px",
    },
    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px",
      "& fieldset": {
        borderColor: "",
      },

      "&:hover fieldset": {
        borderColor: "#969696",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#969696",
      },
    },
  };
  const custopDatePickerFeild = {
    boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
    background: "#ffffff",

    "& .MuiInputBase-root": {
      fontSize: "0.875rem", // Adjust font size for a smaller appearance
      height: "2.5rem",
    },

    "& label.Mui-focused": {
      color: "#E5E5E5",
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },

    "& .MuiOutlinedInput-input": {
      // padding: "10px 16px", (uncomment if needed)
    },

    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px", (uncomment if needed)
      "& fieldset": {
        borderColor: "#", // Update with a specific color if needed
      },

      "&:hover fieldset": {
        borderColor: "#969696",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#969696",
      },
    },
  };
  const customeSelectFeild = {
    boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
    background: "#ffffff",

    "& label.Mui-focused": {
      color: "#E5E5E5",
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-input": {
      // padding: "10px 16px",
    },
    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px",
      "& fieldset": {
        borderColor: "#",
      },

      "&:hover fieldset": {
        borderColor: "#969696",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#969696",
      },
    },
  };
  const customeSelectFeildSmall = {
    boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
    background: "#ffffff",

    "& label.Mui-focused": {
      color: "#E5E5E5",
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-input": {
      padding: "6px 16px",
      fontSize: "14px",
    },

    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px",
      "& fieldset": {
        borderColor: "#",
      },

      "&:hover fieldset": {
        borderColor: "#969696",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#969696",
      },
    },
  };

  const getProducts = async () => {
    // e.preventDefault();
    setSearchLoading(true);
    let url;

    url = `/api/v1/stock?sku_number=${parseInt(searchProductText)}`;

    let allData = await getDataWithToken(url);
    console.log("(allData?.data?.data products", allData?.data?.data);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setSearchLoading(false);

      if (allData?.data?.data.length > 0) {
        const isSkuPresent = productList.some(
          (product) =>
            parseInt(product.sku_number) === allData?.data?.data[0]?.sku_number
        );
        console.log("isSkuPresent", isSkuPresent);

        if (!isSkuPresent) {
          console.log(
            "111111111111111111111111111111",
            allData?.data?.data[0]?.stock_status !== "Returned",
            allData?.data?.data[0]?.stock_status
          );

          if (allData?.data?.data[0]?.stock_status !== "Returned") {
            console.log("*************************");

            setProductList([
              {
                ...allData?.data?.data[0],
                note: "",

                spare_parts_name:
                  allData?.data?.data[0]?.sparepart_data[0].name,
                spare_parts_variation_name:
                  allData?.data?.data[0]?.spare_parts_variation_data[0].name,
                purchase_date:
                  allData?.data?.data[0]?.purchase_data[0].purchase_date,
                unit_price:
                  allData?.data?.data[0]?.purchase_products_data[0].unit_price,
              },
              ...productList,
            ]);
            setsearchProductText("");
          } else {
            handleSnakbarOpen("This product is already returned", "error");
          }
        } else {
          handleSnakbarOpen("This product is already in the list", "error");
        }
      }

      if (allData.data.data.length < 1) {
        handleSnakbarOpen("No product found", "error");
      }
    } else {
      setSearchLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
  };
  const handleSelectedProduct = (item) => {
    console.log("item", item);
    setDetails(item);
    setAddDialog(true);

    // if (selectedProducts.some((res) => res._id === item._id)) {
    //   setSelectedProducts(
    //     selectedProducts.filter((res) => res._id !== item._id)
    //   );
    // } else {
    //   setSelectedProducts([
    //     ...selectedProducts,
    //     {
    //       ...item,
    //       product_id: item.product_id,
    //       product_variation_id: item._id,
    //       purchase_product_status: "",
    //       quantity: "",
    //       unit_price: "",
    //     },
    //   ]);
    // }
  };

  const getBranchList = async () => {
    setLoading2(true);

    let url = `/api/v1/branch/dropdownlist`;
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setBranchList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading2(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading2(false);
  };

  const getData = async () => {
    setLoading3(true);

    let url = `/api/v1/transferStock/${encodeURIComponent(id.trim())}`;
    let allData = await getDataWithToken(url);
    console.log("allData?.data?.data", allData?.data?.data);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      // setTableDataList(allData?.data?.data);
      setTransferFrom(allData?.data?.data?.transfer_from_data[0]?.name);
      setTransferTo(allData?.data?.data?.transfer_to_data[0]?.name);
      setShippingCharge(allData?.data?.data?.shipping_charge);
      setNote(allData?.data?.data?.remarks);
      setTransferStatus(allData?.data?.data?.transfer_status);
      let newSKUdetails = allData?.data?.data?.sku_details?.map((item) => ({
        ...item,
        spare_parts_name: allData?.data?.data?.spare_parts_details?.find(
          (res) => res._id === item?.product_id
        )?.name,
        spare_parts_variation_name:
          allData?.data?.data?.spare_parts_variation_details?.find(
            (res) => res._id === item?.product_variation_id
          )?.name,
        purchase_date: allData?.data?.data?.purchase_details?.find(
          (res) => res._id === item?.purchase_id
        )?.purchase_date,
        unit_price: allData?.data?.data?.purchase_product_details?.find(
          (res) => res._id === item?.purchase_product_id
        )?.unit_price,
      }));
      console.log("newSKUdetails", newSKUdetails);

      setProductList(newSKUdetails);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLoading3(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setLoading3(false);
  };
  useEffect(() => {
    // getDropdownList();
    // getCategoryList();
    // getBrandList();
    getData();
    getBranchList();
  }, []);
  return (
    <>
      <Box container sx={{ padding: "24px 0" }}>
        <Typography
          variant="h6"
          gutterBottom
          component="div"
          sx={{ color: "#0F1624", fontWeight: 600 }}
        >
          Stock Transfer Details
        </Typography>
      </Box>

      <div
        style={{
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          backgroundColor: "#F9FAFB",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
        }}
      >
        <Box sx={{ padding: "12px", margin: "16px" }}>
          <Grid container spacing={2}>
            <Grid size={4}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Transfer From : <b>{transferFrom}</b>
              </Typography>

              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Transfer To : <b>{transferTo}</b>
              </Typography>

              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Transfer Status : <b>{transferStatus}</b>
              </Typography>
            </Grid>

            <Grid size={8}>
              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Shipping Charges : <b>{shippingCharge} TK</b>
              </Typography>

              <Typography
                variant="medium"
                color="text.main"
                gutterBottom
                sx={{ fontWeight: 500 }}
              >
                Additional Notes : <b>{note}</b>
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </div>

      <Box
        sx={{
          mt: 1,
          background: "#fff",
          border: "1px solid #EAECF1",
          borderRadius: "12px",
          overflow: "hidden",
          padding: "16px 0",
          boxShadow: "0px 1px 2px 0px rgba(15, 22, 36, 0.05)",
        }}
      >
        <Grid
          container
          justifyContent="space-between"
          alignItems="center"
          sx={{ px: 1.5, mb: 1.75 }}
        >
          <Grid size={{ xs: 12, sm: 12, md: 12, lg: 2, xl: 2 }}>
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              sx={{ color: "#0F1624", fontWeight: 600, margin: 0 }}
            >
              List ({productList?.length})
            </Typography>
          </Grid>
        </Grid>
        <div
          style={{
            overflowX: "auto",

            minWidth: "100%",
            width: "Calc(100vw - 385px)",

            // padding: "10px 16px 0px",
            boxSizing: "border-box",
          }}
        >
          <TableContainer sx={{ height: "Calc(100vh - 340px)" }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Product Name
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Purchase Date
                  </TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Purchase Price
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    SKU Number
                  </TableCell>
                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell> */}
                  {/* <TableCell style={{ whiteSpace: "nowrap" }}>Device</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Model</TableCell>

                  <TableCell style={{ whiteSpace: "nowrap" }}>Price</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Warranty
                  </TableCell>
                 
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Serial No
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>
                    Description
                  </TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Note</TableCell>
                  <TableCell style={{ whiteSpace: "nowrap" }}>Status</TableCell>*/}

                  {/* <TableCell align="right" style={{ whiteSpace: "nowrap" }}>
                    Actions
                  </TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {!loading &&
                  productList.length > 0 &&
                  productList.map((row, i) => (
                    <TableRow
                      key={i}
                      // sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      {/* <TableCell sx={{ width: 50 }}>
                        <img
                          src={
                            row?.images?.length > 0
                              ? row?.images[0]?.url
                              : "/noImage.png"
                          }
                          alt=""
                          width={40}
                        />
                      </TableCell> */}
                      <TableCell sx={{ minWidth: "130px" }}>
                        {row?.spare_parts_name
                          ? row?.spare_parts_name
                          : "---------"}{" "}
                        &nbsp;{" "}
                        {row?.spare_parts_variation_name
                          ? row?.spare_parts_variation_name
                          : "---------"}
                      </TableCell>

                      <TableCell>
                        {moment(row?.purchase_date).format("DD/MM/YYYY")}
                      </TableCell>

                      <TableCell sx={{ minWidth: "130px" }}>
                        {row?.unit_price ? row?.unit_price : "---------"}
                      </TableCell>
                      <TableCell>{row?.sku_number}</TableCell>
                      {/* <TableCell>
                        {" "}
                        <TextField
                          required
                          size="small"
                          id="name"
                          placeholder="Enter Note"
                          variant="outlined"
                          sx={{
                            ...customeTextFeild,
                            "& .MuiOutlinedInput-input": {
                              padding: "6.5px 12px",
                              fontSize: "14px",
                            },
                            minWidth: "150px",
                          }}
                          value={row?.note || ""}
                          onChange={(e) => {
                            const updatedRows = [...productList];
                            updatedRows[i].note = e.target.value;
                            setProductList(updatedRows);
                          }}
                        />
                      </TableCell> */}
                      {/* <TableCell align="right">
                        <IconButton
                          onClick={() =>
                            setProductList(
                              productList?.filter(
                                (res) => res.sku_number !== row?.sku_number
                              )
                            )
                          }
                        >
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12.2837 7.5L11.9952 15M8.00481 15L7.71635 7.5M16.023 4.82547C16.308 4.86851 16.592 4.91456 16.875 4.96358M16.023 4.82547L15.1332 16.3938C15.058 17.3707 14.2434 18.125 13.2637 18.125H6.73631C5.75655 18.125 4.94198 17.3707 4.86683 16.3938L3.97696 4.82547M16.023 4.82547C15.0677 4.6812 14.1013 4.57071 13.125 4.49527M3.125 4.96358C3.40798 4.91456 3.69198 4.86851 3.97696 4.82547M3.97696 4.82547C4.93231 4.6812 5.89874 4.57071 6.875 4.49527M13.125 4.49527V3.73182C13.125 2.74902 12.3661 1.92853 11.3838 1.8971C10.9244 1.8824 10.463 1.875 10 1.875C9.53696 1.875 9.07565 1.8824 8.61618 1.8971C7.63388 1.92853 6.875 2.74902 6.875 3.73182V4.49527M13.125 4.49527C12.0938 4.41558 11.0516 4.375 10 4.375C8.94836 4.375 7.9062 4.41558 6.875 4.49527"
                              stroke="#4A5468"
                              stroke-width="1.5"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </IconButton>
                      </TableCell> */}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </>
  );
};

export default DetailsStockTransfer;
