import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// POST /api/admin/create-test-order - Create a test order (admin only)
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user from database
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const { items, shippingAddress } = await req.json();

        // Calculate totals
        const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const shipping = 50;
        const tax = subtotal * 0.18; // 18% GST
        const total = subtotal + shipping + tax;

        // Create test order
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                total,
                subtotal,
                shipping,
                tax,
                status: 'PAID',
                paymentId: `test_${Date.now()}`,
                trackingNumber: `TRK${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`,
                shippingAddress: shippingAddress || {
                    name: user.name || 'Test User',
                    email: user.email,
                    address: '123 Test Street',
                    city: 'Test City',
                    postalCode: '12345',
                    country: 'India',
                },
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        image: item.image || null,
                    })),
                },
            },
            include: {
                items: true,
            },
        });

        console.log('✅ Test order created:', order.id);

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                orderNumber: order.orderNumber,
                total: order.total,
            }
        });
    } catch (error: any) {
        console.error('Error creating test order:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
