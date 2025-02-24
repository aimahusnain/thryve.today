// app/enrollment/success/page.tsx or app/courses/success/page.tsx
"use client";

import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import axios from "axios";

// Create a client component that uses useSearchParams
function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (sessionId) {
      // Verify the session
      const verifyPayment = async () => {
        try {
          const response = await axios.get(`/api/verify-payment?session_id=${sessionId}`);
          if (response.status === 200) {
            setVerified(true);
          }
        } catch (error) {
          console.error("Error verifying payment:", error);
        } finally {
          setVerifying(false);
        }
      };

      verifyPayment();
    } else {
      setVerifying(false);
    }
  }, [sessionId]);

  return (
    <div className="text-center mb-12">
      <div className="inline-block p-3 rounded-full bg-primary/10 mb-6">
        <CheckCircle className="w-12 h-12 text-primary" />
      </div>
      <h1 className="text-4xl font-bold text-primary mb-4">
        Payment Successful!
      </h1>
      <p className="text-xl text-muted-foreground mb-8">
        Thank you for enrolling in our Nursing Assistant Program. Your payment has been processed successfully.
      </p>
      <p className="text-muted-foreground mb-8">
        You will receive a confirmation email shortly with further details about your enrollment.
      </p>
      <Link href="/">
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3">
          Return to Home
        </Button>
      </Link>
    </div>
  );
}

// Create a simple loading fallback
function LoadingFallback() {
  return <div className="text-center">Loading payment information...</div>;
}

// Main page component with Suspense
export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background py-12 pt-32">
      <div className="container mx-auto px-4 max-w-4xl">
        <Suspense fallback={<LoadingFallback />}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}