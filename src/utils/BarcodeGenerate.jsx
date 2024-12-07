import React, { useRef } from "react";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";

const BarcodeGenerate = ({ list }) => {
  const contentRef = useRef(null);
  const handlePrint = useReactToPrint({ contentRef });

  return (
    <div>
      <div>
        <button onClick={handlePrint}>Print</button>

        {list?.length > 0 &&
          list?.map((item, i) => {
            return (
              <div ref={contentRef} key={i}>
                <Barcode value={item?.sku_number} width={2} height={30} />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BarcodeGenerate;
