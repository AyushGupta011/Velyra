"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface FeaturedProductsClientProps {
    children: ReactNode;
}

export default function FeaturedProductsClient({ children }: FeaturedProductsClientProps) {
    return (
        <section className="py-24 bg-background border-b-4 border-black relative">
            <motion.div
                className="absolute top-0 right-0 w-32 h-32 bg-secondary/20 rounded-bl-full border-b-4 border-l-4 border-black"
                initial={{ scale: 0, rotate: -45 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "backOut" }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-32 h-32 bg-primary/20 rounded-tr-full border-t-4 border-r-4 border-black"
                initial={{ scale: 0, rotate: 45 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: "backOut" }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <motion.h2
                        className="text-4xl md:text-5xl font-black uppercase tracking-tighter transform -rotate-2 inline-block bg-primary text-white px-8 py-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                        initial={{ opacity: 0, y: -50, rotate: -5 }}
                        whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        whileHover={{ rotate: 2, scale: 1.05 }}
                    >
                        Featured Collections
                    </motion.h2>
                    <motion.p
                        className="text-foreground font-bold text-xl max-w-2xl mx-auto mt-8 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        Handpicked favorites that our customers love. From traditional sweets to modern gift hampers.
                    </motion.p>
                </div>

                {children}

                <motion.div
                    className="text-center mt-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <Button size="lg" variant="default" asChild className="text-lg px-8 py-6">
                        <Link href="/products">View All Products</Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
