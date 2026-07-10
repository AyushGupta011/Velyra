import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/adminAuth';

// GET /api/admin/orders - Get all orders with filters (admin only)
export async function GET(req: NextRequest) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return NextResponse.json(
                { error: authCheck.error },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(req.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '50');

        // Build where clause
        const where: any = {};
        if (status && status !== 'ALL') {
            where.status = status;
        }
        if (search) {
            where.OR = [
                { orderNumber: { contains: search, mode: 'insensitive' } },
                { user: { email: { contains: search, mode: 'insensitive' } } },
                { user: { name: { contains: search, mode: 'insensitive' } } },
            ];
        }

        const [orders, total] = await Promise.all([
            prisma.order.findMany({
                where,
                include: {
                    items: true,
                    user: {
                        select: {
                            id: true,
                            email: true,
                            name: true,
                        },
                    },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.order.count({ where }),
        ]);

        return NextResponse.json({
            orders,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/orders - Update order status
export async function PATCH(req: NextRequest) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return NextResponse.json(
                { error: authCheck.error },
                { status: 401 }
            );
        }

        const { orderId, status, trackingNumber } = await req.json();

        if (!orderId || !status) {
            return NextResponse.json(
                { error: 'Order ID and status are required' },
                { status: 400 }
            );
        }

        const updateData: any = { status };
        if (trackingNumber) {
            updateData.trackingNumber = trackingNumber;
        }

        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: { items: true }
        });

        if (!existingOrder) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const order = await prisma.order.update({
            where: { id: orderId },
            data: updateData,
            include: {
                items: true,
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        });

        // Deduct stock if a WhatsApp order is marked as PAID or PROCESSING from PENDING
        if (
            existingOrder.paymentId === 'WHATSAPP_PENDING' && 
            existingOrder.status === 'PENDING' && 
            (status === 'PAID' || status === 'PROCESSING')
        ) {
            for (const item of existingOrder.items) {
                if (item.productId) {
                    try {
                        await prisma.product.update({
                            where: { id: item.productId },
                            data: { stock: { decrement: item.quantity } }
                        });
                    } catch (e) {
                        console.error(`Failed to deduct stock for product ${item.productId}`, e);
                    }
                }
            }
        }

        console.log(`✅ Order ${orderId} status updated to ${status}`);

        return NextResponse.json({ success: true, order });
    } catch (error: any) {
        console.error('Error updating order:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
