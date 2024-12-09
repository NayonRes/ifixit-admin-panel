import { Box, Button } from "@mui/material";
import React, { useRef } from "react";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";

const BarcodeGenerate = ({ list }) => {
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });

  return (
    <>
      {list?.length > 0 && (
        <>
          <Box sx={{ background: "#F9FAFB", py: 2 }}>
            <Box ref={contentRef}>
              {list?.length > 0 &&
                list?.map((item, i) => {
                  return (
                    <span style={{ margin: "0px 10px" }}>
                      <Barcode
                        key={i}
                        value={item?.sku_number}
                        width={2}
                        height={30}
                      />
                    </span>
                  );
                })}
            </Box>
          </Box>
          <Box sx={{ py: 2, textAlign: "right" }}>
            <Button
              variant="contained"
              sx={{ width: "150px" }}
              startIcon={<LocalPrintshopOutlinedIcon />}
              onClick={handlePrint}
            >
              Print
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default BarcodeGenerate;
