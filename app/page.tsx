"use client";

import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
    return (
        <div className="bg-background text-foreground overflow-hidden">
            <div className="fixed top-0 right-0 left-0 z-50 w-full">
                <header className="relative z-50 w-full tracking-tighter transition-all duration-300 bg-background/80 backdrop-blur-sm">
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
                                    <span className="font-bold text-2xl text-foreground tracking-tighter transition-colors">
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
                                        Future of Human
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-foreground"
                                    >
                                        Company
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-muted-foreground hover:text-foreground"
                                        asChild
                                    >
                                        <Link href="/#pricing">Pricing</Link>
                                    </Button>
                                </nav>
                                <Separator orientation="vertical" className="mx-3 h-4" />
                                <Button
                                    size="sm"
                                    asChild
                                >
                                    <Link href="/login">Get Started</Link>
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
                                        Neural enhancement technology that expands memory, synthesizes voice, and connects minds.
                                        Experience the next evolution of human potential.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 pt-2 min-[400px]:flex-row">
                                    <Button
                                        size="sm"
                                        asChild
                                    >
                                        <Link href="/login">Join Our Guestlist</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container relative mx-auto mt-12 px-4 md:mt-16 md:px-6">
                        <div className="flex items-center justify-center w-full">
                            <div className="flex items-center gap-3">
                                <div className="h-px w-16 bg-border" />
                                <button
                                    className="group flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted px-3 py-1.5 transition-all duration-200 hover:scale-105 hover:bg-muted/80 hover:shadow-sm">
                                    <span
                                        className="font-medium text-muted-foreground text-xs transition-colors group-hover:text-foreground">Discover Capabilities</span>
                                </button>
                                <div className="h-px w-16 bg-border" />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
