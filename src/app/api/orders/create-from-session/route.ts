import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const { sessionId } = await req.json();

        if (!sessionId) {
            return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
        }

        // Check if order already exists
        const existingOrder = await prisma.order.findUnique({
            where: { stripeSessionId: sessionId },
        });

        if (existingOrder) {
            return NextResponse.json({ order: existingOrder, message: 'Order already exists' });
        }

        // Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId, {
            expand: ['line_items', 'line_items.data.price.product'],
        });

        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        const lineItems = session.line_items?.data || [];
        const metadata = session.metadata || {};

        // Calculate totals
        const total = (session.amount_total || 0) / 100;
        const subtotal = Number(metadata.subtotal) || total;
        const shipping = Number(metadata.shipping) || 0;
        const tax = Number(metadata.tax) || 0;

        // Parse shipping address
        const shippingAddress = metadata.shippingAddress
            ? JSON.parse(metadata.shippingAddress)
            : {
                name: session.customer_details?.name || '',
                email: session.customer_details?.email || '',
                address: session.customer_details?.address?.line1 || '',
                city: session.customer_details?.address?.city || '',
                postalCode: session.customer_details?.address?.postal_code || '',
                country: session.customer_details?.address?.country || '',
            };

        // Find user
        let userId = metadata.userId || null;
        if (!userId && session.customer_details?.email) {
            const user = await prisma.user.findUnique({
                where: { email: session.customer_details.email },
            });
            userId = user?.id || null;
        }

        // Create order
        const order = await prisma.order.create({
            data: {
                userId,
                total,
                subtotal,
                shipping,
                tax,
                status: 'PAID',
                paymentId: session.payment_intent as string,
                stripeSessionId: sessionId,
                trackingNumber: `TRK${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`,
                shippingAddress,
                items: {
                    create: lineItems.map((item: any) => {
                        const product = item.price?.product;
                        return {
                            productId: product?.metadata?.productId || null,
                            name: product?.name || 'Unknown Product',
                            quantity: item.quantity || 1,
                            price: (item.amount_total || 0) / 100 / (item.quantity || 1),
                            image: product?.images?.[0] || null,
                        };
                    }),
                },
            },
        });

        return NextResponse.json({ order, message: 'Order created successfully' });

    } catch (error: any) {
        console.error('Error creating order from session:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
