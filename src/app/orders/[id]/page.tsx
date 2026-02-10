"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, MapPin, Calendar, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OrderTracking from '@/components/OrderTracking';
import Link from 'next/link';

export default function OrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`/api/orders/${params.id}`);
                const data = await response.json();

                if (response.ok) {
                    setOrder(data.order);
                } else {
                    console.error('Order not found');
                    router.push('/orders');
                }
            } catch (error) {
                console.error('Error fetching order:', error);
                router.push('/orders');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchOrder();
        }
    }, [params.id, router]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <p className="text-xl font-bold">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return null;
    }

    const shippingAddress = order.shippingAddress as any;

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <Link
                    href="/orders"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline mb-4"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Orders
                </Link>
                <h1 className="text-4xl md:text-5xl font-black mb-2">
                    Order #{order.orderNumber ? order.orderNumber.slice(0, 8).toUpperCase() : order.id.slice(0, 8).toUpperCase()}
                </h1>
                <div className="flex items-center gap-4 text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        ₹{Number(order.total).toFixed(2)}
                    </div>
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column - Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <CardHeader className="border-b-2 border-black">
                                <div className="flex items-center gap-3">
                                    <Package className="h-6 w-6 text-primary" />
                                    <CardTitle className="text-2xl font-black">Order Items</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    {order.items.map((item: any) => (
                                        <div
                                            key={item.id}
                                            className="flex gap-4 p-4 bg-accent/10 rounded-lg border-2 border-black"
                                        >
                                            <div className="w-20 h-20 bg-secondary/20 rounded-lg border-2 border-black flex items-center justify-center overflow-hidden">
                                                {item.image ? (
                                                    <img
                                                        src={item.image}
                                                        alt={item.name}
                                                        className="object-cover w-full h-full"
                                                    />
                                                ) : (
                                                    <Package className="h-8 w-8 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-lg">{item.name}</h3>
                                                <p className="text-sm text-muted-foreground">
                                                    Quantity: {item.quantity}
                                                </p>
                                                <p className="text-lg font-black mt-1">
                                                    ₹{Number(item.price).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground">Total</p>
                                                <p className="text-xl font-black">
                                                    ₹{(Number(item.price) * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Summary */}
                                <div className="mt-6 pt-6 border-t-2 border-black space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span className="font-bold">₹{Number(order.subtotal).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping:</span>
                                        <span className="font-bold">₹{Number(order.shipping).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Tax:</span>
                                        <span className="font-bold">₹{Number(order.tax).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-xl font-black border-t-2 border-black pt-2">
                                        <span>Total:</span>
                                        <span>₹{Number(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Shipping Address */}
                    {shippingAddress && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <CardHeader className="border-b-2 border-black">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-6 w-6 text-primary" />
                                        <CardTitle className="text-2xl font-black">Shipping Address</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="space-y-2">
                                        <p className="font-bold text-lg">{shippingAddress.name}</p>
                                        <p>{shippingAddress.email}</p>
                                        <p>{shippingAddress.address}</p>
                                        <p>
                                            {shippingAddress.city}, {shippingAddress.postalCode}
                                        </p>
                                        <p>{shippingAddress.country}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </div>

                {/* Right Column - Order Tracking */}
                <div className="lg:col-span-1">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="sticky top-24"
                    >
                        <OrderTracking
                            status={order.status}
                            trackingNumber={order.trackingNumber}
                            createdAt={order.createdAt}
                        />
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
