"use client";

import { motion, Variants } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const features = [
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" /></svg>,
        title: "100% Natural Soy",
        description: "Hand-poured with premium natural soy wax and pure essential oils for a clean burn.",
        bgColor: "bg-primary/20",
        textColor: "text-primary",
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>,
        title: "Handcrafted Gifts",
        description: "Thoughtfully curated gift sets perfect for every special occasion and celebration.",
        bgColor: "bg-secondary/20",
        textColor: "text-secondary",
    },
    {
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>,
        title: "Fast Delivery",
        description: "Carefully packaged and shipped quickly to bring warmth and joy to your doorstep.",
        bgColor: "bg-primary/20",
        textColor: "text-primary",
    },
];

export default function FeaturesSection() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    };

    return (
        <section className="py-24 bg-secondary/10">
            <motion.div
                className="container mx-auto px-4 grid md:grid-cols-3 gap-12 text-center"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                {features.map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        className="p-8 space-y-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl"
                        variants={itemVariants}
                        whileHover={{
                            y: -8,
                            rotate: index % 2 === 0 ? -2 : 2,
                            transition: { duration: 0.3 },
                        }}
                    >
                        <motion.div
                            className={`w-20 h-20 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto ${feature.textColor} border-4 border-black`}
                            whileHover={{ rotate: 360, scale: 1.1 }}
                            transition={{ duration: 0.6 }}
                        >
                            {feature.icon}
                        </motion.div>
                        <h3 className="text-2xl font-black uppercase">{feature.title}</h3>
                        <p className="text-muted-foreground font-medium text-lg">{feature.description}</p>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
