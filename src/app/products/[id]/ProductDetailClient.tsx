"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, ArrowLeft, Package, Check } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';

interface ProductDetailClientProps {
    product: {
        id: string;
        name: string;
        description: string;
        price: number;
        category: string;
        image: string | null;
        details: string | null; // Database field might differ, checking schema needed
        features: string[]; // Might need parsing if stored as JSON/String
    };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
    const router = useRouter();
    const addItem = useCartStore((state) => state.addItem);
    const items = useCartStore((state) => state.items);
    const [isAdding, setIsAdding] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const isInCart = items.some((item) => item.id === product.id);

    const handleAddToCart = () => {
        setIsAdding(true);
        addItem({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || '', // Ensure string
            category: product.category
        });

        setTimeout(() => {
            setIsAdding(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        }, 500);
    };

    const handleBuyNow = () => {
        if (!isInCart) {
            handleAddToCart();
        }
        setTimeout(() => {
            router.push('/checkout');
        }, 600);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <Button
                    variant="ghost"
                    className="mb-6 border-2 border-black hover:bg-accent"
                    asChild
                >
                    <Link href="/products">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Products
                    </Link>
                </Button>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12">
                {/* Product Image */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-2 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        <div className="aspect-square bg-secondary/20 flex items-center justify-center">
                            {product.image ? (
                                <motion.img
                                    src={product.image}
                                    alt={product.name}
                                    className="object-cover w-full h-full"
                                    whileHover={{ scale: 1.05 }}
                                    transition={{ duration: 0.3 }}
                                />
                            ) : (
                                <div className="text-center p-8">
                                    <Package className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                                    <span className="text-xl font-bold text-muted-foreground">{product.name}</span>
                                </div>
                            )}
                        </div>
                    </Card>
                </motion.div>

                {/* Product Details */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6"
                >
                    <div>
                        <div className="text-sm font-bold text-primary uppercase tracking-widest mb-2">
                            {product.category}
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black mb-4">{product.name}</h1>
                        <p className="text-3xl font-black text-primary">₹{product.price.toFixed(2)}</p>
                    </div>

                    <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <CardContent className="p-6">
                            <h2 className="text-xl font-black mb-3">Description</h2>
                            <p className="text-muted-foreground mb-4">{product.description}</p>
                            {product.details && <p className="text-sm">{product.details}</p>}
                        </CardContent>
                    </Card>

                    {product.features && product.features.length > 0 && (
                        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <CardContent className="p-6">
                                <h2 className="text-xl font-black mb-4">Key Features</h2>
                                <ul className="space-y-2">
                                    {product.features.map((feature, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="flex items-start gap-3"
                                        >
                                            <Check className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <span>{feature}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                        <motion.div
                            className="flex-1"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                size="lg"
                                className="w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all font-bold text-lg"
                                onClick={handleAddToCart}
                                disabled={isAdding}
                            >
                                {isAdding ? (
                                    'Adding...'
                                ) : showSuccess ? (
                                    <>
                                        <Check className="mr-2 h-5 w-5" />
                                        Added!
                                    </>
                                ) : isInCart ? (
                                    <>
                                        <Check className="mr-2 h-5 w-5" />
                                        In Cart
                                    </>
                                ) : (
                                    <>
                                        <ShoppingCart className="mr-2 h-5 w-5" />
                                        Add to Cart
                                    </>
                                )}
                            </Button>
                        </motion.div>
                        <motion.div
                            className="flex-1"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Button
                                size="lg"
                                variant="outline"
                                className="w-full border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all font-bold text-lg bg-white hover:bg-accent"
                                onClick={handleBuyNow}
                            >
                                Buy Now
                            </Button>
                        </motion.div>
                    </div>

                    {isInCart && !showSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center"
                        >
                            <Button variant="link" asChild>
                                <Link href="/cart" className="text-primary font-bold">
                                    View Cart →
                                </Link>
                            </Button>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
