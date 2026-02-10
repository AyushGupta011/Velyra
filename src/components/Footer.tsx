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
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Connect</h4>
                        <div className="flex space-x-4">
                            {/* Add social icons here */}
                            <a href="#" className="text-muted-foreground hover:text-primary">Twitter</a>
                            <a href="#" className="text-muted-foreground hover:text-primary">Instagram</a>
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
