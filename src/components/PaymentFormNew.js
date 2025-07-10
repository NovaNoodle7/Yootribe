import { useState, useEffect, useRef } from "react";
import {
	PayPalScriptProvider,
	PayPalHostedFieldsProvider,
	PayPalHostedField,
	usePayPalHostedFields,
} from "@paypal/react-paypal-js";

const CUSTOM_FIELD_STYLE = {"border":"1px solid #606060","boxShadow":"2px 2px 10px 2px rgba(0,0,0,0.1)"};
const INVALID_COLOR = {
	color: "#dc3545",
};
const clientId = process.env.CLIENT_ID;
// Example of custom component to handle form submit
const SubmitPayment = ({ customStyle }) => {
	const [paying, setPaying] = useState(false);
	const cardHolderName = useRef(null);
	const hostedField = usePayPalHostedFields();

	const handleClick = () => {
		if (!hostedField?.cardFields) {
            const childErrorMessage = 'Unable to find any child components in the <PayPalHostedFieldsProvider />';

            throw new Error(childErrorMessage);
        }
		const isFormInvalid =
			Object.values(hostedField.cardFields.getState().fields).some(
				(field) => !field.isValid
			) || !cardHolderName?.current?.value;
		
		if (isFormInvalid) {
			return alert(
				"The payment form is invalid"
			);
		}
		setPaying(true);
		hostedField.cardFields
			.submit({
				cardholderName: cardHolderName?.current?.value,
			})
			.then((data) => {
				// Your logic to capture the transaction
				fetch("url_to_capture_transaction", {
					method: "post",
				})
					.then((response) => response.json())
					.then((data) => {
						// Here use the captured info
					})
					.catch((err) => {
						// Here handle error
					})
					.finally(() => {
						setPaying(false);
					});
			})
			.catch((err) => {
				// Here handle error
				setPaying(false);
			});
	};

	return (
		<>
            <label title="This represents the full name as shown in the card">
				Card Holder Name
				<input
					id="card-holder"
					ref={cardHolderName}
					className="card-field"
					style={{ ...customStyle, outline: "none" }}
					type="text"
					placeholder="Full name"
				/>
				</label>
			<button
				className={`btn${paying ? "" : " btn-primary"}`}
				style={{ float: "right" }}
				onClick={handleClick}
			>
				{paying ? <div className="spinner tiny" /> : "Pay"}
			</button>
		</>
	);
};

export const PaymentFormNew = () => {
	const [clientToken, setClientToken] = useState(null);

	useEffect(() => {
		(async () => {
			const response = await (
				await fetch(
					"/client_token"
				)
			).json();
            setClientToken(response.token);
		})();
	}, []);

	return (
		<>
			{clientToken ? (
				<PayPalScriptProvider
					options={{
						"client-id": clientId,
						components: "buttons,hosted-fields",
						"data-client-token": clientToken,
						intent: "capture",
						vault: false,
					}}
                    deferLoading={true}
				>
					<PayPalHostedFieldsProvider
						styles={{".valid":{"color":"#28a745"},".invalid":{"color":"#dc3545"},"input":{"font-family":"monospace","font-size":"16px"}}}
						createOrder={function () {
							return fetch(
								"your_custom_server_to_create_orders",
								{
									method: "post",
									headers: {
										"Content-Type": "application/json",
									},
									body: JSON.stringify({
										purchase_units: [
											{
												amount: {
													value: "2", // Here change the amount if needed
													currency_code: "USD", // Here change the currency if needed
												},
											},
										],
										intent: "capture",
									}),
								}
							)
								.then((response) => response.json())
								.then((order) => {
									// Your code here after create the order
									return order.id;
								})
								.catch((err) => {
									alert(err);
								});
						}}
					>
                        <label htmlFor="card-number">
                            Card Number
                            <span style={INVALID_COLOR}>*</span>
                        </label>
                        <PayPalHostedField
                            id="card-number"
                            className="card-field"
                            style={CUSTOM_FIELD_STYLE}
                            hostedFieldType="number"
                            options={{
                                selector: "#card-number",
                                placeholder: "4111 1111 1111 1111",
                            }}
                        />
                        <label htmlFor="cvv">
                            CVV<span style={INVALID_COLOR}>*</span>
                        </label>
                        <PayPalHostedField
                            id="cvv"
                            className="card-field"
                            style={CUSTOM_FIELD_STYLE}
                            hostedFieldType="cvv"
                            options={{
                                selector: "#cvv",
                                placeholder: "123",
                                maskInput: true,
                            }}
                        />
                        <label htmlFor="expiration-date">
                            Expiration Date
                            <span style={INVALID_COLOR}>*</span>
                        </label>
                        <PayPalHostedField
                            id="expiration-date"
                            className="card-field"
                            style={CUSTOM_FIELD_STYLE}
                            hostedFieldType="expirationDate"
                            options={{
                                selector: "#expiration-date",
                                placeholder: "MM/YYYY",
                            }}
                        />
						<SubmitPayment customStyle={{"border":"1px solid #606060","boxShadow":"2px 2px 10px 2px rgba(0,0,0,0.1)"}} />
					</PayPalHostedFieldsProvider>
				</PayPalScriptProvider>
			) : (
				<h1>Loading token...</h1>
			)}
		</>
	);
}