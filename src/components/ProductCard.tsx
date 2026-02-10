"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useState } from 'react';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    description: string;
    image?: string;
    category: string;
    index?: number;
}

const ProductCard = ({ id, name, price, description, image, category, index = 0 }: ProductCardProps) => {
    const addItem = useCartStore((state) => state.addItem);
    const items = useCartStore((state) => state.items);
    const [isAdding, setIsAdding] = useState(false);

    const isInCart = items.some((item) => item.id === id);

    const handleAddToCart = () => {
        setIsAdding(true);
        addItem({ id, name, price, image, category });

        setTimeout(() => {
            setIsAdding(false);
        }, 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
        >
            <Card className="flex flex-col h-full overflow-hidden transition-all border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl">
                <motion.div
                    className="relative aspect-square w-full bg-secondary/20 flex items-center justify-center text-muted-foreground border-b-2 border-black overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Placeholder for image */}
                    {image ? (
                        <motion.img
                            src={image}
                            alt={name}
                            className="object-cover w-full h-full"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                        />
                    ) : (
                        <span>No Image</span>
                    )}
                </motion.div>
                <CardHeader className="p-4">
                    <div className="text-xs font-bold text-primary uppercase tracking-widest mb-1">{category}</div>
                    <CardTitle className="text-lg line-clamp-1 font-black">{name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 flex-grow">
                    <p className="text-sm font-medium text-muted-foreground line-clamp-2">
                        {description}
                    </p>
                    <p className="mt-4 text-2xl font-black text-foreground">
                        ₹{price.toFixed(2)}
                    </p>
                </CardContent>
                <CardFooter className="p-4 border-t-2 border-black gap-2 bg-accent/5">
                    <Button asChild className="flex-1 font-bold" variant="outline">
                        <Link href={`/products/${id}`}>View Details</Link>
                    </Button>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button
                            size="icon"
                            onClick={handleAddToCart}
                            disabled={isAdding}
                            className={`${isInCart ? 'bg-green-600 hover:bg-green-700' : 'bg-primary'} text-white`}
                            title={isInCart ? 'In cart' : 'Add to cart'}
                        >
                            <motion.div
                                animate={isAdding ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                                transition={{ duration: 0.5 }}
                            >
                                <ShoppingCart className="h-5 w-5" />
                            </motion.div>
                        </Button>
                    </motion.div>
                </CardFooter>
            </Card>
        </motion.div>
    );
};

export default ProductCard;
