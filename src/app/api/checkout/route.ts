import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        const { productIds } = await req.json();

        if (!productIds || productIds.length === 0) {
            return new NextResponse("Product IDs are required", { status: 400 });
        }

        const products = await prisma.product.findMany({
            where: {
                id: {
                    in: productIds
                }
            }
        });

        const line_items: any = [];

        products.forEach((product) => {
            line_items.push({
                quantity: 1,
                price_data: {
                    currency: 'INR',
                    product_data: {
                        name: product.name,
                    },
                    unit_amount: Number(product.price) * 100, // Stripe expects amount in paise
                }
            });
        });

        const order = await prisma.order.create({
            data: {
                userId: session?.user?.id || 'guest_user', // Handle guest checkout appropriately in real app
                status: 'PENDING',
                total: products.reduce((total, p) => total + Number(p.price), 0),
                items: {
                    create: products.map((product) => ({
                        product: { connect: { id: product.id } },
                        quantity: 1,
                        price: product.price
                    }))
                }
            }
        });

        const stripeSession = await stripe.checkout.sessions.create({
            line_items,
            mode: 'payment',
            billing_address_collection: 'required',
            phone_number_collection: {
                enabled: true,
            },
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?canceled=1`,
            metadata: {
                orderId: order.id
            }
        });

        return NextResponse.json({ url: stripeSession.url }, {
            headers: corsHeaders
        });
    } catch (error) {
        console.log('[CHECKOUT_POST]', error);
        return new NextResponse("Internal error", { status: 500 });
    }
}
