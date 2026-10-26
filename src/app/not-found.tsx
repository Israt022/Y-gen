
"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
    ArrowLeft,
    ArrowUpRight,
    Compass,
    Home,
    Orbit,
    Sparkles,
} from "lucide-react";

const stars = Array.from({ length: 45 }, (_, i) => ({
    id: i,
    left: `${(i * 37 + 11) % 100}%`,
    top: `${(i * 23 + 7) % 100}%`,
    size: (i % 3) + 1,
    delay: (i % 7) * 0.4,
}));

const messages = [
    "This universe doesn't exist... yet.",
    "Even the stars couldn't find this page.",
    "Looks like you entered the wrong dimension.",
    "Lost in space? Let's find your way back.",
];

export default function NotFound() {
    const [portalOpen, setPortalOpen] = useState(false);
    const [messageIndex, setMessageIndex] = useState(0);

    const explorePortal = () => {
        setPortalOpen((previous) => !previous);
        setMessageIndex((previous) => (previous + 1) % messages.length);
    };

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090d18] px-5 py-16 text-white">
            {/* Background atmosphere */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12),transparent_55%)]" />

            <div className="pointer-events-none absolute inset-0">
                {stars.map((star) => (
                    <motion.span
                        key={star.id}
                        className="absolute rounded-full bg-indigo-200"
                        style={{
                            left: star.left,
                            top: star.top,
                            width: star.size,
                            height: star.size,
                        }}
                        animate={{
                            opacity: [0.15, 0.9, 0.15],
                            scale: [0.8, 1.5, 0.8],
                        }}
                        transition={{
                            duration: 2.5 + star.delay,
                            repeat: Infinity,
                            delay: star.delay,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Top navigation */}
            <Link
                href="/"
                className="absolute left-5 top-6 z-20 flex items-center gap-2 text-sm font-semibold tracking-[0.18em] text-white/75 transition hover:text-indigo-300 sm:left-10"
            >
                <span className="text-indigo-300">幽</span>
                YŪGEN
            </Link>

            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="relative z-10 mx-auto w-full max-w-4xl text-center"
            >
                {/* Portal illustration */}
                <div className="relative mx-auto mb-8 flex h-64 w-64 items-center justify-center sm:h-80 sm:w-80">
                    {/* Outer orbit */}
                    <motion.div
                        className="absolute inset-1 rounded-full border border-indigo-300/15"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
                    >
                        <span className="absolute left-8 top-9 h-2 w-2 rounded-full bg-indigo-300 shadow-[0_0_15px_4px_rgba(165,180,252,0.5)]" />
                        <span className="absolute bottom-8 right-9 h-1.5 w-1.5 rounded-full bg-violet-300" />
                    </motion.div>

                    {/* Orbital ring */}
                    <motion.div
                        className="absolute h-[82%] w-[82%] rounded-full border border-dashed border-violet-300/30"
                        animate={{ rotate: -360 }}
                        transition={{ duration: 36, repeat: Infinity, ease: "linear" }}
                    />

                    {/* Portal rings */}
                    <motion.div
                        animate={{
                            scale: portalOpen ? [1, 1.12, 1] : [1, 1.035, 1],
                            rotate: portalOpen ? [0, 8, -8, 0] : 0,
                        }}
                        transition={{
                            duration: portalOpen ? 1.1 : 4,
                            repeat: portalOpen ? 0 : Infinity,
                            ease: "easeInOut",
                        }}
                        className="relative flex h-[65%] w-[65%] items-center justify-center rounded-full border border-indigo-300/50 bg-indigo-500/[0.06] shadow-[0_0_35px_rgba(99,102,241,0.16),inset_0_0_35px_rgba(99,102,241,0.12)]"
                    >
                        <div className="absolute inset-3 rounded-full border border-violet-300/25" />
                        <div className="absolute inset-6 rounded-full border border-indigo-200/20" />

                        <motion.div
                            animate={{
                                rotate: 360,
                                scale: portalOpen ? [1, 1.15, 1] : [0.92, 1.04, 0.92],
                            }}
                            transition={{
                                rotate: {
                                    duration: portalOpen ? 3 : 12,
                                    repeat: Infinity,
                                    ease: "linear",
                                },
                                scale: {
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                },
                            }}
                            className="absolute inset-8 rounded-full bg-[conic-gradient(from_0deg,transparent,#6366f1,transparent,#a78bfa,transparent)] opacity-70 blur-md"
                        />

                        <motion.div
                            animate={{
                                boxShadow: portalOpen
                                    ? [
                                        "0 0 20px rgba(129,140,248,0.25)",
                                        "0 0 65px rgba(129,140,248,0.65)",
                                        "0 0 35px rgba(129,140,248,0.35)",
                                    ]
                                    : "0 0 24px rgba(129,140,248,0.2)",
                            }}
                            transition={{
                                duration: 1.2,
                                repeat: portalOpen ? Infinity : 0,
                                ease: "easeInOut",
                            }}
                            className="relative z-10 flex h-28 w-28 items-center justify-center rounded-full border border-indigo-200/40 bg-[#090d18]/90 sm:h-32 sm:w-32"
                        >
                            <Orbit
                                className="text-indigo-200"
                                size={54}
                                strokeWidth={1.2}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Floating symbols */}
                    <motion.div
                        className="absolute right-4 top-10 text-indigo-200/70"
                        animate={{ y: [0, -12, 0], rotate: [0, 15, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Sparkles size={23} />
                    </motion.div>

                    <motion.div
                        className="absolute bottom-10 left-3 text-violet-300/70"
                        animate={{ y: [0, 10, 0], rotate: [0, -15, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <Sparkles size={17} />
                    </motion.div>
                </div>

                {/* Error text */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-indigo-300">
                        Lost in another world
                    </p>

                    <h1 className="text-7xl font-black tracking-[-0.07em] sm:text-9xl">
                        <span className="bg-gradient-to-b from-white via-indigo-100 to-indigo-400 bg-clip-text text-transparent">
                            404
                        </span>
                    </h1>

                    <h2 className="mt-4 text-xl font-semibold tracking-tight sm:text-2xl">
                        This page has vanished into the void.
                    </h2>

                    <div className="mx-auto mt-4 min-h-12 max-w-md">
                        <AnimatePresence mode="wait">
                            <motion.p
                                key={messageIndex}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25 }}
                                className="text-sm leading-6 text-slate-400 sm:text-base"
                            >
                                {messages[messageIndex]}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Interactive actions */}
                <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                    <motion.button
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={explorePortal}
                        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-indigo-300/25 bg-indigo-400/10 px-6 py-3 text-sm font-semibold text-indigo-100 transition hover:border-indigo-300/50 hover:bg-indigo-400/15"
                    >
                        <Compass size={17} />
                        {portalOpen ? "Close the portal" : "Explore the portal"}
                    </motion.button>

                    <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
                        <Link
                            href="/"
                            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-indigo-300 px-6 py-3 text-sm font-bold text-[#090d18] transition hover:bg-indigo-200"
                        >
                            <Home size={17} />
                            Back to home
                            <ArrowUpRight size={16} />
                        </Link>
                    </motion.div>
                </div>

                {/* Portal status */}
                <AnimatePresence>
                    {portalOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0, y: 8 }}
                            animate={{ opacity: 1, height: "auto", y: 0 }}
                            exit={{ opacity: 0, height: 0, y: 8 }}
                            className="mx-auto mt-6 flex max-w-sm items-center justify-center gap-2 overflow-hidden text-xs text-indigo-200/80"
                        >
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-300" />
                            Portal activated · Choose your next destination
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-600">
                    <ArrowLeft size={13} />
                    <Link href="/explore" className="transition hover:text-indigo-300">
                        Or discover a new anime world
                    </Link>
                </div>
            </motion.div>

            {/* Bottom decoration */}
            <div className="pointer-events-none absolute bottom-5 left-0 right-0 text-center text-[9px] tracking-[0.4em] text-slate-700">
                YŪGEN · DISCOVER BEYOND WORLDS
            </div>
        </main>
    );
}
