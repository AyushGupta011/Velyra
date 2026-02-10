"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import OrderCard from '@/components/OrderCard';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const statusFilters = ['ALL', 'PENDING', 'PROCESSING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

export default function OrdersPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('ALL');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch('/api/orders');
                const data = await response.json();
                setOrders(data.orders || []);
                setFilteredOrders(data.orders || []);
            } catch (error) {
                console.error('Error fetching orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status]);

    useEffect(() => {
        if (selectedFilter === 'ALL') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === selectedFilter));
        }
    }, [selectedFilter, orders]);

    if (status === 'loading' || loading) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <p className="text-xl font-bold">Loading...</p>
                </div>
            </div>
        );
    }

    if (status === 'unauthenticated') {
        return null;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <h1 className="text-4xl md:text-5xl font-black mb-2">My Orders</h1>
                <p className="text-muted-foreground">View and track all your orders</p>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8"
            >
                <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                            <Filter className="h-5 w-5" />
                            <span className="font-bold">Filter by Status:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {statusFilters.map((filter) => (
                                <Button
                                    key={filter}
                                    onClick={() => setSelectedFilter(filter)}
                                    className={`border-2 border-black ${selectedFilter === filter
                                            ? 'bg-primary text-white'
                                            : 'bg-white text-black hover:bg-accent'
                                        }`}
                                >
                                    {filter}
                                </Button>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Orders List */}
            {filteredOrders.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <CardContent className="p-12 text-center">
                            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">
                                {selectedFilter === 'ALL' ? 'No orders yet' : `No ${selectedFilter.toLowerCase()} orders`}
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                {selectedFilter === 'ALL'
                                    ? 'Start shopping to see your orders here!'
                                    : 'Try selecting a different filter'}
                            </p>
                            {selectedFilter === 'ALL' && (
                                <a
                                    href="/products"
                                    className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-lg border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all"
                                >
                                    Browse Products
                                </a>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredOrders.map((order, index) => (
                        <OrderCard key={order.id} order={order} index={index} />
                    ))}
                </div>
            )}
        </div>
    );
}
