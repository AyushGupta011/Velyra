"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Save, MapPin, CreditCard, Box, Calendar } from 'lucide-react';
import Link from 'next/link';
import { OrderStatus } from '@prisma/client';

export default function AdminOrderDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [newStatus, setNewStatus] = useState<OrderStatus>('PENDING');

    useEffect(() => {
        if (params.id) {
            fetchOrder();
        }
    }, [params.id]);

    const fetchOrder = async () => {
        try {
            const response = await fetch(`/api/admin/orders/${params.id}`);

            if (response.ok) {
                const data = await response.json();
                setOrder(data.order);
                setNewStatus(data.order.status);
            } else {
                const errorText = await response.text();
                console.error(`Order fetch failed: ${response.status} ${response.statusText}`, errorText);
                setOrder(null);
            }
        } catch (error) {
            console.error('Error fetching order:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async () => {
        setUpdating(true);
        try {
            const response = await fetch('/api/admin/orders', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    orderId: order.id,
                    status: newStatus,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setOrder(data.order);
                alert('Status updated successfully!');
            } else {
                alert('Failed to update status');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <h1 className="text-2xl font-bold mb-4">Order not found</h1>
                <Button asChild>
                    <Link href="/admin/orders">Back to Orders</Link>
                </Button>
            </div>
        );
    }

    const shippingAddress = order.shippingAddress ? (typeof order.shippingAddress === 'string' ? JSON.parse(order.shippingAddress) : order.shippingAddress) : {};

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-4">
                    <Button asChild variant="outline" size="icon" className="border-2 border-black rounded-full h-10 w-10">
                        <Link href="/admin/orders">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-3xl font-black">Order #{order.orderNumber?.slice(0, 8) || order.id.slice(0, 8)}</h1>
                            <OrderStatusBadge status={order.status} />
                        </div>
                        <p className="text-muted-foreground flex items-center gap-2 mt-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(order.createdAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 bg-white p-2 rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <span className="font-bold ml-2">Status:</span>
                    <select
                        className="h-10 px-3 py-1 rounded-md border-2 border-black bg-background font-medium"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                    >
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                    <Button
                        onClick={updateStatus}
                        disabled={updating || newStatus === order.status}
                        className="border-2 border-black"
                    >
                        {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        {updating ? 'Saving...' : 'Update'}
                    </Button>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Main Content - 2 Cols */}
                <div className="md:col-span-2 space-y-6">
                    {/* Items */}
                    <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                        <CardHeader className="border-b-2 border-black bg-secondary/10">
                            <CardTitle className="flex items-center gap-2">
                                <Box className="h-5 w-5" />
                                Order Items
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            <table className="w-full min-w-[600px]">
                                <thead className="bg-muted/30">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-bold text-sm">Product</th>
                                        <th className="px-6 py-3 text-right font-bold text-sm">Price</th>
                                        <th className="px-6 py-3 text-right font-bold text-sm">Qty</th>
                                        <th className="px-6 py-3 text-right font-bold text-sm">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {order.items.map((item: any) => (
                                        <tr key={item.id}>
                                            <td className="px-6 py-4">
                                                <div className="font-bold">{item.name}</div>
                                                <div className="text-xs text-muted-foreground">ID: {item.productId}</div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono">₹{Number(item.price).toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right">{item.quantity}</td>
                                            <td className="px-6 py-4 text-right font-mono font-bold">
                                                ₹{(Number(item.price) * item.quantity).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot className="bg-primary/5">
                                    <tr>
                                        <td colSpan={3} className="px-6 py-3 text-right font-medium">Subtotal</td>
                                        <td className="px-6 py-3 text-right font-mono">₹{Number(order.subtotal).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} className="px-6 py-3 text-right font-medium">Tax (18%)</td>
                                        <td className="px-6 py-3 text-right font-mono">₹{Number(order.tax).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3} className="px-6 py-3 text-right font-medium">Shipping</td>
                                        <td className="px-6 py-3 text-right font-mono">₹{Number(order.shipping).toFixed(2)}</td>
                                    </tr>
                                    <tr className="border-t-2 border-black">
                                        <td colSpan={3} className="px-6 py-4 text-right font-black text-lg">Total</td>
                                        <td className="px-6 py-4 text-right font-mono font-black text-lg text-primary">
                                            ₹{Number(order.total).toFixed(2)}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar - 1 Col */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <CardHeader className="border-b-2 border-black bg-secondary/10 py-3">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Shipping Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-1">
                            <p className="font-bold text-lg">{shippingAddress.name || order.user?.name}</p>
                            <p>{shippingAddress.email || order.user?.email}</p>
                            <div className="my-2 h-px bg-gray-200" />
                            <p>{shippingAddress.address}</p>
                            <p>{shippingAddress.city} {shippingAddress.postalCode}</p>
                            <p>{shippingAddress.country}</p>
                        </CardContent>
                    </Card>

                    {/* Payment Info */}
                    <Card className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <CardHeader className="border-b-2 border-black bg-secondary/10 py-3">
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Info
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 space-y-2">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Payment ID:</span>
                                <span className="font-mono text-xs">{order.paymentId || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Gateway:</span>
                                <span className="font-bold">Stripe</span>
                            </div>
                            {order.trackingNumber && (
                                <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
                                    <p className="text-sm text-muted-foreground mb-1">Tracking Number:</p>
                                    <p className="font-mono font-bold text-primary">{order.trackingNumber}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
