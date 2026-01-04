"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Spinner, XCircle } from "@mynaui/icons-react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerify: (otp: string) => Promise<void>;
  email: string;
  isLoading?: boolean;
}

export function OtpModal({ isOpen, onClose, onVerify, email, isLoading = false }: OtpModalProps) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setVerifyStatus('loading');

    try {
      await onVerify(otp);
      setVerifyStatus('success');
    } catch (err: any) {
      setError(err.message || "Invalid verification code. Please try again.");
      setVerifyStatus('error');
      setTimeout(() => setVerifyStatus('idle'), 3000);
    }
  };

  const handleClose = () => {
    setOtp("");
    setError("");
    setVerifyStatus('idle');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px] p-0 bg-muted rounded-xl" showCloseButton={false}>
        <div className="flex flex-col">
          <div className="p-1">
            <div className="rounded-xl border bg-background">
              <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="font-semibold text-2xl text-neutral-900 tracking-tight dark:text-neutral-50">
                    Verify your email
                  </DialogTitle>
                  <DialogDescription className="text-sm text-neutral-600 leading-relaxed dark:text-neutral-400 max-w-sm mx-auto">
                    Please enter the 6-digit verification code we sent to{" "}
                    <span className="font-medium text-neutral-900 dark:text-neutral-50">{email}</span>. 
                    This code will expire in 15 minutes.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="px-10 pb-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-3">
                      <InputOTP
                        maxLength={6}
                        value={otp}
                        onChange={(value) => {
                          setOtp(value);
                          setError("");
                        }}
                        pattern={REGEXP_ONLY_DIGITS}
                        disabled={verifyStatus === 'loading'}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>
                      {error && (
                        <p className="text-sm text-destructive">{error}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={otp.length !== 6 || verifyStatus === 'loading'}
                      variant={verifyStatus === 'error' ? 'destructive' : verifyStatus === 'success' ? 'default' : 'default'}
                    >
                      <AnimatePresence mode="wait">
                        {verifyStatus === 'loading' && (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="inline-flex items-center gap-2"
                          >
                            <Spinner className="size-4 animate-spin" />
                            Verifying…
                          </motion.div>
                        )}

                        {verifyStatus === 'success' && (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="inline-flex items-center gap-2"
                          >
                            <CheckCircle className="size-4" />
                            Verified
                          </motion.div>
                        )}

                        {verifyStatus === 'error' && (
                          <motion.div
                            key="error"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="inline-flex items-center gap-2"
                          >
                            <XCircle className="size-4" />
                            Failed
                          </motion.div>
                        )}

                        {verifyStatus === 'idle' && (
                          <motion.div
                            key="idle"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            Verify Code
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>

                    <div className="text-center">
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">
                        Didn&apos;t receive the code?{" "}
                        <button
                          type="button"
                          className="font-medium text-neutral-900 hover:underline dark:text-neutral-50"
                          disabled={verifyStatus === 'loading'}
                        >
                          Resend
                        </button>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
