"use client";

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestOrderPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { items, clearCart } = useCartStore();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const createTestOrder = async () => {
        if (items.length === 0) {
            alert('Please add items to cart first!');
            return;
        }

        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/admin/create-test-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items: items.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                    })),
                    shippingAddress: {
                        name: session?.user?.name || 'Test User',
                        email: session?.user?.email || 'test@example.com',
                        address: '123 Test Street',
                        city: 'Test City',
                        postalCode: '12345',
                        country: 'India',
                    },
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setResult({ success: true, order: data.order });
                clearCart();
                setTimeout(() => {
                    router.push('/orders');
                }, 2000);
            } else {
                setResult({ success: false, error: data.error });
            }
        } catch (error: any) {
            setResult({ success: false, error: error.message });
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <div className="container mx-auto px-4 py-24 text-center">
                <h1 className="text-4xl font-black mb-4">Please Login</h1>
                <p className="text-muted-foreground">You need to be logged in to create test orders.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24">
            <Card className="max-w-2xl mx-auto border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <CardHeader>
                    <CardTitle className="text-3xl font-black">🧪 Create Test Order</CardTitle>
                    <CardDescription className="text-lg">
                        This is an admin tool to create test orders without going through Stripe payment.
                        Useful for testing the order tracking system.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-secondary/10 p-4 rounded-lg border-2 border-black">
                        <h3 className="font-black mb-2">Current Cart Items:</h3>
                        {items.length === 0 ? (
                            <p className="text-muted-foreground">No items in cart. Add some products first!</p>
                        ) : (
                            <ul className="space-y-2">
                                {items.map((item) => (
                                    <li key={item.id} className="flex justify-between">
                                        <span className="font-medium">{item.name} x {item.quantity}</span>
                                        <span className="font-black">₹{(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <Button
                        onClick={createTestOrder}
                        disabled={loading || items.length === 0}
                        className="w-full h-14 text-lg font-black border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                    >
                        {loading ? 'Creating Order...' : '✨ Create Test Order'}
                    </Button>

                    {result && (
                        <div className={`p-4 rounded-lg border-4 border-black ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
                            {result.success ? (
                                <div>
                                    <h3 className="font-black text-green-800 mb-2">✅ Order Created Successfully!</h3>
                                    <p className="text-green-700">Order ID: {result.order.id}</p>
                                    <p className="text-green-700">Order Number: {result.order.orderNumber}</p>
                                    <p className="text-green-700">Total: ₹{Number(result.order.total).toFixed(2)}</p>
                                    <p className="text-sm text-green-600 mt-2">Redirecting to orders page...</p>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="font-black text-red-800 mb-2">❌ Error</h3>
                                    <p className="text-red-700">{result.error}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="text-sm text-muted-foreground space-y-2">
                        <p><strong>Note:</strong> This creates a test order with:</p>
                        <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Status: PAID</li>
                            <li>Subtotal + 18% GST + ₹50 shipping</li>
                            <li>Test tracking number</li>
                            <li>Default shipping address</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
