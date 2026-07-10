import React from 'react';

export default function RefundPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg">
                <h1 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tight">Refund & Return Policy</h1>
                
                <div className="space-y-8 text-gray-800 leading-relaxed text-lg">
                    <section>
                        <h2 className="text-2xl font-black mb-3 text-black">1. Return Window</h2>
                        <p>
                            We offer a 14-day return policy for unused items in their original packaging. Since candles are consumable and sensitive to heat, we cannot accept returns on candles that have been lit, melted, or damaged after delivery.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3 text-black">2. Damaged Items</h2>
                        <p>
                            If your item arrives damaged, please contact us within 48 hours of delivery with photographic evidence. We will issue a replacement or full refund immediately.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3 text-black">3. How to Request a Refund</h2>
                        <p>
                            To initiate a return, please reply to your Order Confirmation email or message us on WhatsApp with your Order Reference ID.
                        </p>
                    </section>

                    <p className="text-sm font-bold text-gray-500 mt-12 pt-4 border-t-2 border-black/20">
                        Last updated: {new Date().toLocaleDateString()}
                    </p>
                </div>
            </div>
        </div>
    );
}
