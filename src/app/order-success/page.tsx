"use client";

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

function OrderSuccessContent() {
    const searchParams = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const clearCart = useCartStore((state) => state.clearCart);
    const [orderNumber, setOrderNumber] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setOrderNumber(`ORD-${Date.now()}`);
    }, []);

    useEffect(() => {
        const createOrderIfNeeded = async () => {
            if (sessionId) {
                try {
                    // Try to create order if webhook missed it
                    const response = await fetch('/api/orders/create-from-session', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ sessionId }),
                    });

                    const data = await response.json();
                    if (data.order) {
                        setOrderNumber(data.order.orderNumber || data.order.id);
                    }

                    clearCart();
                } catch (error) {
                    console.error('Error verifying order:', error);
                }
            }
        };

        createOrderIfNeeded();
    }, [sessionId, clearCart]);

    if (!mounted) {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-16">
            <motion.div
                className="max-w-2xl mx-auto text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="inline-block mb-6"
                >
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                        <CheckCircle className="h-16 w-16 text-white" />
                    </div>
                </motion.div>

                <motion.h1
                    className="text-4xl md:text-5xl font-black mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    Order Confirmed!
                </motion.h1>

                <motion.p
                    className="text-xl text-muted-foreground mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    Thank you for your purchase. Your order has been successfully placed.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center gap-3 mb-4">
                                <Package className="h-6 w-6 text-primary" />
                                <h2 className="text-2xl font-black">Order Details</h2>
                            </div>
                            <div className="space-y-2 text-left max-w-md mx-auto">
                                <div className="flex justify-between py-2 border-b border-black/10">
                                    <span className="font-bold">Order Number:</span>
                                    <span className="font-mono">{orderNumber}</span>
                                </div>
                                {sessionId && (
                                    <div className="flex justify-between py-2 border-b border-black/10">
                                        <span className="font-bold">Payment ID:</span>
                                        <span className="font-mono text-xs">{sessionId.slice(0, 20)}...</span>
                                    </div>
                                )}
                                <div className="flex justify-between py-2">
                                    <span className="font-bold">Status:</span>
                                    <span className="text-green-600 font-bold">Confirmed</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    className="bg-accent/20 border-2 border-black p-6 rounded-lg mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <h3 className="font-black text-lg mb-2">What's Next?</h3>
                    <p className="text-sm text-muted-foreground">
                        We'll send you an email confirmation shortly. Your order will be processed and shipped within 5-7 business days.
                    </p>
                </motion.div>

                <motion.div
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Button asChild size="lg" className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all">
                        <Link href="/products">
                            Continue Shopping
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="border-2 border-black">
                        <Link href="/">Go to Homepage</Link>
                    </Button>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function OrderSuccessPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="animate-pulse">Loading order details...</div>
            </div>
        }>
            <OrderSuccessContent />
        </Suspense>
    );
}
