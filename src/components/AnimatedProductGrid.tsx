"use client";

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedProductGridProps {
    children: ReactNode;
}

export default function AnimatedProductGrid({ children }: AnimatedProductGridProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.3 }}
        >
            {children}
        </motion.div>
    );
}
