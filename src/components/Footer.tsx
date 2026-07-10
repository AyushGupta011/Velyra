import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-muted py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">Candles & Gifts</h3>
                        <p className="text-sm text-muted-foreground">
                            Handcrafted candles and curated gifts for every occasion.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Shop</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/products?category=candles" className="hover:underline">Candles</Link></li>
                            <li><Link href="/products?category=gifts" className="hover:underline">Gifts</Link></li>
                            <li><Link href="/products?category=combos" className="hover:underline">Combos</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/about" className="hover:underline">About Us</Link></li>
                            <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                            <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
                            <li><Link href="/terms" className="hover:underline">Terms of Service</Link></li>
                            <li><Link href="/refund" className="hover:underline">Refund Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="https://wa.me/919336837889" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-green-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>
                                </svg>
                                <span className="sr-only">WhatsApp</span>
                            </a>
                            <a href="#" className="text-muted-foreground hover:text-pink-500 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                                </svg>
                                <span className="sr-only">Instagram</span>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} Candles & Gifts. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
