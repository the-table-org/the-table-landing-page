"use client";

import Image from "next/image";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {ChevronRight} from "lucide-react";
import {motion} from "framer-motion";
import {WritingText} from "@/components/animate-ui/text/writing";
import {BorderTrail} from "@/components/animate-ui/effects/border-trail";

export default function Home() {
    const containerVariants = {
        hidden: {opacity: 0},
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: {opacity: 0, y: 20},
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    };

    return (
        <div className="h-screen bg-background font-sans flex items-center justify-center p-8 overflow-hidden">
            <div className="flex gap-4 h-[95dvh] w-full">
                {/* Left Side - Hero Image */}
                <div
                    className="relative bg-primary p-6 lg:p-8 flex flex-col justify-between rounded-3xl w-2/5 overflow-hidden border border-border/50">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src="/community-meeting.png"
                            alt="Community gathering"
                            fill
                            className="object-cover opacity-60"
                        />
                    </div>

                    {/* Dark overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"></div>

                    {/* Logo */}
                    <div className="flex items-start relative z-10">
                        <Link href="/">
                            <motion.div
                                className="w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20 cursor-pointer hover:bg-white/20 transition-colors"
                                whileHover={{scale: 1.05, rotate: 5}}
                                whileTap={{scale: 0.95}}
                                animate={{
                                    y: [0, -8, 0],
                                }}
                                transition={{
                                    y: {
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    },
                                }}
                            >
                                <Image
                                    src="/logo.png"
                                    alt="The Table Logo"
                                    width={24}
                                    height={24}
                                />
                            </motion.div>
                        </Link>
                    </div>
                </div>

                {/* Right Side - Content */}
                <div
                    className="p-8 flex flex-col justify-between bg-white rounded-3xl overflow-y-auto w-3/5 border border-border/50">
                    <motion.div
                        className="max-w-2xl"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.h1
                            variants={itemVariants}
                            className="text-3xl lg:text-4xl font-serif font-semibold text-foreground mb-8 leading-tight"
                        >
                            <WritingText
                                text="Connection deserves a seat."
                                transition={{type: 'spring', bounce: 0, duration: 2, delay: 0.12}}
                            />
                        </motion.h1>

                        <div className="space-y-5 text-[16px] leading-[1.7] text-muted-foreground">
                            <motion.p variants={itemVariants}>
                                Before cities or language, people gathered around fires. Around anything that felt like
                                a place to belong. We shared stories and warmth not because we planned to, but because
                                connection was how humans survived. It was never complicated. It was just what we did.
                            </motion.p>

                            <motion.p variants={itemVariants}>
                                Then the world got faster. Louder. Lonelier. Now we scroll past thousands of faces but
                                rarely sit across from one. We move through crowds but feel unseen. We ache for what we
                                lost: the ease of being known without performing. Of belonging without trying. Of
                                feeling like we matter to someone, even if we just met.
                            </motion.p>

                            <motion.p variants={itemVariants}>
                                The Table brings that back. A space where you can show up exactly as you are. Where
                                strangers become familiar over shared meals and real conversations. Where the weight of
                                loneliness lifts because you remember what it feels like to be welcomed. Not a swipe.
                                Not a profile. Not a transaction. Just a seat, a story, and the feeling of home.
                            </motion.p>
                        </div>

                        {/* CTA Button */}
                        <motion.div
                            variants={itemVariants}
                            className="mt-12"
                        >
                            <motion.div
                            >
                                <Button size="lg" asChild className="relative overflow-hidden">
                                    <Link href="/questionnaire">
                                        Join us at the Table
                                        <motion.div
                                            animate={{x: [0, 4, 0]}}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut",
                                            }}
                                        >
                                            <ChevronRight className="w-5 h-5"/>
                                        </motion.div>
                                    </Link>
                                </Button>
                            </motion.div>
                        </motion.div>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        className="mt-8 pt-6 border-t border-border border-dashed"
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 1.2, duration: 0.6}}
                    >
                        <div className="flex items-center justify-between text-xs text-muted-foreground/60">
                            <p>©2025 The Table App Ltd. All rights reserved.</p>
                            <div className="flex items-center gap-4">
                                <motion.a
                                    href="https://www.instagram.com/thetableapp.co/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-foreground transition-colors"
                                    whileHover={{scale: 1.2, rotate: 5}}
                                    whileTap={{scale: 0.9}}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                    </svg>
                                </motion.a>
                                <motion.a
                                    href="https://www.linkedin.com/company/thetableapp"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-foreground transition-colors"
                                    whileHover={{scale: 1.2, rotate: 5}}
                                    whileTap={{scale: 0.9}}
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                    </svg>
                                </motion.a>
                                <motion.a
                                    href="/privacy"
                                    className="hover:text-foreground transition-colors"
                                    whileHover={{scale: 1.05}}
                                    whileTap={{scale: 0.95}}
                                >
                                    Privacy Policy
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
