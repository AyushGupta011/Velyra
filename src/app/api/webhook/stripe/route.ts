import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    console.log('=== WEBHOOK RECEIVED ===');
    console.log('Event type:', event.type);
    console.log('Session ID:', session.id);

    if (event.type === "checkout.session.completed") {
        console.log('Processing checkout.session.completed event...');
        try {
            // Retrieve the full session with line items
            const fullSession = await stripe.checkout.sessions.retrieve(
                session.id,
                {
                    expand: ['line_items', 'line_items.data.price.product'],
                }
            );

            const lineItems = fullSession.line_items?.data || [];
            const metadata = fullSession.metadata || {};

            // Parse shipping address from metadata or customer details
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

            // Calculate totals
            const subtotal = Number(metadata.subtotal) || (fullSession.amount_subtotal || 0) / 100;
            const shipping = Number(metadata.shipping) || 50;
            const tax = Number(metadata.tax) || 0;
            const total = (fullSession.amount_total || 0) / 100;

            // Find user by metadata ID or email
            let userId = metadata.userId || null;

            if (!userId && session.customer_details?.email) {
                const user = await prisma.user.findUnique({
                    where: { email: session.customer_details.email },
                });
                userId = user?.id || null;
            }

            // Create order with items
            console.log('Creating order with data:', {
                userId,
                total,
                subtotal,
                shipping,
                tax,
                itemCount: lineItems.length
            });

            const order = await prisma.order.create({
                data: {
                    userId,
                    total,
                    subtotal,
                    shipping,
                    tax,
                    status: 'PAID',
                    paymentId: session.payment_intent as string,
                    stripeSessionId: session.id,
                    trackingNumber: `TRK${Date.now()}${Math.random().toString(36).substring(7).toUpperCase()}`,
                    shippingAddress,
                    items: {
                        create: lineItems.map((item: any) => {
                            const product = item.price?.product as Stripe.Product;
                            return {
                                productId: product?.metadata?.productId || null,
                                name: item.description || product?.name || 'Unknown Product',
                                quantity: item.quantity || 1,
                                price: (item.amount_total || 0) / 100 / (item.quantity || 1),
                                image: product?.images?.[0] || null,
                            };
                        }),
                    },
                },
                include: {
                    items: true,
                },
            });

            console.log('✅ Order created successfully!');
            console.log('Order ID:', order.id);
            console.log('Order Number:', order.orderNumber);
            console.log('Total:', order.total);
            console.log('Items:', order.items.length);

            // TODO: Send confirmation email
            // TODO: Update product stock

        } catch (error: any) {
            console.error('Error creating order:', error);
            return new NextResponse(`Order Creation Error: ${error.message}`, { status: 500 });
        }
    }

    return new NextResponse(null, { status: 200 });
}
