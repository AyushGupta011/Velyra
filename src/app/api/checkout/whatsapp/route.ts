import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendOrderConfirmation } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { items, shippingAddress, total, subtotal, shipping, tax } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
        }

        let userId = session?.user?.id || null;

        // If no user is logged in, try to find one by email, or leave it null (guest)
        if (!userId && shippingAddress?.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: shippingAddress.email },
            });
            if (existingUser) {
                userId = existingUser.id;
            }
        }

        // Create the order in the database with status PENDING and a dummy paymentId to indicate WhatsApp
        const order = await prisma.order.create({
            data: {
                userId,
                total,
                subtotal,
                shipping,
                tax,
                status: 'PENDING',
                paymentId: 'WHATSAPP_PENDING',
                trackingNumber: `TRK${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`,
                shippingAddress,
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
            include: { items: true },
        });

        // Send email for WhatsApp order request
        if (shippingAddress.email) {
            await sendOrderConfirmation(
                shippingAddress.email,
                order.orderNumber || order.id,
                order.items,
                Number(order.total),
                true // isWhatsApp
            );
        }

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error: any) {
        console.error('Error creating WhatsApp order:', error);
        return NextResponse.json({ error: error.message || 'Failed to create order' }, { status: 500 });
    }
}
