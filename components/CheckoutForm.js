import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { destroyCookie } from "nookies";

const CheckoutForm = ({ paymentIntent }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [checkoutError, setCheckoutError] = useState();
  const [checkoutSuccess, setCheckoutSuccess] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const billing_details = {
      name: document.getElementById("fullname").value
    };
    try {
      const {
        error,
        paymentIntent: { status }
      } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details
        }
      });

      if (error) throw new Error(error.message);

      if (status === "succeeded") {
        destroyCookie(null, "paymentIntentId");
        setCheckoutSuccess(true);
      }
    } catch (err) {
      setCheckoutError(err.message);
    }
  };

  if (checkoutSuccess) return <p>Payment successfull!</p>;

  return (
    <form onSubmit={handleSubmit}>
      <p>
        <label>
          Receiver Name&nbsp; &nbsp;
          <input type="text" name="name" className="input" id="receivername" />
        </label>
      </p>
      <label>
        Name on Card &nbsp; &nbsp;
        <input type="text" name="name" className="input" id="fullname" />
      </label>
      <CardElement />

      <button type="submit" disabled={!stripe}>
        Pay now
      </button>

      {checkoutError && <span style={{ color: "red" }}>{checkoutError}</span>}
    </form>
  );
};

export default CheckoutForm;
