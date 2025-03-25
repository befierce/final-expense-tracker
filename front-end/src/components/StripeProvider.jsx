// StripeProvider.jsx
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe("pk_test_51R4gz2KdbVF6fH8y7bm6jJmYbwMXc2xKqHh8iugHcYwlZeGKjfcqJ71dAEtjybtNcoFXNlVtcEmX9VvS6nUHyjDc00dwpkei8J");

const StripeProvider = ({ children }) => {
  return (
    <Elements stripe={stripePromise}>
      {children}
    </Elements>
  );
};

export default StripeProvider;