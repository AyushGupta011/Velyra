import React from 'react';

export default function TermsPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-4xl">
            <div className="bg-white border-4 border-black p-8 md:p-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg">
                <h1 className="text-4xl md:text-5xl font-black mb-8 uppercase tracking-tight">Terms of Service</h1>
                
                <div className="space-y-8 text-gray-800 leading-relaxed text-lg">
                    <section>
                        <h2 className="text-2xl font-black mb-3 text-black">1. Acceptance of Terms</h2>
                        <p>
                            By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. 
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3 text-black">2. Products and Pricing</h2>
                        <p>
                            We reserve the right to modify or discontinue any product without notice. We are not liable to you or any third party for any modification, price change, suspension, or discontinuance of the product.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3 text-black">3. WhatsApp Ordering</h2>
                        <p>
                            When using the "Order via WhatsApp" feature, your order is considered <strong>Pending</strong> until payment is manually verified by our team. We reserve the right to cancel unverified WhatsApp orders after 48 hours.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-black mb-3 text-black">4. Contact Information</h2>
                        <p>
                            Questions about the Terms of Service should be sent to us at:
                            <br />
                            <strong>Email:</strong> support@velyra.com
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
