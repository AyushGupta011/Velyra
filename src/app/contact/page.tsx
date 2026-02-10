import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export const metadata: Metadata = {
    title: 'Contact Us | Candles & Gifts',
    description: 'Get in touch with us for queries about our candles and gift collections.',
};

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">

                <div className="space-y-6">
                    <p className="text-lg">
                        Have a question about our products? Want to place a bulk order?
                        Or just want to say hello? We'd love to hear from you!
                    </p>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">Our Office</h3>
                        <p className="text-muted-foreground">
                            123 Sweet Street, <br />
                            Sugar City, SC 54321, <br />
                            India
                        </p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">Email Us</h3>
                        <p className="text-muted-foreground">support@candlesandgifts.com</p>
                    </div>

                    <div>
                        <h3 className="text-xl font-semibold mb-2">Call Us</h3>
                        <p className="text-muted-foreground">+91 98765 43210</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Send us a message</CardTitle>
                        <CardDescription>Fill out the form below and we'll get back to you soon.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className="space-y-4">
                            <div className="grid gap-2">
                                <label htmlFor="name" className="text-sm font-medium">Name</label>
                                <input
                                    id="name"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="email" className="text-sm font-medium">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="message" className="text-sm font-medium">Message</label>
                                <textarea
                                    id="message"
                                    className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    placeholder="How can we help you?"
                                />
                            </div>
                            <Button type="submit" className="w-full">Send Message</Button>
                        </form>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
