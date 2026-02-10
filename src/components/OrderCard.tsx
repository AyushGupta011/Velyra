"use client";

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Package, Calendar, CreditCard } from 'lucide-react';
import Link from 'next/link';

interface OrderCardProps {
    order: {
        id: string;
        orderNumber: string;
        total: number;
        status: string;
        createdAt: Date;
        items: Array<{
            name: string;
            quantity: number;
        }>;
    };
    index?: number;
}

const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-500',
    PROCESSING: 'bg-blue-500',
    PAID: 'bg-green-500',
    SHIPPED: 'bg-purple-500',
    DELIVERED: 'bg-green-600',
    CANCELLED: 'bg-red-500',
};

export default function OrderCard({ order, index = 0 }: OrderCardProps) {
    const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all">
                <CardHeader className="border-b-2 border-black">
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="text-xl font-black mb-1">
                                Order #{order.orderNumber ? order.orderNumber.slice(0, 8).toUpperCase() : order.id.slice(0, 8).toUpperCase()}
                            </CardTitle>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                {new Date(order.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <span className={`${statusColors[order.status] || 'bg-gray-500'} text-white px-3 py-1 rounded-full text-xs font-bold border-2 border-black`}>
                            {order.status}
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Package className="h-5 w-5 text-primary" />
                            <span className="font-bold">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-5 w-5 text-primary" />
                            <span className="text-2xl font-black">₹{Number(order.total).toFixed(2)}</span>
                        </div>
                        <Button asChild className="w-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all">
                            <Link href={`/orders/${order.id}`}>View Details</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
