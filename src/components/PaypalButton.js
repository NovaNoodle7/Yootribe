import { useEffect } from 'react';
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from '@paypal/react-paypal-js';

// This values are the props in the UI
const amount = '2';
const currency = 'USD';
const style = { 'layout': 'vertical' };

// Custom component to wrap the PayPalButtons and handle currency changes
const ButtonWrapper = ({ currency, showSpinner }) => {
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    useEffect(() => {
        dispatch({
            type: 'resetOptions',
            value: {
                ...options,
                currency: currency,
            },
        });
    }, [currency, showSpinner]);


    return (<>
        {(showSpinner && isPending) && <div className='spinner' />}
        <PayPalButtons
            style={style}
            disabled={false}
            forceReRender={[amount, currency, style]}
            fundingSource={undefined}
            createOrder={(data, actions) => {
                return actions.order
                    .create({
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: currency,
                                    value: amount,
                                },
                            },
                        ],
                    })
                    .then((orderId) => {
                        // Your code here after create the order
                        return orderId;
                    });
            }}
            onApprove={(data, actions) => {
                return actions.order.capture().then(() => {
                    // Your code here after capture the order
                });
            }}
        />
    </>
    );
}

export const PaypalButtonShow = () => {
    return (
        <div className={'paypal-wrapper'}>
            <PayPalScriptProvider
                options={{
                    'client-id': 'AW6TglbN1aTYjtUh_oapOVGoiFVTbouz_uK_MN8DdHHtesvdkJ_5oAalq8JI2duK0FGF5MOOz60wvl1U',
                    components: 'buttons',
                    currency: 'USD'
                }}
            >
                <ButtonWrapper
                    currency={currency}
                    showSpinner={false}
                />
            </PayPalScriptProvider>
        </div>
    );
}