"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AnimatedProduct from '@/components/AnimatedProduct';

export default function HeroSection() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: [0.6, -0.05, 0.01, 0.99],
            },
        },
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut",
            },
        },
    };

    return (
        <section className="relative h-[700px] flex items-center justify-center text-center overflow-hidden border-b-4 border-black">
            <div className="absolute inset-0 bg-black/40 z-10" />
            <motion.div
                className="absolute inset-0 bg-cover bg-center z-0"
                style={{ backgroundImage: 'url("/images/hero-bg.jpg")' }}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
            >
                <div className="w-full h-full bg-primary/20 mix-blend-overlay" />
            </motion.div>

            {/* Animated Product Showcase */}
            <AnimatedProduct />

            <motion.div
                className="relative z-20 container mx-auto px-4 space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="text-6xl md:text-8xl font-black tracking-tighter text-white drop-shadow-[4px_4px_0_rgba(0,0,0,1)] uppercase -rotate-1"
                    variants={itemVariants}
                >
                    Illuminate Moments, <br /> <span className="text-primary text-stroke-white">Handcrafted Gifts</span>
                </motion.h1>
                <motion.p
                    className="text-2xl md:text-3xl max-w-3xl mx-auto text-white font-bold drop-shadow-[2px_2px_0_rgba(0,0,0,1)] bg-black/50 p-4 rounded-xl border-2 border-white/50 backdrop-blur-sm transform rotate-1"
                    variants={itemVariants}
                >
                    Discover beautifully crafted candles and curated gifts that bring warmth to every occasion.
                </motion.p>
                <motion.div
                    className="flex flex-col sm:flex-row gap-6 justify-center pt-8"
                    variants={containerVariants}
                >
                    <motion.div variants={buttonVariants}>
                        <Button size="lg" asChild className="text-xl px-12 py-8 bg-primary text-white border-4 border-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:scale-105 transition-all">
                            <Link href="/products?category=candles">Shop Candles</Link>
                        </Button>
                    </motion.div>
                    <motion.div variants={buttonVariants}>
                        <Button size="lg" variant="secondary" asChild className="text-xl px-12 py-8 bg-white text-black border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-4px] hover:scale-105 transition-all">
                            <Link href="/products?category=gifts">Explore Gifts</Link>
                        </Button>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
}
