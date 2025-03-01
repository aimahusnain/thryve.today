"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

import React from "react";

const SuccessContent = () => {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("Isvverified", verified);

  useEffect(() => {
    if (sessionId) {
      // Verify the session
      const verifyPayment = async () => {
        try {
          const response = await axios.get(
            `/api/verify-payment?session_id=${sessionId}`
          );
          if (response.data.verified) {
            setVerified(true);
          } else {
            setError("Payment verification failed. Please contact support.");
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
          setError("Error verifying payment. Please contact support.");
        } finally {
          setVerifying(false);
        }
      };

      verifyPayment();
    } else {
      setVerifying(false);
      setError("No payment session found. Please contact support.");
    }
  }, [sessionId]);

  if (verifying) {
    return (
      <div className="text-center mb-12">
        <div className="inline-block p-3 rounded-full bg-primary/10 mb-6">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">
          Verifying Payment...
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Please wait while we verify your payment.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mb-12">
        <div className="inline-block p-3 rounded-full bg-destructive/10 mb-6">
          <XCircle className="w-12 h-12 text-destructive" />
        </div>
        <h1 className="text-4xl font-bold text-destructive mb-4">
          Payment Verification Failed
        </h1>
        <p className="text-xl text-muted-foreground mb-8">{error}</p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3">
            Return to Home
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <section className="h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center mb-12">
        <div className="inline-block p-3 rounded-full bg-primary/10 mb-6">
          <CheckCircle className="w-12 h-12 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-primary mb-4">
          Payment Successful!
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Thank you for enrolling in our Nursing Assistant Program. Your payment
          has been processed successfully.
        </p>
        <p className="text-muted-foreground mb-8">
          You will receive a confirmation email shortly with further details
          about your enrollment.
        </p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3">
            Return to Home
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default SuccessContent;
