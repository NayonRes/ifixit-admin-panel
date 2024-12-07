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
        <div ref={contentRef}>
          adfasdas <Barcode value="10000005" width={2} height={30} />
        </div>
      </div>
    </div>
  );
};

export default BarcodeGenerate;
