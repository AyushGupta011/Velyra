import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: NextRequest) {
    try {
        const { items, shippingAddress, userId } = await req.json();

        if (!items || items.length === 0) {
            return NextResponse.json(
                { error: 'No items in cart' },
                { status: 400 }
            );
        }

        // Calculate totals
        const subtotal = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
        const shipping = 50;
        const tax = subtotal * 0.18; // 18% GST

        // Create line items for products
        const productLineItems = items.map((item: any) => {
            // Only include images if they are valid absolute URLs
            const images = item.image && (item.image.startsWith('http://') || item.image.startsWith('https://'))
                ? [item.image]
                : [];

            return {
                price_data: {
                    currency: 'inr',
                    product_data: {
                        name: item.name,
                        description: item.category,
                        metadata: {
                            productId: item.id
                        },
                        ...(images.length > 0 && { images }),
                    },
                    unit_amount: Math.round(item.price * 100), // Convert to paise
                },
                quantity: item.quantity,
            };
        });

        // Add GST as a separate line item
        const taxLineItem = {
            price_data: {
                currency: 'inr',
                product_data: {
                    name: 'GST (18%)',
                    description: 'Goods and Services Tax',
                },
                unit_amount: Math.round(tax * 100), // Convert to paise
            },
            quantity: 1,
        };

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [...productLineItems, taxLineItem],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/checkout`,
            metadata: {
                shippingAddress: JSON.stringify(shippingAddress),
                subtotal: subtotal.toString(),
                shipping: shipping.toString(),
                tax: tax.toString(),
                userId: userId || '',
            },
            shipping_options: [
                {
                    shipping_rate_data: {
                        type: 'fixed_amount',
                        fixed_amount: {
                            amount: 5000, // ₹50 in paise
                            currency: 'inr',
                        },
                        display_name: 'Standard Shipping',
                        delivery_estimate: {
                            minimum: {
                                unit: 'business_day',
                                value: 5,
                            },
                            maximum: {
                                unit: 'business_day',
                                value: 7,
                            },
                        },
                    },
                },
            ],
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe session creation error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal server error' },
            { status: 500 }
        );
    }
}
