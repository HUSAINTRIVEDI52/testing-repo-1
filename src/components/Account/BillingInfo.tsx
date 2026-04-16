import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import CollectCardAndBillingDetails from "../CollectCardAndBillingDetails/CollectCardAndBillingDetails";

function BillingInfo() {
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY!);

  return (
    <Elements
      stripe={stripePromise}
      options={{
        appearance: {
          rules: {
            ".Label": {
              color: "#9d9d9d",
              fontSize: "14px",
              fontWeight: "400",
            },
            ".Input": {
              padding: "10px 12px",
              borderRadius: "4px",
              backgroundColor: "#fff",
              border: "1px solid #e2e4e8",
              fontSize: "15px",
              maxHeight: "200px",
              boxShadow: "none",
            },
            ".Input:hover": {
              border: "1px solid #777777",
            },
            ".Input:focus": {
              border: "1px solid #ff7c02",
              outline: "none",
              boxShadow: "none",
            },
            ".Input--invalid": {
              border: "none",
              outline: "none",
              boxShadow: "none",
            },
            ".Error": {
              color: "#ff3a3a",
            },
          },
        },
      }}
    >
      <CollectCardAndBillingDetails />
    </Elements>
  );
}

export default BillingInfo;
