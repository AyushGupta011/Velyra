"use client";

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import StatsCard from '@/components/admin/StatsCard';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Calendar, TrendingUp, BarChart3, CreditCard,
    Plus, Package, Users, ExternalLink,
    DollarSign, Activity, PieChart, Clock,
    ArrowRight, LayoutGrid
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DashboardData {
    revenue: {
        today: number;
        week: number;
        month: number;
        total: number;
    };
    orders: {
        today: number;
        week: number;
        month: number;
        total: number;
        byStatus: Record<string, number>;
    };
    recentOrders: any[];
    totalUsers: number;
}

export default function AdminDashboard() {
    const { data: session } = useSession();
    const router = useRouter();
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await fetch('/api/admin/dashboard');
            if (response.ok) {
                const result = await response.json();
                setData(result);
            } else {
                console.error('Failed to fetch dashboard data');
            }
        } catch (error) {
            console.error('Error fetching dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="w-16 h-16 border-4 border-black border-t-primary rounded-full animate-spin"></div>
                <div className="text-2xl font-black animate-pulse">Loading Admin Dashboard...</div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="text-6xl">⚠️</div>
                <div className="text-3xl font-black text-red-600">Failed to load dashboard data</div>
                <Button onClick={() => window.location.reload()} className="border-2 border-black">Try Again</Button>
            </div>
        );
    }

    // Mock data for the chart (since we don't have historical data needed for a real chart yet)
    const chartData = [
        { label: 'Mon', value: 40 },
        { label: 'Tue', value: 30 },
        { label: 'Wed', value: 65 },
        { label: 'Thu', value: 45 },
        { label: 'Fri', value: 80 },
        { label: 'Sat', value: 95 },
        { label: 'Sun', value: 70 },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Hero Section */}
            <div className="relative bg-black text-white p-8 rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black mb-2">Dashboard</h1>
                        <p className="text-lg opacity-90">Welcome back, <span className="text-primary font-bold">{session?.user?.name || 'Admin'}</span>! Here's what's happening today.</p>
                    </div>
                    <div className="hidden md:block text-right">
                        <div className="text-sm font-bold opacity-70 uppercase tracking-widest">Current Date</div>
                        <div className="text-2xl font-mono font-bold">{new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <QuickActionButton href="/admin/products" icon={Plus} label="Add Product" color="bg-blue-100" />
                <QuickActionButton href="/admin/orders" icon={Package} label="View Orders" color="bg-green-100" />
                <QuickActionButton href="/admin/users" icon={Users} label="Manage Users" color="bg-purple-100" />
                <QuickActionButton href="/" icon={ExternalLink} label="View Store" color="bg-orange-100" />
            </div>

            {/* Revenue Stats */}
            <div>
                <h2 className="text-2xl font-black mb-4 flex items-center gap-2">
                    <DollarSign className="h-6 w-6" /> Revenue Overview
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatsCard
                        title="Today"
                        value={`₹${data.revenue.today.toFixed(2)}`}
                        subtitle={`${data.orders.today} orders`}
                        icon={Calendar}
                        color="blue"
                        trend={{ value: 12, isPositive: true }}
                    />
                    <StatsCard
                        title="This Week"
                        value={`₹${data.revenue.week.toFixed(2)}`}
                        subtitle={`${data.orders.week} orders`}
                        icon={TrendingUp}
                        color="green"
                        trend={{ value: 5, isPositive: true }}
                    />
                    <StatsCard
                        title="This Month"
                        value={`₹${data.revenue.month.toFixed(2)}`}
                        subtitle={`${data.orders.month} orders`}
                        icon={BarChart3}
                        color="purple"
                    />
                    <StatsCard
                        title="All Time"
                        value={`₹${data.revenue.total.toFixed(2)}`}
                        subtitle={`${data.orders.total} orders`}
                        icon={CreditCard}
                        color="orange"
                    />
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-black flex items-center gap-2">
                            <Activity className="h-5 w-5" /> Weekly Activity
                        </h2>
                        <select className="border-2 border-black rounded-md px-2 py-1 text-sm font-bold bg-transparent">
                            <option>Last 7 Days</option>
                            <option>Last 30 Days</option>
                        </select>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-2">
                        {chartData.map((item, index) => (
                            <div key={index} className="flex flex-col items-center flex-1 group">
                                <div className="w-full bg-secondary/20 rounded-t-lg relative h-full flex items-end group-hover:bg-secondary/30 transition-colors">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${item.value}%` }}
                                        transition={{ duration: 0.5, delay: index * 0.1 }}
                                        className="w-full bg-black rounded-t-md relative"
                                    >
                                        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-2 py-1 rounded whitespace-nowrap transition-opacity pointer-events-none">
                                            {item.value}%
                                        </div>
                                    </motion.div>
                                </div>
                                <div className="mt-2 text-xs font-bold text-muted-foreground uppercase">{item.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Order Statistics By Status */}
                <div className="bg-white p-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                        <PieChart className="h-5 w-5" /> Order Status
                    </h2>
                    <div className="space-y-4">
                        {Object.entries(data.orders.byStatus).map(([status, count]) => (
                            <div key={status} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <OrderStatusBadge status={status as any} />
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-secondary/20 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(count / data.orders.total) * 100}%` }}
                                            className="h-full bg-black"
                                        />
                                    </div>
                                    <span className="font-black w-6 text-right">{count}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-200">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-muted-foreground">Total Orders</span>
                            <span className="text-2xl font-black">{data.orders.total}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatsCard
                    title="Total Users"
                    value={data.totalUsers}
                    icon={Users}
                    color="blue"
                    subtitle="Registered accounts"
                />
                <StatsCard
                    title="Total Inventory"
                    value="156" // Mock for now, add to API later
                    icon={LayoutGrid}
                    color="purple"
                    subtitle="Items across all categories"
                />
            </div>

            {/* Recent Orders */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-black flex items-center gap-2">
                        <Clock className="h-6 w-6" /> Recent Orders
                    </h2>
                    <Link
                        href="/admin/orders"
                        className="px-4 py-2 bg-white text-black font-bold rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px] transition-all flex items-center gap-2"
                    >
                        View All <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
                <div className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                    {/* Mobile Card View */}
                    <div className="md:hidden divide-y-2 divide-gray-100">
                        {data.recentOrders.map((order, index) => (
                            <div key={order.id} className="p-4 space-y-3">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <div className="font-mono font-bold text-primary text-sm">#{order.orderNumber?.slice(0, 8) || order.id.slice(0, 8)}</div>
                                        <div className="font-bold text-sm mt-1">{order.user?.name || 'Guest'}</div>
                                    </div>
                                    <OrderStatusBadge status={order.status} />
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    {order.items.slice(0, 2).map((item: any, i: number) => (
                                        <div key={i}>{item.name} x{item.quantity}</div>
                                    ))}
                                    {order.items.length > 2 && <div className="text-xs font-bold">+ {order.items.length - 2} more</div>}
                                </div>

                                <div className="flex justify-between items-center pt-2">
                                    <div className="font-black">₹{Number(order.total).toFixed(2)}</div>
                                    <div className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <Button asChild size="sm" className="w-full border-2 border-black mt-2">
                                    <Link href={`/admin/orders/${order.id}`}>View Details</Link>
                                </Button>
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-black text-white border-b-4 border-black">
                                <tr>
                                    <th className="px-6 py-4 text-left font-black tracking-wider">Order #</th>
                                    <th className="px-6 py-4 text-left font-black tracking-wider">Customer</th>
                                    <th className="px-6 py-4 text-left font-black tracking-wider">Items</th>
                                    <th className="px-6 py-4 text-left font-black tracking-wider">Total</th>
                                    <th className="px-6 py-4 text-left font-black tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left font-black tracking-wider">Date</th>
                                    <th className="px-6 py-4 text-right font-black tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.recentOrders.map((order, index) => (
                                    <tr
                                        key={order.id}
                                        className={`border-b-2 border-gray-100 hover:bg-yellow-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                                    >
                                        <td className="px-6 py-4 font-mono font-bold text-primary">
                                            #{order.orderNumber?.slice(0, 8) || order.id.slice(0, 8)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold">{order.user?.name || 'Guest'}</div>
                                            <div className="text-xs text-muted-foreground">{order.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium">
                                            {order.items.slice(0, 2).map((item: any, i: number) => (
                                                <div key={i}>{item.name} x{item.quantity}</div>
                                            ))}
                                            {order.items.length > 2 && <div className="text-xs font-bold text-muted-foreground">+{order.items.length - 2} more</div>}
                                        </td>
                                        <td className="px-6 py-4 font-black">₹{Number(order.total).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <OrderStatusBadge status={order.status} />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-muted-foreground">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link href={`/admin/orders/${order.id}`} className="text-sm font-bold underline decoration-2 hover:text-primary">
                                                Details
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

function QuickActionButton({ href, icon: Icon, label, color }: { href: string, icon: any, label: string, color: string }) {
    return (
        <Link href={href}>
            <motion.div
                whileHover={{ scale: 1.02, rotate: 1 }}
                whileTap={{ scale: 0.98 }}
                className={`flex flex-col items-center justify-center p-6 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] cursor-pointer ${color} hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all`}
            >
                <Icon className="h-8 w-8 mb-2" />
                <span className="font-bold">{label}</span>
            </motion.div>
        </Link>
    );
}
