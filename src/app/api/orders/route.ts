import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/orders - Get all orders for the current user
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const orders = await prisma.order.findMany({
            where: { userId: user.id },
            include: {
                items: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ orders });
    } catch (error: any) {
        console.error('Error fetching orders:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/orders - Create a new order (called from webhook)
export async function POST(req: NextRequest) {
    try {
        const { userId, items, total, subtotal, shipping, tax, shippingAddress, stripeSessionId } = await req.json();

        const order = await prisma.order.create({
            data: {
                userId,
                total,
                subtotal,
                shipping,
                tax,
                shippingAddress,
                stripeSessionId,
                status: 'PAID',
                trackingNumber: `TRK${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`,
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        image: item.image,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        return NextResponse.json({ order });
    } catch (error: any) {
        console.error('Error creating order:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
