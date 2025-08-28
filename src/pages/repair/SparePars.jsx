import React, {
  useEffect,
  useState,
  useMemo,
  useRef,
  useCallback,
  useContext,
} from "react";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import {
  Box,
  Button,
  Divider,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { Link, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { getDataWithToken } from "../../services/GetDataService";

import InputAdornment from "@mui/material/InputAdornment";

import Checkbox from "@mui/material/Checkbox";
import dayjs from "dayjs";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import { handlePostData } from "../../services/PostDataService";
import { AuthContext } from "../../context/AuthContext";

import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 11,
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: "#fff", // this controls arrow color
    "&::before": {
      boxShadow: theme.shadows[1], // adds shadow around the arrow
      border: "1px solid #ddd", // optional border around arrow
    },
  },
}));
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

const SparePars = ({
  allSpareParts,
  setAllSpareParts,
  getBranchId,
  partsDeviceId,
  productList,
  setProductList,
  productLoading,
  setProductLoading,
  branchList,
  setBranchList,
}) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [limitDataLoading, setLimitDataLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState("");

  const [stockLimitList, setStockLimitList] = useState([]);

  const handleTooltipClose = () => {
    setTooltipOpen("");
  };

  const handleTooltipOpen = (id) => {
    if (tooltipOpen !== id) {
      setTooltipOpen(id);
    } else {
      setTooltipOpen("");
    }
  };
  const { enqueueSnackbar } = useSnackbar();

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

  const getProducts = async () => {
    setProductLoading(true);

    let branch_id = getBranchId();

    // let url = `/api/v1/product?brand_id=${brand_id}&model_id=${deviceId}&device_id=${partsDeviceId}&branch_id=${branch_id}`;

    let url = `/api/v1/product?model_id=${partsDeviceId}&branch_id=${branch_id}&limit=1000`;

    // url = `/api/v1/product?name=${newSearchProductText.trim()}&category_id=${newCategoryId}&brand_id=${newBrandId}&device_id=${newDeviceId}&model_id=${newModelId}`;

    let allData = await getDataWithToken(url);
    // console.log("(allData?.data?.data products", allData?.data?.data);

    if (allData?.status === 401) {
      logout();
      return;
    }

    if (allData.status >= 200 && allData.status < 300) {
      console.log("lll", allData?.data?.data);
      setProductList(allData?.data?.data);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setProductLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setProductLoading(false);
  };

  const getBranchLimit = async (product_variation_id) => {
    if (tooltipOpen === product_variation_id) {
      return;
    }
    setLimitDataLoading(true);

    // let url = `/api/v1/model/device-model?deviceId=${id}`;
    let url = `/api/v1/stockCounterAndLimit/branch-limit?product_variation_id=${product_variation_id}`;
    let data = { product_variation_id };
    let allData = await getDataWithToken(url);
    if (allData?.status === 401) {
      logout();
      return;
    }
    console.log("getBranchLimit************************", allData?.data?.data);

    if (allData.status >= 200 && allData.status < 300) {
      setLimitDataLoading(false);
      // setModelList(allData?.data?.data);

      let newBranchList = branchList?.map((item) => {
        let newData = allData?.data?.data?.find(
          (el) => el.branch_id === item?._id
        );
        return { ...item, limit: newData?.stock_limit || 0 }; // Defaults to 0 if stock_limit is undefined
      });
      console.log("newBranchList", newBranchList);
      let stockLimitsData = {
        product_variation_id: product_variation_id,
        stocks: newBranchList,
      };

      console.log("[...stockLimitList, stockLimitsData]", [
        ...stockLimitList,
        stockLimitsData,
      ]);

      // setStockLimitList([...stockLimitList, stockLimitsData]);
      setStockLimitList((prevList) => {
        const exists = prevList.some(
          (item) =>
            item.product_variation_id === stockLimitsData.product_variation_id
        );

        if (exists) {
          // update
          return prevList.map((item) =>
            item.product_variation_id === stockLimitsData.product_variation_id
              ? { ...item, stocks: stockLimitsData.stocks } // update stocks
              : item
          );
        } else {
          // add new
          return [...prevList, stockLimitsData];
        }
      });
      handleTooltipOpen(product_variation_id);
      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setLimitDataLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
  };
  const handleSelectedProduct = (item, row) => {
    console.log("item:::", item);
    console.log("selectedProducts", selectedProducts);

    if (selectedProducts.some((res) => res._id === item._id)) {
      setSelectedProducts(
        selectedProducts.filter((res) => res._id !== item._id)
      );
      setAllSpareParts(selectedProducts.filter((res) => res._id !== item._id));
    } else {
      // {
      //   ...item,
      //   product_full_name: `${row?.name} - ${item?.name}`,
      //   product_id: item.product_id,
      //   product_variation_id: item._id,
      //   purchase_product_status: "",
      //   quantity: "",
      //   unit_price: "",
      // },
      setSelectedProducts([
        ...selectedProducts,
        {
          ...item,
          id: item.product_id,
          name: `${row?.name} - ${item?.name}`,
          price: item.price,
          product_full_name: `${row?.name} - ${item?.name}`,
          product_id: item.product_id,
          product_variation_id: item._id,
        },
      ]);
      setAllSpareParts([
        ...selectedProducts,
        {
          ...item,

          id: item.product_id,
          name: `${row?.name} - ${item?.name}`,
          price: item.price,
          product_full_name: `${row?.name} - ${item?.name}`,
          product_id: item.product_id,
          product_variation_id: item._id,
        },
      ]);
    }

    console.log("all selectedProducts", selectedProducts);
  };
  const handleSelectedProduct2 = (item, row) => {
    console.log("item:::", item);
    if (selectedProducts.some((res) => res.product_id === item.product_id)) {
      setSelectedProducts(
        selectedProducts.filter((res) => res.product_id !== item.product_id)
      );
      setAllSpareParts(
        selectedProducts.filter((res) => res.product_id !== item.product_id)
      );
    } else {
      // {
      //   ...item,
      //   product_full_name: `${row?.name} - ${item?.name}`,
      //   product_id: item.product_id,
      //   product_variation_id: item._id,
      //   purchase_product_status: "",
      //   quantity: "",
      //   unit_price: "",
      // },
      setSelectedProducts([
        ...selectedProducts,
        {
          ...item,
          id: item.product_id,
          name: `${row?.name} - ${item?.name}`,
          price: item.price,
          product_full_name: `${row?.name} - ${item?.name}`,
          product_id: item.product_id,
          product_variation_id: item._id,
        },
      ]);
      setAllSpareParts([
        ...selectedProducts,
        {
          ...item,

          id: item.product_id,
          name: `${row?.name} - ${item?.name}`,
          price: item.price,
          product_full_name: `${row?.name} - ${item?.name}`,
          product_id: item.product_id,
          product_variation_id: item._id,
        },
      ]);
    }

    console.log("all selectedProducts", selectedProducts);
  };

  // const handleSelectedProduct = (item, row) => {
  //   // console.log("item", item);
  //   if (selectedProducts.some((res) => res._id === item._id)) {
  //     setSelectedProducts(
  //       selectedProducts.filter((res) => res._id !== item._id)
  //     );
  //     setAllSpareParts(selectedProducts.filter((res) => res._id !== item._id));
  //   } else {
  //     setSelectedProducts([
  //       ...selectedProducts,
  //       {
  //         ...item,
  //         product_full_name: `${row?.name} - ${item?.name}`,
  //         product_id: item.product_id,
  //         product_variation_id: item._id,
  //         purchase_product_status: "",
  //         quantity: "",
  //         unit_price: "",
  //       },
  //     ]);
  //     setAllSpareParts([
  //       ...selectedProducts,
  //       {
  //         ...item,
  //         product_full_name: `${row?.name} - ${item?.name}`,
  //         product_id: item.product_id,
  //         product_variation_id: item._id,
  //         purchase_product_status: "",
  //         quantity: "",
  //         unit_price: "",
  //       },
  //     ]);
  //   }

  //   console.log("all selectedProducts", selectedProducts);
  // };
  useEffect(() => {
    // getCategoryList();
    // getBranchList();
    // getBrandList();
    // getUserList();
    // getBrandList();
    // getDeviceList();
    // getModelList();
    // getDropdownList();
  }, []);

  useEffect(() => {
    setSelectedProducts(allSpareParts);
  }, [allSpareParts]);

  // useEffect(() => {
  //   getProducts();
  // }, []);

  return (
    <Grid container spacing={3}>
      {/* <Button
        onClick={() => {
          console.log("allSpareParts", allSpareParts);
          console.log("selectedProducts", selectedProducts);
        }}
      >
        Check
      </Button> */}
      <Grid size={12}>
        {/* <Typography variant="base" gutterBottom sx={{ fontWeight: 500 }}>
          All Product
        </Typography> */}
        <Box sx={{ flexGrow: 1, mt: 3 }}>
          <Grid container spacing={2}>
            {!productLoading &&
              productList.length > 0 &&
              productList.map(
                (row, rowIndex) =>
                  row?.variation_data?.length > 0 &&
                  row.variation_data.map((item, itemIndex) => (
                    <LightTooltip
                      title={
                        <Box sx={{ p: 0.5 }}>
                          {stockLimitList?.length > 0 &&
                            stockLimitList
                              ?.find(
                                (res) =>
                                  res?.product_variation_id === tooltipOpen
                              )
                              ?.stocks?.map((stockData) => (
                                <>
                                  <Typography
                                    variant="small"
                                    sx={{
                                      mb: 1,
                                      background: "#f9f9f9",
                                      py: 0.5,
                                      px: 1,
                                      borderRadius: "8px",
                                    }}
                                  >
                                    {stockData?.name} ({stockData?.limit})
                                  </Typography>
                                  {/* <Typography variant="small" sx={{ mb: 1 }}>
                                    <b>Branch Name</b>: {stockData?.name}
                                  </Typography>
                                  <Typography variant="small" sx={{ mb: 2 }}>
                                    <b>Limits</b>: {stockData?.limit}
                                  </Typography> */}
                                </>
                              ))}
                        </Box>
                      }
                      arrow
                      placement="top"
                      open={tooltipOpen === item?._id}
                      onClose={handleTooltipClose}
                    >
                      <Grid
                        key={`row-${rowIndex}-item-${itemIndex}`}
                        item
                        size={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 4 }}
                      >
                        <Item
                          sx={{
                            border:
                              selectedProducts.some(
                                (pro) => pro?.product_variation_id === item?._id
                              ) && "1px solid #818FF8",
                          }}
                          // onMouseEnter={() => getBranchLimit(item?._id)}
                          onClick={() => {
                            handleSelectedProduct(item, row);
                            getBranchLimit(item?._id);
                          }}
                        >
                          {" "}
                          <Box sx={{ flexGrow: 1 }}>
                            <Grid container alignItems="center">
                              <Grid size="auto" sx={{ width: "40px", mr: 1 }}>
                                {" "}
                                <img
                                  src={
                                    item?.images?.length > 0
                                      ? item?.images[0]?.url
                                      : "/noImage.jpg"
                                  }
                                  alt=""
                                  width={30}
                                  height={40}
                                />
                              </Grid>
                              <Grid
                                size="auto"
                                sx={{ width: "Calc(100% - 50px)" }}
                              >
                                <Box
                                  sx={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                  }}
                                >
                                  <Typography
                                    variant="medium"
                                    sx={{
                                      fontWeight: 500,
                                      color: "#344054",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      marginRight: 1, // Optional for spacing
                                    }}
                                  >
                                    {row?.name}

                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 2,
                                        alignItems: "center",
                                        mt: 0.5,
                                      }}
                                    >
                                      <Typography
                                        variant="small"
                                        sx={{
                                          color: "#424949",
                                          fontWeight: 500,
                                        }}
                                      >
                                        {item?.name}
                                      </Typography>
                                    </Box>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        gap: 2,
                                        alignItems: "center",
                                        mt: 0.5,
                                      }}
                                    >
                                      <Typography
                                        variant="body2"
                                        sx={{ color: "#3E3BC3" }}
                                      >
                                        {item.price}TK
                                      </Typography>
                                    </Box>
                                  </Typography>
                                  <Checkbox
                                    sx={{
                                      display: selectedProducts.some(
                                        (pro) =>
                                          pro?.product_variation_id ===
                                          item?._id
                                      )
                                        ? "block"
                                        : "none",
                                    }}
                                    size="small"
                                    checked={true}
                                    inputProps={{
                                      "aria-label": "controlled",
                                    }}
                                  />
                                </Box>
                              </Grid>
                            </Grid>
                          </Box>
                        </Item>
                      </Grid>
                    </LightTooltip>
                  ))
              )}
            {productLoading && (
              <Grid size={12}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    gap: 3,
                  }}
                >
                  <Skeleton
                    variant="rectangular"
                    height={120}
                    sx={{ flex: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={120}
                    sx={{ flex: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={120}
                    sx={{ flex: 1 }}
                  />
                  <Skeleton
                    variant="rectangular"
                    height={120}
                    sx={{ flex: 1 }}
                  />
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
      {/* <Grid size={12}>
        <Divider />
      </Grid> */}
    </Grid>
  );
};

export default SparePars;
