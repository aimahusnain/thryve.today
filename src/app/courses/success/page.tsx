"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Home, Loader2, XCircle } from 'lucide-react';
import Link from "next/link";
import { useEffect, useState } from "react";

const SuccessContent = () => {
  const [verifying, setVerifying] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  console.log(verified)

  useEffect(() => {
    // Get the session ID from URL without using useSearchParams
    const sessionId = typeof window !== 'undefined' 
      ? new URLSearchParams(window.location.search).get("session_id")
      : null;
    
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
  }, []);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background/95 to-background/90 p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[40%] -left-[20%] w-[70%] h-[70%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute -bottom-[30%] -right-[20%] w-[60%] h-[60%] rounded-full bg-primary/5 blur-[100px]" />
      </div>
      
      <AnimatePresence mode="wait" >
        {verifying ? (
          <VerifyingState key="verifying" />
        ) : error ? (
          <ErrorState key="error" error={error} />
        ) : (
          <SuccessState key="success" />
        )}
      </AnimatePresence>
    </div>
  );
};

const VerifyingState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-md"
  >
    <div className="backdrop-blur-xl my-[50px] bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl shadow-xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
      
      <div className="relative z-10">
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
            <div className="relative bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm p-5 rounded-full border border-white/20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
            Verifying Payment
          </h2>
          
          <p className="text-muted-foreground text-center mb-8">
            Please wait while we process your transaction
          </p>
          
          <div className="w-full h-1.5 bg-background/30 rounded-full overflow-hidden mb-6">
            <motion.div 
              className="h-full bg-gradient-to-r from-primary/60 via-primary to-primary/60"
              initial={{ width: "0%" }}
              animate={{ 
                width: "100%",
                transition: { 
                  repeat: Infinity, 
                  duration: 2,
                  ease: "easeInOut"
                }
              }}
            />
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground/80">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>Secure verification in progress</span>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

const ErrorState = ({ error }: { error: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-md"
  >
    <div className="backdrop-blur-xl  my-[50px] bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl shadow-xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 to-transparent opacity-50" />
      
      <div className="relative z-10">
        <div className="flex flex-col items-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full bg-destructive/20 blur-md" />
            <div className="relative bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm p-5 rounded-full border border-white/20">
              <XCircle className="w-10 h-10 text-destructive" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-destructive to-destructive/80">
            Verification Failed
          </h2>
          
          <p className="text-muted-foreground text-center mb-6">
            {error}
          </p>
          
          <div className="w-full bg-background/20 backdrop-blur-md rounded-2xl p-5 mb-8 border border-white/10">
            <h3 className="font-medium mb-3 text-foreground/90">Need assistance?</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-background/30 flex items-center justify-center mr-3">
                  <span className="text-xs">1</span>
                </div>
                <p>Check your email for payment details</p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-background/30 flex items-center justify-center mr-3">
                  <span className="text-xs">2</span>
                </div>
                <p>Contact our support team at <a href="mailto:support@example.com" className="text-primary underline">support@example.com</a></p>
              </div>
              <div className="flex items-start">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-background/30 flex items-center justify-center mr-3">
                  <span className="text-xs">3</span>
                </div>
                <p>Try the payment process again</p>
              </div>
            </div>
          </div>
          
          <Link href="/" className="w-full">
            <Button className="w-full rounded-xl h-12 bg-gradient-to-r from-background/80 to-background/60 hover:from-background/90 hover:to-background/70 backdrop-blur-sm border border-white/20 text-foreground shadow-lg transition-all duration-300 hover:shadow-xl">
              <Home className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);

const SuccessState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="w-full max-w-md"
  >
    <div className="backdrop-blur-xl  my-[50px] bg-white/10 dark:bg-black/10 border border-white/20 dark:border-white/10 rounded-3xl shadow-xl p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
      
      <div className="relative z-10">
        <div className="flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mb-8"
          >
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
            <div className="relative bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm p-5 rounded-full border border-white/20">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-center mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
              Payment Successful
            </h2>
            
            <p className="text-muted-foreground text-center mb-6">
              Thank you for enrolling in our Nursing Assistant Program
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="w-full bg-background/20 backdrop-blur-md rounded-2xl p-5 mb-8 border border-white/10"
          >
            <h3 className="font-medium mb-4 text-foreground/90">Your enrollment is confirmed</h3>
            <div className="space-y-4">
              {[
                { text: "Confirmation email sent", delay: 0.5 },
                { text: "Course access within 24 hours", delay: 0.6 },
                { text: "Instructor will contact you soon", delay: 0.7 }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: item.delay }}
                  className="flex items-center"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                    <CheckCircle className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="w-full"
          >
            <Link href="/" className="w-full">
              <Button className="w-full rounded-xl h-12 bg-gradient-to-r from-primary/80 to-primary/60 hover:from-primary/90 hover:to-primary/70 text-primary-foreground shadow-lg transition-all duration-300 hover:shadow-xl">
                <Home className="mr-2 h-4 w-4" />
                Return to Home
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  </motion.div>
);

export default SuccessContent;
