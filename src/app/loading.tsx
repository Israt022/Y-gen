"use client";

import { motion } from "motion/react";

export default function LoadingScreen() {
    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#090d18] text-white">
            {/* Ambient glow */}
            <div className="absolute h-72 w-72 rounded-full bg-indigo-500/10 blur-[100px]" />

            <div className="relative flex flex-col items-center gap-6">
                {/* Animated logo */}
                <motion.div
                    animate={{
                        rotateY: [0, 180, 360],
                        scale: [1, 1.08, 1],
                    }}
                    transition={{
                        rotateY: {
                            duration: 3,
                            repeat: Infinity,
                            ease: "linear",
                        },
                        scale: {
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        },
                    }}
                    className="flex h-20 w-20 items-center justify-center rounded-2xl border border-indigo-400/30 bg-indigo-500/10 shadow-[0_0_50px_rgba(99,102,241,0.15)]"
                >
                    <span className="text-3xl font-semibold tracking-widest text-indigo-300">
                        幽
                    </span>
                </motion.div>

                {/* Brand */}
                <div className="text-center">
                    <h1 className="text-xl font-semibold tracking-[0.35em]">
                        YŪGEN
                    </h1>

                    <p className="mt-2 text-xs tracking-[0.25em] text-white/40">
                        DISCOVER BEYOND WORLDS
                    </p>
                </div>

                {/* Loading bar */}
                <div className="h-[2px] w-40 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                        animate={{ x: ["-100%", "250%"] }}
                        transition={{
                            duration: 1.4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="h-full w-1/2 rounded-full bg-indigo-400"
                    />
                </div>

                <motion.p
                    animate={{ opacity: [0.35, 0.8, 0.35] }}
                    transition={{ duration: 1.8, repeat: Infinity }}
                    className="text-[10px] uppercase tracking-[0.3em] text-white/40"
                >
                    Entering another world...
                </motion.p>
            </div>
        </main>
    );
}