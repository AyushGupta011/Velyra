"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, RefreshCw, Download, Search } from 'lucide-react';

export default function AdminOrdersPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 20,
        totalPages: 1,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set('page', pagination.page.toString());
            params.set('limit', pagination.limit.toString());
            if (statusFilter !== 'ALL') params.set('status', statusFilter);
            if (searchTerm) params.set('search', searchTerm);

            const response = await fetch(`/api/admin/orders?${params.toString()}`);
            if (response.ok) {
                const data = await response.json();
                setOrders(data.orders);
                setPagination(data.pagination);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, statusFilter, searchTerm]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]); // Depends on stable fetchOrders

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, page: 1 }));
        // Effect will trigger fetch
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-4xl font-black">📦 Orders</h1>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        onClick={() => fetchOrders()}
                        className="border-2 border-black hover:bg-secondary/10"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" /> Refresh
                    </Button>
                    <Button className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                        <Download className="mr-2 h-4 w-4" /> Export CSV
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-6 items-end">
                <div className="w-full md:w-1/3">
                    <label className="text-sm font-bold mb-2 block uppercase tracking-wide">Search</label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Order #, Name, Email"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                className="pl-9 border-2 border-black"
                            />
                        </div>
                        <Button onClick={handleSearch} className="border-2 border-black px-4">Go</Button>
                    </div>
                </div>
                <div className="w-full md:w-1/4">
                    <label className="text-sm font-bold mb-2 block uppercase tracking-wide">Status</label>
                    <select
                        className="w-full h-10 px-3 rounded-md border-2 border-black bg-background focus:ring-2 focus:ring-primary"
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPagination(prev => ({ ...prev, page: 1 }));
                        }}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="PAID">Paid</option>
                        <option value="PROCESSING">Processing</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-secondary/10 border-b-4 border-black">
                            <tr>
                                <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-sm">Order #</th>
                                <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-sm">Date</th>
                                <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-sm">Customer</th>
                                <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-sm">Status</th>
                                <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-sm">Items</th>
                                <th className="px-6 py-4 text-left font-black uppercase tracking-wider text-sm">Total</th>
                                <th className="px-6 py-4 text-right font-black uppercase tracking-wider text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                            className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"
                                        />
                                        <p className="text-xl font-bold">Loading orders...</p>
                                    </td>
                                </tr>
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center">
                                        <div className="text-4xl mb-4">🔍</div>
                                        <p className="text-xl font-bold text-muted-foreground">No orders found matching your criteria.</p>
                                        <Button
                                            variant="link"
                                            onClick={() => {
                                                setSearchTerm('');
                                                setStatusFilter('ALL');
                                            }}
                                            className="mt-2 text-primary font-bold"
                                        >
                                            Clear Filters
                                        </Button>
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order, index) => (
                                    <motion.tr
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className={`border-b-2 border-black hover:bg-secondary/5 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-secondary/5'}`}
                                    >
                                        <td className="px-6 py-4 font-mono font-bold text-primary">
                                            #{order.orderNumber?.slice(0, 8) || order.id.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                            <div className="text-xs opacity-70">{new Date(order.createdAt).toLocaleTimeString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold">{order.user?.name || 'Guest'}</div>
                                            <div className="text-sm text-muted-foreground">{order.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <OrderStatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {order.items.length} items
                                        </td>
                                        <td className="px-6 py-4 font-black text-lg">
                                            ₹{Number(order.total).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Button asChild size="sm" className="border-2 border-black hover:bg-secondary hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                                                <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-4 border-t-4 border-black bg-secondary/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm font-bold text-muted-foreground">
                        Showing {orders.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0} - {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} orders
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            disabled={pagination.page <= 1}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            className="border-2 border-black bg-white hover:bg-secondary/10"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                        </Button>
                        <div className="flex items-center justify-center px-4 font-black bg-white border-2 border-black rounded-md">
                            Page {pagination.page} of {pagination.totalPages}
                        </div>
                        <Button
                            variant="outline"
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            className="border-2 border-black bg-white hover:bg-secondary/10"
                        >
                            Next <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
