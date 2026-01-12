"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { WritingText } from "@/components/animate-ui/text/writing";
import { supabase } from "@/lib/supabase";
import { EmailModal } from "@/components/ui/email-modal";
import { OtpModal } from "@/components/ui/otp-modal";
import { QuestionnaireModal } from "@/components/ui/questionnaire-modal";
import {Logo} from "@/components/logo";
import {Icon} from "@/components/icon";

function AnimatedStep({
  number,
  title,
  description,
  delay = 0,
}: {
  number: string;
  title: string;
  description: string;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{
        duration: 0.7,
        delay: isInView ? delay : 0,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="text-center"
    >
      <span className="font-display text-6xl md:text-7xl text-foreground/10 font-black block mb-4">
        {number}
      </span>
      <h3 className="font-display text-xl md:text-2xl text-foreground uppercase font-black mb-3">
        {title}
      </h3>
      <p className="text-base text-foreground/70 leading-relaxed max-w-xs mx-auto">
        {description}
      </p>
    </motion.div>
  );
}


export default function Home() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const [email, setEmail] = useState("");
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isQuestionnaireModalOpen, setIsQuestionnaireModalOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll("section[id]");
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => sections.forEach((section) => observer.unobserve(section));
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const handleJoinGuestlist = () => {
    setIsEmailModalOpen(true);
  };

  const handleEmailSubmit = async (emailValue: string) => {
    setEmail(emailValue);
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailValue,
        options: {
          shouldCreateUser: true,
        },
      });

      if (error) throw error;

      setIsEmailModalOpen(false);
      setIsOtpModalOpen(true);
    } catch (err: any) {
      throw new Error(
        err.message || "Failed to send verification code. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (otp: string) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: email,
        token: otp,
        type: "email",
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error("No user data returned after verification");
      }

      setUserId(data.user.id);

      await supabase.auth.updateUser({
        data: {
          is_email_verified: true,
          status: "email_verified",
        },
      });

      setIsOtpModalOpen(false);
      setIsQuestionnaireModalOpen(true);
    } catch (err: any) {
      throw new Error(err.message || "Invalid verification code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="text-foreground overflow-hidden bg-card p-2">
      <motion.div
        className="z-50 flex justify-center pointer-events-none"
        initial={false}
        animate={{
          position: isScrolled ? "fixed" : "absolute",
          top: 8,
          left: 8,
          right: 8,
        }}
        transition={{ duration: 0 }}
      >
        <motion.header
          className="relative z-50 tracking-tighter pointer-events-auto"
          initial={false}
          animate={{
            width: isScrolled ? (isSmallScreen ? "auto" : "30%") : "100%",
            borderRadius: isScrolled ? 9999 : 12,
            boxShadow: isScrolled
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
              : "none",
            backgroundColor: isScrolled ? "hsl(var(--background) / 0.95)" : "transparent",
            backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.div
            className="flex items-center justify-between"
            initial={false}
            animate={{
              height: isScrolled ? 48 : 64,
              paddingLeft: isScrolled ? 16 : 24,
              paddingRight: isScrolled ? 12 : 24,
              gap: 16,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div
              className="flex items-center"
              initial={false}
              animate={{ scale: isScrolled ? 0.85 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              <Link
                href="/"
                className="flex items-center gap-2"
                aria-label="The Table"
              >
                <Logo className="w-28 h-12" />
              </Link>
            </motion.div>
            <Button
              onClick={handleJoinGuestlist}
              size="sm"
              className="font-extrabold uppercase tracking-wide whitespace-nowrap"
            >
              APPLY TO JOIN
            </Button>
          </motion.div>
        </motion.header>
      </motion.div>

      <main className="relative min-h-screen w-full overflow-hidden scroll-smooth">
        <section
          id="hero"
          className="relative w-full overflow-hidden bg-background min-h-[98vh] flex items-center justify-center rounded-xl"
        >
          <motion.div
            className="container relative mx-auto px-4 md:px-6"
            style={{ opacity, scale }}
          >
            <div className="flex flex-col items-center justify-center text-center">
              <div className="flex max-w-5xl flex-col items-center justify-center space-y-10">
                <motion.div
                  className="space-y-8"
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                >
                  <motion.p
                    className="text-sm font-sans font-bold uppercase tracking-[0.2em] text-muted-foreground text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    REAL CONNECTION BEGINS AT THE TABLE.
                  </motion.p>
                  <h1 className="font-display text-5xl text-foreground uppercase sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none">
                    <WritingText
                      text="TAKE YOUR SEAT AT THE TABLE."
                      transition={{
                        type: "spring",
                        bounce: 0,
                        duration: 1.5,
                        delay: 0.05,
                      }}
                      spacing="0.5rem"
                      className="sm:spacing-[1rem] md:spacing-[1.25rem]"
                      inView={true}
                      inViewOnce={true}
                    />
                  </h1>
                  <motion.p
                    className="mx-auto max-w-2xl text-foreground/80 text-lg leading-relaxed md:text-xl text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Where every dinner is an introduction. We&apos;re on a mission to create greater human connection, one table at a time.
                  </motion.p>
                </motion.div>
                <motion.div
                  className="flex flex-col gap-6 items-center w-full max-w-md px-4 sm:px-0"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Button
                    onClick={handleJoinGuestlist}
                    size="lg"
                    className="font-extrabold uppercase tracking-wide"
                  >
                    APPLY TO JOIN
                  </Button>
                  <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground mt-2 text-center">
                    Vetted. Platonic. Intentional.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        <section
          id="how-it-works"
          className="w-full overflow-hidden bg-card py-16 md:py-20 lg:py-24"
        >
          <div className="container mx-auto px-4 md:px-6">
            <motion.h2
              className="font-display text-4xl md:text-5xl uppercase text-center mb-16 md:mb-20 font-black"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              THE PROCESS
            </motion.h2>

            <div className="mx-auto max-w-4xl">
              <div className="grid grid-cols-1 gap-16 md:gap-12 md:grid-cols-3">
                <AnimatedStep
                  number="01"
                  title="APPLY"
                  description="Join our guestlist by completing our intentional questionnaire. We review each application to ensure a thoughtful fit."
                  delay={0.1}
                />
                <AnimatedStep
                  number="02"
                  title="REQUEST"
                  description="When a table drops at one of our hand-picked London restaurants, request your seat. Each table is curated for up to 6 guests."
                  delay={0.2}
                />
                <AnimatedStep
                  number="03"
                  title="CONNECT"
                  description="Confirm your seat, mark your calendar and show up for a dinner designed to spark genuine conversation."
                  delay={0.3}
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="what-is-required"
          className="w-full overflow-hidden bg-card py-16 md:py-20 lg:py-24"
        >
          <div className="container mx-auto px-4 md:px-6">
            <motion.h2
              className="font-display text-4xl md:text-5xl uppercase text-center mb-16 md:mb-20 font-black"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              RULES OF ENGAGEMENT
            </motion.h2>

            <div className="mx-auto max-w-4xl">
              <div className="grid grid-cols-1 gap-16 md:gap-12 md:grid-cols-3">
                <AnimatedStep
                  number="01"
                  title="PRESENCE"
                  description="Bring your full self to the table. Disconnect from your phone and be truly present with those around you."
                  delay={0.1}
                />
                <AnimatedStep
                  number="02"
                  title="CURIOSITY"
                  description="Memorable conversations begin with an open mind and a curious spirit. Come ready to listen as much as you share."
                  delay={0.2}
                />
                <AnimatedStep
                  number="03"
                  title="INTENTION"
                  description="Commit not only to the booking, but to the experience. You're not just showing up for yourself, but for your fellow diners too."
                  delay={0.3}
                />
              </div>
              
              <motion.p
                className="font-sans text-base md:text-lg text-center max-w-2xl mx-auto mt-16 text-foreground/60 italic"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                No pitching, selling or dating. Just show up as you are for a memorable experience with great food and non-transactional conversation.
              </motion.p>
            </div>
          </div>
        </section>

        <section
          id="philosophy"
          className="w-full overflow-hidden bg-card py-12 md:py-16 lg:py-20"
        >
          <div className="container mx-auto px-4 md:px-6">
            <motion.h2
              className="font-display text-4xl md:text-5xl uppercase text-center mb-12 font-black"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              WHY WE GATHER
            </motion.h2>

            <div className="mx-auto max-w-3xl">
              <div className="space-y-6 text-center">
                <motion.p
                  className="font-sans text-lg md:text-xl leading-relaxed text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  In a world of surface-level interactions, we&apos;re building something deeper. We believe food is more than fuel — it&apos;s a shared language. And connection is more than a buzzword, it&apos;s a basic human need.
                </motion.p>
                <motion.p
                  className="font-sans text-lg md:text-xl leading-relaxed text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  The Table App exists to bring curious minds together through shared dinners that remind us what it means to be in community.
                </motion.p>
              </div>
              
              <motion.div
                className="flex justify-center mt-12"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <Icon className="w-24 h-24" />
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full overflow-hidden bg-primary py-16 md:py-20 rounded-xl mt-2">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-6xl mx-auto space-y-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-center space-y-6"
            >
              <h2 className="font-display text-2xl md:text-3xl uppercase text-primary-foreground font-black">
                REAL CONNECTION BEGINS AT THE TABLE
              </h2>
              
              <div className="space-y-4">
                <p className="font-sans text-sm text-primary-foreground/80">
                  Subscribe for table drops and London hidden gems.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 focus-visible:border-input focus:text-input text-input bg-primary text-primary-foreground hover:bg-primary/90 shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),0_4px_6px_-2px_rgba(16,24,40,0.1),0_2px_4px_-1px_rgba(16,24,40,0.06)]"
                    disabled
                  />
                  <Button
                    className="font-extrabold uppercase tracking-wide"
                    disabled
                  >
                    SUBSCRIBE
                  </Button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col md:flex-row items-center justify-center gap-12 md:gap-24"
            >
              <div className="space-y-3 text-center">
                <p className="font-sans text-sm text-primary-foreground/70 uppercase tracking-wide">
                  Download
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://apps.apple.com/app/the-table-app/id6752313205"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                    aria-label="Download on App Store"
                  >
                    <svg
                      className="size-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                    aria-label="Download on Google Play"
                  >
                    <svg
                      className="size-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="space-y-3 text-center">
                <p className="font-sans text-sm text-primary-foreground/70 uppercase tracking-wide">
                  Contact
                </p>
                <a
                  href="mailto:hello@thetableapp.co"
                  className="font-sans text-base text-primary-foreground hover:text-primary-foreground/80 transition-colors block"
                >
                  hello@thetableapp.co
                </a>
              </div>
              
              <div className="space-y-3 text-center">
                <p className="font-sans text-sm text-primary-foreground/70 uppercase tracking-wide">
                  Follow Us
                </p>
                <div className="flex justify-center gap-4">
                  <a
                    href="https://www.instagram.com/thetableapp.co/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                    aria-label="Instagram"
                  >
                    <svg
                      className="size-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/thetableapp/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg
                      className="size-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  {/*<a
                    href="https://www.tiktok.com/@thetableapp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground hover:text-primary-foreground/80 transition-colors"
                    aria-label="TikTok"
                  >
                    <svg
                      className="size-6"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                  </a>*/}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col items-center justify-between gap-4 border-primary-foreground/20 border-t pt-8 text-primary-foreground/60 text-xs sm:flex-row"
            >
              <p>© 2026 The Table App Ltd. All rights reserved.</p>
              <div className="flex gap-4">
                <a
                  className="transition-colors hover:text-primary-foreground/80"
                  href="#"
                >
                  Terms
                </a>
                <a
                  className="transition-colors hover:text-primary-foreground/80"
                  href="/privacy"
                >
                  Privacy
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </footer>

      <EmailModal
        isOpen={isEmailModalOpen}
        onClose={() => {
          setIsEmailModalOpen(false);
          setEmail("");
          setError("");
        }}
        onSubmit={handleEmailSubmit}
        isLoading={isLoading}
      />

      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => {
          setIsOtpModalOpen(false);
          setEmail("");
          setError("");
        }}
        onVerify={handleVerifyOtp}
        email={email}
        isLoading={isLoading}
      />

      <QuestionnaireModal
        isOpen={isQuestionnaireModalOpen}
        onClose={() => {
          setIsQuestionnaireModalOpen(false);
          setEmail("");
          setUserId(null);
          setError("");
        }}
        userEmail={email}
        userId={userId}
      />
    </div>
  );
}
