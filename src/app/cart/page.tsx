'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { useCartStore } from '@/store/cartStore';
import { Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

function CartContent() {
    const router = useRouter();
    const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore();
    const total = getTotal();

    const handleCheckout = () => {
        if (items.length === 0) {
            alert('Your cart is empty');
            return;
        }
        router.push('/checkout');
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl md:text-5xl font-black mb-2">Shopping Cart</h1>
                <p className="text-muted-foreground">Review your items before checkout</p>
            </motion.div>

            {items.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16"
                >
                    <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                    <p className="text-muted-foreground mb-8">Add some items to get started!</p>
                    <Button asChild className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <Link href="/products">Browse Products</Link>
                    </Button>
                </motion.div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            <div className="w-20 h-20 bg-secondary/20 rounded-lg border-2 border-black flex items-center justify-center">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="object-cover w-full h-full rounded-lg" />
                                                ) : (
                                                    <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground">{item.category}</p>
                                                <p className="text-xl font-black mt-2">₹{item.price.toFixed(2)}</p>
                                            </div>
                                            <div className="flex flex-col items-end justify-between">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeItem(item.id)}
                                                    className="hover:bg-red-100 hover:text-red-600"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </Button>
                                                <div className="flex items-center gap-2 border-2 border-black rounded-lg">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="h-8 w-8 p-0"
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-24">
                            <CardHeader className="border-b-2 border-black">
                                <CardTitle className="text-2xl font-black">Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between">
                                        <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                                        <span className="font-bold">₹{total.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-muted-foreground">
                                        <span>Shipping</span>
                                        <span>Calculated at checkout</span>
                                    </div>
                                </div>
                                <div className="flex justify-between text-xl font-black border-t-2 border-black pt-4">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 pt-0 flex flex-col gap-3">
                                <Button
                                    className="w-full text-lg py-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all"
                                    onClick={handleCheckout}
                                >
                                    Proceed to Checkout
                                </Button>
                                <Button
                                    variant="outline"
                                    className="w-full border-2 border-black"
                                    asChild
                                >
                                    <Link href="/products">Continue Shopping</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            )}
        </div>
    );
}

export default function CartPage() {
    return (
        <Suspense fallback={<div>Loading cart...</div>}>
            <CartContent />
        </Suspense>
    );
}
