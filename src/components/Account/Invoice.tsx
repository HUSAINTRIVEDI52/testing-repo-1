import React from "react";
import BasicInfo from "./BasicInfo";
import InvoiceTable from "../Table/InvoiceTable";

const Invoice = () => {
  return (
    <div className="invoice-wrapper">
      {/* <div className='invoice-info-wrapper'>
                <div className='invoice-info'>
                    <div className='content'>
                        <BasicInfo plan="Current Plan" currentPlanTitle="Basic" />
                    </div>
                </div>
                <div className='invoice-info'>
                    <div className='content'>Master Card</div>
                </div>
            </div> */}
      <div className="invoice-table-wrapper">
        <h2>Invoice History</h2>
        <InvoiceTable />
      </div>
    </div>
  );
};

export default Invoice;
