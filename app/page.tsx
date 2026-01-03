"use client";

import {Button} from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
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
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        How it Works
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        What is Required?
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-foreground"
                                        asChild
                                    >
                                        <Link href="/#pricing">Why We Gather</Link>
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

            <main className='relative min-h-screen w-full overflow-hidden scroll-smooth pt-14'>
                <section className="relative w-full overflow-hidden bg-background py-12 md:py-20 lg:py-24">
                    <div className="container relative mx-auto px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center gap-6 text-center">
                            <div className="flex max-w-3xl flex-col items-center justify-center space-y-4">
                                <div className="space-y-2.5">
                                    <h1
                                        className="text-3xl text-foreground tracking-tighter sm:text-4xl md:text-7xl balance">
                                        Transcend human limits<br/>
                                        <span className="text-muted-foreground">Augment your mind.</span>
                                    </h1>
                                    <p className="mx-auto max-w-[600px] text-muted-foreground text-sm leading-relaxed md:text-base">
                                        Neural enhancement technology that expands memory, synthesizes voice, and
                                        connects minds.
                                        Experience the next evolution of human potential.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 pt-2 min-[400px]:flex-row">
                                    <Button
                                        asChild
                                    >
                                        <Link href="/login">Join Our Guestlist</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className="w-full overflow-hidden bg-white pt-12 pb-8 md:pt-16 md:pb-10 lg:pt-20 lg:pb-12 dark:bg-black/3">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="mb-10 space-y-3 text-center">
                            <div className="mx-auto flex w-fit items-center justify-center">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-px w-12 bg-linear-to-r from-transparent to-black/10 dark:to-white/10"></div>
                                    <div
                                        className="flex items-center gap-2 rounded-lg border border-black/5 bg-black/2 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
                                        <span className="font-medium text-black/60 text-xs dark:text-white/60">How it works</span>
                                    </div>
                                    <div
                                        className="h-px w-12 bg-linear-to-l from-transparent to-black/10 dark:to-white/10"></div>
                                </div>
                            </div>
                            <h2 className="font-semibold text-3xl text-neutral-900 tracking-tight sm:text-4xl dark:text-neutral-50">Basic
                                Concept</h2></div>


                        <div className="mx-auto max-w-4xl">
                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                                <div
                                    className="flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-black/3 dark:border-white/10 dark:bg-white/10">
                                    <div className="flex flex-1 flex-col p-4">
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
                                </div>
                                <div
                                    className="flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-black/3 dark:border-white/10 dark:bg-white/10">
                                    <div className="flex flex-1 flex-col p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2"><span
                                                className="font-mono text-[10px] text-black/40 tracking-tighter dark:text-white/40">02</span>
                                                <div className="h-px w-4 bg-[#A8F1F7]/30"></div>
                                            </div>
                                        </div>
                                        <h3 className="mb-1.5 font-semibold text-base text-black/80 tracking-tighter dark:text-white/80">Request A Seat</h3><p
                                        className="mb-3 text-[11px] text-black/60 leading-relaxed tracking-tighter dark:text-white/60">When a table drops, request a seat. Each table is curated for 6 guests, based on shared interests.</p>
                                    </div>
                                </div>
                                <div
                                    className="flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-black/3 dark:border-white/10 dark:bg-white/10">
                                    <div className="flex flex-1 flex-col p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2"><span
                                                className="font-mono text-[10px] text-black/40 tracking-tighter dark:text-white/40">03</span>
                                                <div className="h-px w-4 bg-[#A8F1F7]/30"></div>
                                            </div>
                                        </div>
                                        <h3 className="mb-1.5 font-semibold text-base text-black/80 tracking-tighter dark:text-white/80">RSVP</h3><p
                                        className="mb-3 text-[11px] text-black/60 leading-relaxed tracking-tighter dark:text-white/60">Confirm your spot, mark your calendar, and prepare for a memorable dinner.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className="w-full overflow-hidden bg-white pt-12 pb-8 md:pt-16 md:pb-10 lg:pt-20 lg:pb-12 dark:bg-black/3">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="mb-10 space-y-3 text-center">
                            <div className="mx-auto flex w-fit items-center justify-center">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-px w-12 bg-linear-to-r from-transparent to-black/10 dark:to-white/10"></div>
                                    <div
                                        className="flex items-center gap-2 rounded-lg border border-black/5 bg-black/2 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
                                        <span className="font-medium text-black/60 text-xs dark:text-white/60">What is Required?</span>
                                    </div>
                                    <div
                                        className="h-px w-12 bg-linear-to-l from-transparent to-black/10 dark:to-white/10"></div>
                                </div>
                            </div>
                            <h2 className="font-semibold text-3xl text-neutral-900 tracking-tight sm:text-4xl dark:text-neutral-50">Rules of Engagement</h2></div>


                        <div className="mx-auto max-w-4xl">
                            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                                <div
                                    className="flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-black/3 dark:border-white/10 dark:bg-white/10">
                                    <div className="flex flex-1 flex-col p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2"><span
                                                className="font-mono text-[10px] text-black/40 tracking-tighter dark:text-white/40">01</span>
                                                <div className="h-px w-4 bg-[#A8F1F7]/30"></div>
                                            </div>
                                        </div>
                                        <h3 className="mb-1.5 font-semibold text-base text-black/80 tracking-tighter dark:text-white/80">Presence</h3><p
                                        className="mb-3 text-[11px] text-black/60 leading-relaxed tracking-tighter dark:text-white/60">A rarity in today’s world, bring your full self to the table.</p>
                                    </div>
                                </div>
                                <div
                                    className="flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-black/3 dark:border-white/10 dark:bg-white/10">
                                    <div className="flex flex-1 flex-col p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2"><span
                                                className="font-mono text-[10px] text-black/40 tracking-tighter dark:text-white/40">02</span>
                                                <div className="h-px w-4 bg-[#A8F1F7]/30"></div>
                                            </div>
                                        </div>
                                        <h3 className="mb-1.5 font-semibold text-base text-black/80 tracking-tighter dark:text-white/80">Curiosity</h3><p
                                        className="mb-3 text-[11px] text-black/60 leading-relaxed tracking-tighter dark:text-white/60">Memorable conversations begin with an open mind and a curious spirit.</p>
                                    </div>
                                </div>
                                <div
                                    className="flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-black/3 dark:border-white/10 dark:bg-white/10">
                                    <div className="flex flex-1 flex-col p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <div className="flex items-center gap-2"><span
                                                className="font-mono text-[10px] text-black/40 tracking-tighter dark:text-white/40">03</span>
                                                <div className="h-px w-4 bg-[#A8F1F7]/30"></div>
                                            </div>
                                        </div>
                                        <h3 className="mb-1.5 font-semibold text-base text-black/80 tracking-tighter dark:text-white/80">Intention</h3><p
                                        className="mb-3 text-[11px] text-black/60 leading-relaxed tracking-tighter dark:text-white/60">Commit, not just to the booking, but to the experience..</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className="w-full overflow-hidden bg-white pt-12 pb-8 md:pt-16 md:pb-10 lg:pt-20 lg:pb-12 dark:bg-black/3">
                    <div className="container mx-auto px-4 md:px-6">
                        <div className="mb-10 space-y-3 text-center">
                            <div className="mx-auto flex w-fit items-center justify-center">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="h-px w-12 bg-linear-to-r from-transparent to-black/10 dark:to-white/10"></div>
                                    <div
                                        className="flex items-center gap-2 rounded-lg border border-black/5 bg-black/2 px-3 py-1.5 dark:border-white/10 dark:bg-white/5">
                                        <span className="font-medium text-black/60 text-xs dark:text-white/60">Our Philosophy</span>
                                    </div>
                                    <div
                                        className="h-px w-12 bg-linear-to-l from-transparent to-black/10 dark:to-white/10"></div>
                                </div>
                            </div>
                            <h2 className="font-semibold text-3xl text-neutral-900 tracking-tight sm:text-4xl dark:text-neutral-50">Why We Gather</h2>
                        </div>

                        <div className="mx-auto max-w-2xl">
                            <div className="space-y-6 text-center">
                                <p className="text-base text-neutral-600 leading-relaxed dark:text-neutral-400">
                                    In a world of surface-level interactions, we&apos;re building something deeper. We believe food is more than fuel, it&apos;s a shared language. And connection is more than a buzzword, it&apos;s a basic human need.
                                </p>
                                <p className="text-base text-neutral-600 leading-relaxed dark:text-neutral-400">
                                    The Table App exists to bring curious minds together through shared dinners that remind us what it means to be in community.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
