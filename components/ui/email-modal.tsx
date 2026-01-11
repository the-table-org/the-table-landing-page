"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Spinner } from "@mynaui/icons-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => Promise<void>;
  isLoading: boolean;
}

export function EmailModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}: EmailModalProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitStatus, setSubmitStatus] = useState<"idle" | "loading">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setSubmitStatus("loading");

    try {
      await onSubmit(email);
    } catch (err: any) {
      setError(err.message || "Failed to send verification code. Please try again.");
      setSubmitStatus("idle");
    }
  };

  const handleClose = () => {
    setEmail("");
    setError("");
    setSubmitStatus("idle");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="sm:max-w-[440px] p-0 bg-muted rounded-xl"
      >
        <div className="flex flex-col">
          <div className="p-1">
            <div className="rounded-xl border bg-background">
              <div className="flex flex-col items-center text-center px-6 pt-8 pb-6">
                <DialogHeader className="space-y-3">
                  <DialogTitle className="font-display font-black text-2xl text-foreground uppercase tracking-tight">
                    Apply to Join
                  </DialogTitle>
                  <DialogDescription className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                    Enter your email to get started with your application. We&apos;ll send you a verification code.
                  </DialogDescription>
                </DialogHeader>
              </div>

              <div className="px-10 pb-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-3">
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError("");
                        }}
                        disabled={submitStatus === "loading"}
                        autoComplete="email"
                        autoFocus
                        className="text-base w-full"
                      />
                      {error && (
                        <p className="text-sm text-destructive">{error}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!email || submitStatus === "loading"}
                    >
                      <AnimatePresence mode="wait">
                        {submitStatus === "loading" && (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="inline-flex items-center gap-2"
                          >
                            <Spinner className="size-4 animate-spin" />
                            Sending…
                          </motion.div>
                        )}

                        {submitStatus === "idle" && (
                          <motion.div
                            key="idle"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                          >
                            Continue
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Button>

                    <div className="text-center">
                      <p className="text-xs text-muted-foreground">
                        By continuing, you agree to our{" "}
                        <a
                          href="/privacy"
                          className="font-medium text-foreground hover:underline"
                        >
                          Privacy Policy
                        </a>
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
