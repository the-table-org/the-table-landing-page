"use client";

import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import {motion, useScroll, useTransform, useInView} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import {WritingText} from "@/components/animate-ui/text/writing";
import {supabase} from "@/lib/supabase";
import {OtpModal} from "@/components/ui/otp-modal";

function SectionHeader({badge, title}: { badge: string; title: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, {once: true, margin: "-100px"});

    return (
        <div ref={ref} className="mb-12 md:mb-16 space-y-4 text-center">
            <motion.div
                className="mx-auto flex w-fit items-center justify-center"
                initial={{opacity: 0, y: 20}}
                animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                transition={{duration: 0.6, ease: "easeOut"}}
            >
                <div className="flex items-center gap-3">
                    <div className="h-px w-12 bg-linear-to-r from-transparent to-black/10 dark:to-white/10"></div>
                    <div
                        className="flex items-center gap-2 rounded-lg border border-black/5 bg-black/2 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
                        <span className="font-medium text-black/60 text-xs dark:text-white/60">{badge}</span>
                    </div>
                    <div className="h-px w-12 bg-linear-to-l from-transparent to-black/10 dark:to-white/10"></div>
                </div>
            </motion.div>
            <motion.h2
                className="font-semibold text-3xl text-neutral-900 tracking-tight sm:text-4xl dark:text-neutral-50"
                initial={{opacity: 0, y: 20}}
                animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                transition={{duration: 0.6, delay: 0.1, ease: "easeOut"}}
            >
                {title}
            </motion.h2>
        </div>
    );
}

function AnimatedCard({children, delay = 0}: { children: React.ReactNode; delay?: number }) {
    const ref = useRef(null);
    const isInView = useInView(ref, {once: true, margin: "-100px"});

    return (
        <motion.div
            ref={ref}
            initial={{opacity: 0, y: 50}}
            animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 50}}
            transition={{
                duration: 0.7,
                delay: isInView ? delay : 0,
                ease: [0.22, 1, 0.36, 1]
            }}
            className="flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-black/3 dark:border-white/10 dark:bg-white/10"
        >
            {children}
        </motion.div>
    );
}

function AnimatedPhilosophy() {
    const ref = useRef(null);
    const isInView = useInView(ref, {once: true, margin: "-100px"});

    return (
        <div ref={ref} className="mx-auto max-w-3xl">
            <div className="space-y-6 text-center">
                <motion.p
                    className="text-base text-neutral-600 leading-relaxed dark:text-neutral-400"
                    initial={{opacity: 0, y: 20}}
                    animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                    transition={{duration: 0.6, ease: "easeOut"}}
                >
                    In a world of surface-level interactions, we&apos;re building something deeper. We
                    believe food is more than fuel, it&apos;s a shared language. And connection is more
                    than a buzzword, it&apos;s a basic human need.
                </motion.p>
                <motion.p
                    className="text-base text-neutral-600 leading-relaxed dark:text-neutral-400"
                    initial={{opacity: 0, y: 20}}
                    animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                    transition={{duration: 0.6, delay: 0.15, ease: "easeOut"}}
                >
                    The Table App exists to bring curious minds together through shared dinners that
                    remind us what it means to be in community.
                </motion.p>
            </div>
        </div>
    );
}

