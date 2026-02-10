import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/adminAuth';

// GET /api/admin/dashboard - Get dashboard statistics
export async function GET(req: NextRequest) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return NextResponse.json(
                { error: authCheck.error },
                { status: 401 }
            );
        }

        // Get date ranges
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // Get order counts by status
        const ordersByStatus = await prisma.order.groupBy({
            by: ['status'],
            _count: true,
        });

        // Get revenue statistics
        const [todayRevenue, weekRevenue, monthRevenue, totalRevenue] = await Promise.all([
            prisma.order.aggregate({
                where: {
                    createdAt: { gte: todayStart },
                    status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
                },
                _sum: { total: true },
                _count: true,
            }),
            prisma.order.aggregate({
                where: {
                    createdAt: { gte: weekStart },
                    status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
                },
                _sum: { total: true },
                _count: true,
            }),
            prisma.order.aggregate({
                where: {
                    createdAt: { gte: monthStart },
                    status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
                },
                _sum: { total: true },
                _count: true,
            }),
            prisma.order.aggregate({
                where: {
                    status: { in: ['PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'] },
                },
                _sum: { total: true },
                _count: true,
            }),
        ]);

        // Get recent orders
        const recentOrders = await prisma.order.findMany({
            take: 10,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        email: true,
                        name: true,
                    },
                },
                items: {
                    select: {
                        name: true,
                        quantity: true,
                    },
                },
            },
        });

        // Get total users count
        const totalUsers = await prisma.user.count();

        return NextResponse.json({
            revenue: {
                today: Number(todayRevenue._sum.total || 0),
                week: Number(weekRevenue._sum.total || 0),
                month: Number(monthRevenue._sum.total || 0),
                total: Number(totalRevenue._sum.total || 0),
            },
            orders: {
                today: todayRevenue._count,
                week: weekRevenue._count,
                month: monthRevenue._count,
                total: totalRevenue._count,
                byStatus: ordersByStatus.reduce((acc, item) => {
                    acc[item.status] = item._count;
                    return acc;
                }, {} as Record<string, number>),
            },
            recentOrders,
            totalUsers,
        });
    } catch (error: any) {
        console.error('Error fetching dashboard stats:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
