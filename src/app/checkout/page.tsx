"use client";

import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { getSession } from 'next-auth/react';

export default function CheckoutPage() {
    const { items, getTotal, clearCart } = useCartStore();
    const [isProcessing, setIsProcessing] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
    const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'India',
    });

    const total = getTotal();
    const shipping = 50;
    const tax = total * 0.18; // 18% GST
    const grandTotal = total + shipping + tax;

    // Fetch saved addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const session = await getSession();
                if (session?.user?.id) {
                    const res = await fetch('/api/user/addresses');
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setSavedAddresses(data);
                        const defaultAddress = data.find((a: any) => a.isDefault) || data[0];
                        if (defaultAddress) {
                            setSelectedAddressId(defaultAddress.id);
                            setFormData({
                                name: defaultAddress.name,
                                email: defaultAddress.email,
                                address: defaultAddress.address,
                                city: defaultAddress.city,
                                postalCode: defaultAddress.postalCode,
                                country: defaultAddress.country,
                            });
                        }
                    }
                }
            } catch (error) {
                console.error('Failed to fetch addresses:', error);
            } finally {
                setIsLoadingAddresses(false);
            }
        };
        fetchAddresses();
    }, []);

    const handleAddressSelect = (addressId: string) => {
        setSelectedAddressId(addressId);
        if (addressId === 'new') {
            setFormData({
                name: '',
                email: '',
                address: '',
                city: '',
                postalCode: '',
                country: 'India',
            });
        } else {
            const address = savedAddresses.find((a) => a.id === addressId);
            if (address) {
                setFormData({
                    name: address.name,
                    email: address.email,
                    address: address.address,
                    city: address.city,
                    postalCode: address.postalCode,
                    country: address.country,
                });
            }
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckout = async () => {
        if (!formData.name || !formData.email || !formData.address) {
            alert('Please fill in all required fields');
            return;
        }

        setIsProcessing(true);

        try {
            const session = await getSession();

            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    items,
                    shippingAddress: formData,
                    userId: session?.user?.id,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to create checkout session');
            }

            // Redirect directly to Stripe Checkout using the session URL
            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error('No checkout URL returned');
            }
        } catch (error: any) {
            console.error('Checkout error:', error);
            const errorMessage = error.message || 'Something went wrong. Please try again.';
            alert(`Checkout failed: ${errorMessage}\n\nPlease check the console for more details.`);
            setIsProcessing(false);
        }
    };

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <motion.div
                    className="max-w-md mx-auto text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h1 className="text-4xl font-black mb-4">Your cart is empty</h1>
                    <p className="text-muted-foreground mb-8">Add some items to checkout</p>
                    <Button asChild>
                        <Link href="/products">Browse Products</Link>
                    </Button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
            >
                <Link
                    href="/products"
                    className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                </Link>
                <h1 className="text-4xl md:text-5xl font-black mt-4 mb-2">Checkout</h1>
                <p className="text-muted-foreground">Complete your order</p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Shipping Information */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                        <CardHeader>
                            <CardTitle className="text-2xl font-black">Shipping Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">

                            {/* Saved Addresses Section */}
                            {!isLoadingAddresses && savedAddresses.length > 0 && (
                                <div className="space-y-3">
                                    <Label>Select Saved Address</Label>
                                    <div className="grid gap-3">
                                        {savedAddresses.map((addr) => (
                                            <div
                                                key={addr.id}
                                                onClick={() => handleAddressSelect(addr.id)}
                                                className={`p-3 border-2 cursor-pointer rounded-lg transition-all ${selectedAddressId === addr.id
                                                        ? 'border-primary bg-primary/10 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                                        : 'border-muted hover:border-black'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-bold">{addr.name}</p>
                                                        <p className="text-sm">{addr.address}, {addr.city}</p>
                                                        <p className="text-xs text-muted-foreground">{addr.postalCode}, {addr.country}</p>
                                                    </div>
                                                    {addr.isDefault && <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">Default</span>}
                                                </div>
                                            </div>
                                        ))}
                                        <div
                                            onClick={() => handleAddressSelect('new')}
                                            className={`p-3 border-2 border-dashed cursor-pointer rounded-lg text-center ${selectedAddressId === 'new'
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-muted hover:border-black'
                                                }`}
                                        >
                                            <span className="font-bold">+ Add New Address</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4 pt-2">
                                <div>
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        required
                                        className="border-2 border-black"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="email">Email *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                        className="border-2 border-black"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="address">Address *</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        required
                                        className="border-2 border-black"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="border-2 border-black"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="postalCode">Postal Code</Label>
                                        <Input
                                            id="postalCode"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            className="border-2 border-black"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="country">Country</Label>
                                    <Input
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleInputChange}
                                        className="border-2 border-black"
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Order Summary */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sticky top-24">
                        <CardHeader>
                            <CardTitle className="text-2xl font-black">Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Cart Items */}
                            <div className="space-y-3 max-h-64 overflow-y-auto">
                                {items.map((item) => (
                                    <div key={item.id} className="flex justify-between items-center p-3 bg-accent/10 rounded-lg border-2 border-black">
                                        <div className="flex-1">
                                            <p className="font-bold text-sm">{item.name}</p>
                                            <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-black">₹{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t-2 border-black pt-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal:</span>
                                    <span className="font-bold">₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping:</span>
                                    <span className="font-bold">₹{shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Tax (18% GST):</span>
                                    <span className="font-bold">₹{tax.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xl font-black border-t-2 border-black pt-2">
                                    <span>Total:</span>
                                    <span>₹{grandTotal.toFixed(2)}</span>
                                </div>
                            </div>

                            <Button
                                onClick={handleCheckout}
                                disabled={isProcessing}
                                className="w-full text-lg py-6 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all"
                            >
                                {isProcessing ? (
                                    'Processing...'
                                ) : (
                                    <>
                                        <CreditCard className="mr-2 h-5 w-5" />
                                        Proceed to Payment
                                    </>
                                )}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                Secure payment powered by Stripe
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
