"use client";

import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
    const { items, removeItem, updateQuantity, getTotal, getItemCount } = useCartStore();

    const total = getTotal();
    const itemCount = getItemCount();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-40"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    {/* Drawer */}
                    <motion.div
                        className="fixed right-0 top-0 h-full w-full sm:w-96 bg-background border-l-4 border-black shadow-2xl z-50 flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        {/* Header */}
                        <div className="p-6 border-b-4 border-black bg-primary text-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <ShoppingBag className="h-6 w-6" />
                                    <h2 className="text-2xl font-black uppercase">Your Cart</h2>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={onClose}
                                    className="text-white hover:bg-white/20"
                                >
                                    <X className="h-6 w-6" />
                                </Button>
                            </div>
                            <p className="mt-2 text-sm font-bold">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
                        </div>

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8">
                                    <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
                                    <h3 className="text-xl font-bold mb-2">Your cart is empty</h3>
                                    <p className="text-muted-foreground mb-6">Add some items to get started!</p>
                                    <Button onClick={onClose} asChild>
                                        <Link href="/products">Browse Products</Link>
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            className="bg-white border-2 border-black p-4 rounded-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                                            layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 bg-secondary/20 rounded-lg border-2 border-black flex items-center justify-center overflow-hidden">
                                                    {item.image ? (
                                                        <Image
                                                            src={item.image}
                                                            alt={item.name}
                                                            width={80}
                                                            height={80}
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">No Image</span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-sm line-clamp-2">{item.name}</h3>
                                                    <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
                                                    <p className="text-lg font-black mt-1">₹{item.price.toFixed(2)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between mt-4">
                                                <div className="flex items-center gap-2 border-2 border-black rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-2 hover:bg-secondary/20 transition-colors"
                                                    >
                                                        <Minus className="h-4 w-4" />
                                                    </button>
                                                    <span className="px-4 font-bold">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-2 hover:bg-secondary/20 transition-colors"
                                                    >
                                                        <Plus className="h-4 w-4" />
                                                    </button>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    Remove
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t-4 border-black bg-accent/10">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-lg font-bold">Total:</span>
                                    <span className="text-2xl font-black">₹{total.toFixed(2)}</span>
                                </div>
                                <Button
                                    className="w-full text-lg py-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all"
                                    asChild
                                    onClick={onClose}
                                >
                                    <Link href="/checkout">Proceed to Checkout</Link>
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