export default function Home() {
    const [activeSection, setActiveSection] = useState("hero");
    const {scrollYProgress} = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

    const [email, setEmail] = useState("");
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const sections = document.querySelectorAll("section[id]");
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -60% 0px",
            threshold: 0
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
                behavior: "smooth"
            });
        }
    };

    const handleJoinGuestlist = async () => {
        setError("");

        if (!email || !email.includes("@")) {
            setError("Please enter a valid email address");
            return;
        }

        setIsLoading(true);
        setIsOtpModalOpen(true);

        try {
            const {error} = await supabase.auth.signInWithOtp({
                email: email,
                options: {
                    shouldCreateUser: true,
                }
            });

            if (error) throw error;

            setIsOtpModalOpen(true);
        } catch (err: any) {
            setError(err.message || "Failed to send verification code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async (otp: string) => {
        setIsLoading(true);

        try {
            const {error} = await supabase.auth.verifyOtp({
                email: email,
                token: otp,
                type: 'email'
            });

            if (error) throw error;

            setIsOtpModalOpen(false);
        } catch (err: any) {
            throw new Error(err.message || "Invalid verification code");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background text-foreground overflow-hidden">
            <div className="fixed top-0 right-0 left-0 z-50 w-full">
                <header
                    className="relative z-50 w-full tracking-tighter transition-all duration-300 bg-background/80 backdrop-blur-sm">
                    <div className="relative mx-auto max-w-7xl px-6">
                        <div className="flex h-16 items-center justify-between gap-8">
                            <div className="flex items-center">
                                <Link href="/" className="flex items-center gap-2" aria-label="The Table">
                                    <Image
                                        src="/icon.png"
                                        alt="The Table Logo"
                                        width={32}
                                        height={32}
                                        priority
                                    />
                                    <span
                                        className="font-bold text-2xl text-foreground tracking-tighter transition-colors">
                                        The Table App
                                    </span>
                                </Link>
                            </div>
                            <div className="hidden items-center gap-1 lg:flex">
                                <nav className="group/nav flex items-center gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`text-muted-foreground hover:text-foreground transition-all duration-300 ${
                                            activeSection === "how-it-works" ? "text-foreground font-medium" : ""
                                        }`}
                                        onClick={() => scrollToSection("how-it-works")}
                                    >
                                        How it Works
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`text-muted-foreground hover:text-foreground transition-all duration-300 ${
                                            activeSection === "what-is-required" ? "text-foreground font-medium" : ""
                                        }`}
                                        onClick={() => scrollToSection("what-is-required")}
                                    >
                                        What is Required
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`text-muted-foreground hover:text-foreground transition-all duration-300 ${
                                            activeSection === "philosophy" ? "text-foreground font-medium" : ""
                                        }`}
                                        onClick={() => scrollToSection("philosophy")}
                                    >
                                        Our Philosophy
                                    </Button>
                                </nav>
                                <div className="mx-3 h-4 w-px bg-black/10 dark:bg-white/10"></div>
                                <Button
                                    size="sm"
                                    asChild
                                >
                                    <a href="https://apps.apple.com/app/the-table-app/id6752313205" target="_blank"
                                       rel="noopener noreferrer">Get The Table App</a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>
            </div>

            <main className='relative min-h-screen w-full overflow-hidden scroll-smooth'>
                <section id="hero"
                         className="relative w-full overflow-hidden bg-background min-h-screen flex items-center justify-center pt-16 pb-20">
                    <motion.div
                        className="container relative mx-auto px-4 md:px-6"
                        style={{opacity, scale}}
                    >
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="flex max-w-4xl flex-col items-center justify-center space-y-10">
                                <motion.div
                                    className="space-y-6"
                                    initial={{opacity: 0, y: 30}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.8, ease: "easeOut"}}
                                >
                                    <h1 className="text-4xl text-foreground tracking-tight sm:text-5xl md:text-6xl lg:text-7xl font-semibold">
                                        <WritingText
                                            text="Connection deserves a seat."
                                            transition={{type: "spring", bounce: 0, duration: 1.5, delay: 0.05}}
                                            inView={true}
                                            inViewOnce={true}
                                        />
                                    </h1>
                                    <motion.p
                                        className="mx-auto max-w-[700px] text-muted-foreground text-base leading-relaxed md:text-lg"
                                        initial={{opacity: 0, y: 20}}
                                        animate={{opacity: 1, y: 0}}
                                        transition={{duration: 0.8, delay: 0.4, ease: "easeOut"}}
                                    >
                                        At The Table, we believe the most meaningful conversations happen when
                                        thoughtfully chosen people gather around a table to share a meal together.
                                    </motion.p>
                                </motion.div>
                                <motion.div
                                    className="flex flex-col gap-4 items-center w-full max-w-md"
                                    initial={{opacity: 0, y: 20}}
                                    animate={{opacity: 1, y: 0}}
                                    transition={{duration: 0.8, delay: 0.6, ease: "easeOut"}}
                                >
                                    <div className="flex w-full flex-col gap-2">
                                        <div className="flex w-full gap-2">
                                            <Input
                                                type="email"
                                                placeholder="Enter your email"
                                                className="flex-1"
                                                autoComplete="email"
                                                value={email}
                                                onChange={(e) => {
                                                    setEmail(e.target.value);
                                                    setError("");
                                                }}
                                                disabled={isLoading}
                                            />
                                            <Button onClick={handleJoinGuestlist} disabled={isLoading}>
                                                {isLoading ? "Sending..." : "Join our Guestlist"}
                                            </Button>
                                        </div>
                                        {error && (
                                            <p className="text-sm text-red-500 text-center">{error}</p>
                                        )}
                                    </div>
                                    <p className="text-muted-foreground/70 text-xs leading-relaxed max-w-md text-center">
                                        We&apos;re currently curating dinners at London&apos;s best restaurants.
                                        You&apos;ll be the first to know when tables drop.
                                    </p>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                <section
                    id="how-it-works"
                    className="w-full overflow-hidden bg-white py-16 md:py-24 lg:py-32 dark:bg-black/3">
                    <div className="container mx-auto px-4 md:px-6">
                        <SectionHeader
                            badge="How it works"
                            title="Basic Concept"
                        />


                        <div className="mx-auto max-w-5xl">
                            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
                                <AnimatedCard delay={0.2}>
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2"><span
                                                className="font-mono text-[10px] text-black/40 tracking-tighter dark:text-white/40">01</span>
                                                <div className="h-px w-4 bg-[#A8F1F7]/30"></div>
                                            </div>
                                        </div>
                                        <h3 className="mb-1.5 font-semibold text-base text-black/80 tracking-tighter dark:text-white/80">Join
                                            our Guestlist</h3><p
                                        className="mb-3 text-[11px] text-black/60 leading-relaxed tracking-tighter dark:text-white/60">Start
                                        by telling us a bit about yourself. We review each application to ensure a
                                        thoughtful fit.</p>
                                    </div>
                                </AnimatedCard>
                                <AnimatedCard delay={0.4}>
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2"><span
                                                className="font-mono text-[10px] text-black/40 tracking-tighter dark:text-white/40">02</span>
                                                <div className="h-px w-4 bg-[#A8F1F7]/30"></div>
                                            </div>
                                        </div>
                                        <h3 className="mb-1.5 font-semibold text-base text-black/80 tracking-tighter dark:text-white/80">Request
                                            A Seat</h3><p
                                        className="mb-3 text-[11px] text-black/60 leading-relaxed tracking-tighter dark:text-white/60">When
                                        a table drops, request a seat. Each table is curated for 6 guests, based on
                                        shared interests.</p>
                                    </div>
                                </AnimatedCard>
                                <AnimatedCard delay={0.6}>
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2"><span
                                                className="font-mono text-[10px] text-black/40 tracking-tighter dark:text-white/40">03</span>
                                                <div className="h-px w-4 bg-[#A8F1F7]/30"></div>
                                            </div>
                                        </div>
                                        <h3 className="mb-1.5 font-semibold text-base text-black/80 tracking-tighter dark:text-white/80">RSVP</h3>
                                        <p
                                            className="mb-3 text-[11px] text-black/60 leading-relaxed tracking-tighter dark:text-white/60">Confirm
                                            your spot, mark your calendar, and prepare for a memorable dinner.</p>
                                    </div>
                                </AnimatedCard>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="what-is-required"
                    className="w-full overflow-hidden bg-white py-16 md:py-24 lg:py-32 dark:bg-black/3">
                    <div className="container mx-auto px-4 md:px-6">
                        <SectionHeader
                            badge="What is Required"
                            title="Rules of Engagement"
                        />


                        <div className="mx-auto max-w-5xl">
                            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-3">
                                <AnimatedCard delay={0.2}>
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2"><span
                                                className="font-mono text-[10px] text-black/40 tracking-tighter dark:text-white/40">01</span>
                                                <div className="h-px w-4 bg-[#A8F1F7]/30"></div>
                                            </div>
                                        </div>
                                        <h3 className="mb-1.5 font-semibold text-base text-black/80 tracking-tighter dark:text-white/80">Presence</h3>
                                        <p
                                            className="mb-3 text-[11px] text-black/60 leading-relaxed tracking-tighter dark:text-white/60">A
                                            rarity in today&#39;s world, bring your full self to the table.</p>
                                    </div>
                                </AnimatedCard>
                                <AnimatedCard delay={0.4}>
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2"><span
                                                className="font-mono text-[10px] text-black/40 tracking-tighter dark:text-white/40">02</span>
                                                <div className="h-px w-4 bg-[#A8F1F7]/30"></div>
                                            </div>
                                        </div>
                                        <h3 className="mb-1.5 font-semibold text-base text-black/80 tracking-tighter dark:text-white/80">Curiosity</h3>
                                        <p
                                            className="mb-3 text-[11px] text-black/60 leading-relaxed tracking-tighter dark:text-white/60">Memorable
                                            conversations begin with an open mind and a curious spirit.</p>
                                    </div>
                                </AnimatedCard>
                                <AnimatedCard delay={0.6}>
                                    <div className="flex flex-1 flex-col p-6">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2"><span
                                                className="font-mono text-[10px] text-black/40 tracking-tighter dark:text-white/40">03</span>
                                                <div className="h-px w-4 bg-[#A8F1F7]/30"></div>
                                            </div>
                                        </div>
                                        <h3 className="mb-1.5 font-semibold text-base text-black/80 tracking-tighter dark:text-white/80">Intention</h3>
                                        <p
                                            className="mb-3 text-[11px] text-black/60 leading-relaxed tracking-tighter dark:text-white/60">Commit,
                                            not just to the booking, but to the experience..</p>
                                    </div>
                                </AnimatedCard>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    id="philosophy"
                    className="w-full overflow-hidden bg-white py-16 md:py-24 lg:py-32 dark:bg-black/3">
                    <div className="container mx-auto px-4 md:px-6">
                        <SectionHeader
                            badge="Our Philosophy"
                            title="Why We Gather"
                        />

                        <AnimatedPhilosophy/>
                    </div>
                </section>
            </main>

            <footer className="w-full overflow-hidden bg-white py-12 md:py-16  dark:bg-black/3">
                <div className="container mx-auto px-4 md:px-6">
                    <div
                        className="rounded-xl border border-black/5 bg-black/3 p-6 md:p-8 dark:border-white/10 dark:bg-white/10">
                        <div className='grid grid-cols-1 gap-8 md:grid-cols-3'>
                            <div className="space-y-3">
                                <Link
                                    className="inline-block font-semibold text-2xl text-black/80 tracking-tighter transition-opacity hover:opacity-80 dark:text-white/80"
                                    href="/"
                                >
                                        <span
                                            className="font-bold text-2xl text-black tracking-tighter transition-colors dark:text-white">
                                            The Table App
                                        </span>
                                </Link>
                                <p className="max-w-xs text-black/60 text-sm tracking-tighter dark:text-white/60">
                                    Where every dinner is an introduction.
                                </p>
                            </div>
                            <div className="space-y-4">
                                <h3 className="font-medium text-black/80 text-sm tracking-tighter dark:text-white/80">
                                    Download the Table App
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        asChild
                                        size="sm"
                                    >
                                        <a
                                            href="https://apps.apple.com/app/the-table-app/id6752313205"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path
                                                    d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                            </svg>
                                            App Store
                                        </a>
                                    </Button>
                                    <Button
                                        asChild
                                        size="sm"
                                    >
                                        <a href="#">
                                            <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                                                <path
                                                    d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z"/>
                                            </svg>
                                            Google Play
                                        </a>
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-medium text-black/80 text-sm tracking-tighter dark:text-white/80">
                                    Follow us
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        asChild
                                        size="icon"
                                    >
                                        <a href="https://www.linkedin.com/company/thetableapp/" aria-label="LinkedIn">
                                            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path
                                                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                            </svg>
                                        </a>
                                    </Button>
                                    <Button
                                        asChild
                                        size="icon"
                                    >
                                        <a href="https://www.instagram.com/thetableapp.co/" aria-label="Instagram">
                                            <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                                                <path
                                                    d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                            </svg>
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div
                            className="mt-8 flex flex-col items-start justify-between gap-4 border-black/5 border-t pt-6 text-black/50 text-xs tracking-tighter sm:flex-row sm:items-center dark:border-white/10 dark:text-white/50">
                            <p>© 2026 The Table App Ltd. All rights reserved.</p>
                            <div className="flex gap-4">
                                <a
                                    className="transition-colors hover:text-black/70 dark:hover:text-white/70"
                                    href="#"
                                >
                                    Terms
                                </a>
                                <a
                                    className="transition-colors hover:text-black/70 dark:hover:text-white/70"
                                    href="/privacy"
                                >
                                    Privacy
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>

            <OtpModal
                isOpen={isOtpModalOpen}
                onClose={() => setIsOtpModalOpen(false)}
                onVerify={handleVerifyOtp}
                email={email}
                isLoading={isLoading}
            />
        </div>
    );
}
