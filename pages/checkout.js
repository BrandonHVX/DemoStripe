import Stripe from "stripe";
import { parseCookies, setCookie } from "nookies";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import CheckoutForm from "../components/CheckoutForm";

const stripePromise = loadStripe("pk_test_qticix44cW8mGN9kWbbbf0zn0053004gZf");

export const getServerSideProps = async ctx => {
  const stripe = new Stripe("sk_test_sFcp1zGZU2rJLjwy9vCA4p3w00fIqoUZFR");

  let paymentIntent;

  const { paymentIntentId } = await parseCookies(ctx);

  if (paymentIntentId) {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    return {
      props: {
        paymentIntent
      }
    };
  }

  paymentIntent = await stripe.paymentIntents.create({
    amount: 1000,
    currency: "usd",
    metadata: {
      order_id: ""
    }
  });

  setCookie(ctx, "paymentIntentId", paymentIntent.id);

  return {
    props: {
      paymentIntent
    }
  };
};

const CheckoutPage = ({ paymentIntent }) => (
  <Elements stripe={stripePromise}>
    <CheckoutForm paymentIntent={paymentIntent} />
  </Elements>
);

export default CheckoutPage;
