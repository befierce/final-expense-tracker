import { useState } from "react";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripePublishableKey);
const StripePaymentForm = ({ clientSecret, onSuccess, onClose }) => {
  const handlePaymentSubmit = () => {};
  return (
    <>
      <div className="modal-backdrop">
        <div className="modal-content">
          <form onSubmit={handlePaymentSubmit}>
            <CardElement className="card-element">

            </CardElement>
            <div>
              <button type="button" onClick={onClose}>
                cancel
              </button>
              <button type="submit" onClick={handlePaymentSubmit}>
                pay now
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

const StripePaymentModal = ({ clientSecret, onSuccess, onClose }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripePaymentForm
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onClose={onClose}
      ></StripePaymentForm>
    </Elements>
  );
};

export default StripePaymentModal;
