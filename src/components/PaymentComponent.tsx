'use client';

import { Button } from "@/components/ui/button";
import {
    Elements,
    PaymentElement,
    useElements,
    useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      console.error('Payment error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <Button 
        type="submit" 
        className="w-full mt-4"
        disabled={!stripe}
      >
        Pay Now
      </Button>
    </form>
  );
};

export const PaymentComponent = ({ clientSecret }: { clientSecret: string }) => {
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm />
    </Elements>
  );
};