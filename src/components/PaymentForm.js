import styles from ".././App.css";
import { useState, useRef } from "react";
import {
  PayPalScriptProvider,
  PayPalHostedFieldsProvider,
  PayPalHostedField,
  PayPalButtons,
  usePayPalHostedFields
} from "@paypal/react-paypal-js";

import { TailSpin } from "react-loader-spinner";

export const PaymentForm = (props) => {
  const [success, showSuccess] = useState(false);
  const [error, showErrorMsg] = useState(false);
  const [transactionData, setTransactionData] = useState();
  const [errorMsg, setErrorMsg] = useState();

  const SubmitPayment = () => {
    // Here declare the variable containing the hostedField instance
    const { cardFields } = usePayPalHostedFields();
    const cardHolderName = useRef(null);

    const submitHandler = () => {
      if (typeof cardFields.submit !== "function") return; // validate that `submit()` exists before using it
      if (errorMsg) showErrorMsg(false);
      showSuccess(false);
      cardFields
        .submit({
          // The full name as shown in the card and billing addresss
          // These fields are optional for Sandbox but mandatory for production integration
          cardholderName: cardHolderName?.current?.value
        })
        .then((order) => {
          const { orderId } = order;
          fetch(`/payments/${orderId}`)
            .then((response) => response.json())
            .then((data) => {
              showSuccess(true);
              setTransactionData(data);
              // Inside the data you can find all the information related to the payment
            })
            .catch((err) => {
              // Handle capture order error
              showErrorMsg(true);
              setErrorMsg(err);
            });
        })
        .catch((err) => {
          // Handle validate card fields error
          showErrorMsg(true);
          setErrorMsg(err);
        });
    };

    return (
      <button
        onClick={submitHandler}
        className="btn btn-primary"
        style={{ display: "flex" }}
      >
        Pay
      </button>
    );
  };

  return (
    <PayPalScriptProvider
      options={{
        "client-id": props.clientId,
        "data-client-token": props.clientToken,
        components: "hosted-fields,buttons"
      }}
    >
      <PayPalButtons style={{ layout: "horizontal" }} />
      <PayPalHostedFieldsProvider
        createOrder={() => {
          // Here define the call to create and order
          return fetch("/payments")
            .then((response) => response.json())
            .then((order) => order.id)
            .catch((err) => {
              // Handle order creation error
              showErrorMsg(true);
              setErrorMsg(err);
            });
        }}
      >
        <section className={styles.container}>
          <div className={styles.card_container}>
            <label htmlFor="card-number">Card Number</label>
            <PayPalHostedField
              id="card-number"
              hostedFieldType="number"
              options={{
                selector: "#card-number",
                placeholder: "4111 1111 1111 1111"
              }}
              className={styles.card_field}
            />
            <section style={{ display: "flex" }}>
              <div style={{ flexDirection: "column", marginRight: "10px" }}>
                <label htmlFor="cvv">CVV</label>
                <PayPalHostedField
                  id="cvv"
                  hostedFieldType="cvv"
                  options={{
                    selector: "#cvv",
                    placeholder: "123"
                  }}
                  className={styles.card_field}
                />
              </div>
              <div style={{ flexDirection: "column" }}>
                <label htmlFor="expiration-date">Expiration Date</label>
                <PayPalHostedField
                  id="expiration-date"
                  hostedFieldType="expirationDate"
                  className={styles.card_field}
                  options={{
                    selector: "#expiration-date",
                    placeholder: "MM/YY"
                  }}
                />
              </div>
            </section>

            <SubmitPayment />
            {success && (
              <p style={{ color: "green", margin: "10px" }}>
                Transaction Completed! {JSON.stringify(transactionData)}
              </p>
            )}
            {error && (
              <p style={{ color: "red", margin: "10px" }}>
                Sorry, there is an error {JSON.stringify(errorMsg)}
              </p>
            )}
          </div>
        </section>
      </PayPalHostedFieldsProvider>
    </PayPalScriptProvider>
  );
};
