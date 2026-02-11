"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProductShowcaseItem {
    src: string;
    alt: string;
    size: number;
    initialX: number;
    initialY: number;
    rotation: number;
}

const products: ProductShowcaseItem[] = [
    {
        src: 'https://images.unsplash.com/photo-1603905179139-db12ab535ca9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y2FuZGxlc3xlbnwwfHwwfHx8MA%3D%3D',
        alt: 'Lavender Soy Candle',
        size: 200,
        initialX: -100,
        initialY: -50,
        rotation: -15,
    },
    {
        src: 'https://plus.unsplash.com/premium_photo-1663841374379-5d84dd1f3a2e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8Z2lmdHN8ZW58MHx8MHx8fDA%3D',
        alt: 'Premium Gift Box',
        size: 180,
        initialX: 100,
        initialY: 50,
        rotation: 15,
    },
    {
        src: 'https://images.unsplash.com/photo-1570823635306-250abb06d4b3?w=500&auto=format&fit=crop&q=60',
        alt: 'Vanilla Bean Candle',
        size: 160,
        initialX: 0,
        initialY: -80,
        rotation: 5,
    },
];

export default function AnimatedProduct() {
    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {products.map((product, index) => (
                <motion.div
                    key={product.alt}
                    className="absolute"
                    style={{
                        left: '50%',
                        top: '50%',
                        width: product.size,
                        height: product.size,
                    }}
                    initial={{
                        x: product.initialX,
                        y: product.initialY,
                        rotate: product.rotation,
                        opacity: 0,
                        scale: 0.5,
                    }}
                    animate={{
                        x: product.initialX,
                        y: [product.initialY, product.initialY - 20, product.initialY],
                        rotate: [product.rotation, product.rotation + 10, product.rotation],
                        opacity: [0, 0.8, 0.8],
                        scale: [0.5, 1, 1],
                    }}
                    transition={{
                        duration: 4,
                        delay: index * 0.3,
                        repeat: Infinity,
                        repeatType: 'reverse',
                        ease: 'easeInOut',
                    }}
                >
                    <motion.div
                        className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-white shadow-2xl"
                        whileHover={{ scale: 1.1, rotate: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Image
                            src={product.src}
                            alt={product.alt}
                            fill
                            className="object-cover"
                            sizes={`${product.size}px`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    </motion.div>
                </motion.div>
            ))}
        </div>
    );
}
