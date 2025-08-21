import React, { useState, useEffect, useContext, useRef } from "react";

import Typography from "@mui/material/Typography";

import { useSnackbar } from "notistack";

import { Box, Button, InputAdornment } from "@mui/material";

import TextField from "@mui/material/TextField";

import { AuthContext } from "../context/AuthContext";
import { getDataWithToken } from "../services/GetDataService";
import Autocomplete from "@mui/material/Autocomplete";
const options = ["Option 1", "Option 2"];
const SparePartsSearch = ({
  sparePartsIds,
  setSparePartsIds,
  autocompleteSearchSparePartsRef,
}) => {
  const { login, ifixit_admin_panel, logout } = useContext(AuthContext);
  const { enqueueSnackbar } = useSnackbar();

  const [searchProductText, setsearchProductText] = useState("");
  const [productList, setProductList] = useState([]);
  const [sparePartsList, setSparePartsList] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [brandId, setBrandId] = useState([]);
  const [categoryId, setCategoryId] = useState([]);
  const [deviceId, setDeviceId] = useState([]);
  const [modelId, setModelId] = useState([]);

  const [loading2, setLoading2] = useState(false);
  const [loading, setLoading] = useState(false);

  const [variationList, setVariationList] = useState([]);
  const [message, setMessage] = useState("");
  const [first, setFirst] = useState(false);
  const [value, setValue] = useState();
  const [inputValue, setInputValue] = useState("");

  const customeTextFeild = {
    // padding: "15px 20px",
    // background: "#FAFAFA",
    "& label": {
      fontSize: "11px",
    },
    "& label.Mui-focused": {
      color: "#0F1624",
    },

    "& .MuiInput-underline:after": {
      borderBottomColor: "#B2BAC2",
    },
    "& .MuiOutlinedInput-input": {
      padding: "8px 12px",
    },
    "& .MuiOutlinedInput-root": {
      // paddingLeft: "24px",
      fontSize: "13px",
      "& fieldset": {
        // borderColor: "rgba(0,0,0,0)",
        borderRadius: "8px",
      },

      "&:hover fieldset": {
        borderColor: "#969696",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#969696",
      },
    },
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
  const getProducts = async (searchText, bId, dId, mId, catId) => {
    setSearchLoading(true);
    let url;
    let newSearchProductText = searchProductText;
    let newBrandId = brandId;
    let newDeviceId = deviceId;
    let newModelId = modelId;
    let newCategoryId = categoryId;
    if (searchText) {
      newSearchProductText = searchText;
    }
    if (bId) {
      newBrandId = bId;
    }
    if (dId) {
      newDeviceId = dId;
    }
    if (mId) {
      newModelId = mId;
    }
    if (catId) {
      newCategoryId = catId;
    }

    url = `/api/v1/product?name=${newSearchProductText.trim()}&category_id=${newCategoryId}&brand_id=${newBrandId}&device_id=${newDeviceId}&model_id=${newModelId}&limit=1000`;

    let allData = await getDataWithToken(url);
    console.log("(allData?.data?.data products", allData?.data?.data);
    if (allData?.status === 401) {
      logout();
      return;
    }
    if (allData.status >= 200 && allData.status < 300) {
      setProductList(allData?.data?.data);
      let list = [];
      if (allData?.data?.data?.length > 0) {
        // row.variation_data.map

        allData?.data?.data?.map((item) => {
          if (item.variation_data?.length > 0) {
            item.variation_data.map((el) => {
              list.push(`${item?.name} - ${el?.name}`);
            });
          }
        });
      }
      console.log("list", list);

      setSparePartsList(list);

      if (allData.data.data.length < 1) {
        setMessage("No data found");
      }
    } else {
      setSearchLoading(false);
      handleSnakbarOpen(allData?.data?.message, "error");
    }
    setSearchLoading(false);
  };

  const findIds = (findIds) => {
    if (findIds) {
      const result = findIds.split("-").map((s) => s.trim());
      let product_id = productList?.find((res) => res.name === result[0]);
      let product_variation_id = product_id?.variation_data?.find(
        (res) => res.name === result[1]
      );

      setSparePartsIds({
        product_id: product_id?._id,
        product_variation_id: product_variation_id?._id,
      });
      console.log("result", result);
      console.log("product_id", product_id);
      console.log("product_variation_id", product_variation_id);
    }
  };

  return (
    <Box>
      <Autocomplete
        ref={autocompleteSearchSparePartsRef}
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
          findIds(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          getProducts(newInputValue);
        }}
        id="controllable-states-demo"
        options={sparePartsList}
        renderInput={(params) => (
          <TextField
            id="spareParts-search-input"
            {...params}
            placeholder="Search Product"
            size="small"
            sx={{ ...customeTextFeild }}
          />
        )}
      />
    </Box>
  );
};

export default SparePartsSearch;
