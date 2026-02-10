"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Menu, X } from 'lucide-react';
import UserAuth from '@/components/UserAuth';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '@/store/cartStore';
import CartDrawer from '@/components/CartDrawer';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const itemCount = useCartStore((state) => state.getItemCount());

    useEffect(() => {
        setMounted(true);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { href: '/products', label: 'Products' },
        { href: '/orders', label: 'Orders' },
        { href: '/profile', label: 'Profile' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <>
            <motion.nav
                className="border-b-4 border-primary bg-background sticky top-0 z-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-black text-primary uppercase tracking-tighter hover:scale-105 transition-transform">
                        Velyra
                    </Link>

                    {/* Desktop Navigation */}
                    <motion.div
                        className="hidden md:flex items-center space-x-8"
                        initial="hidden"
                        animate="visible"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: { staggerChildren: 0.1, delayChildren: 0.3 }
                            }
                        }}
                    >
                        {navLinks.map((link) => (
                            <motion.div
                                key={link.href}
                                variants={{
                                    hidden: { opacity: 0, y: -10 },
                                    visible: { opacity: 1, y: 0 }
                                }}
                            >
                                <Link
                                    href={link.href}
                                    className="text-lg font-bold hover:text-primary transition-colors hover:underline decoration-4 underline-offset-4"
                                >
                                    {link.label}
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="flex items-center space-x-4">
                        <Button asChild variant="default" size="sm" className="hidden sm:inline-flex border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all">
                            <Link href="/products">Shop Now</Link>
                        </Button>

                        {/* Cart Button */}
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-accent/20 relative"
                                onClick={() => setIsCartOpen(true)}
                            >
                                <ShoppingCart className="h-6 w-6 stroke-[3px]" />
                                {mounted && itemCount > 0 && (
                                    <motion.span
                                        className="absolute -top-1 -right-1 bg-primary text-white text-xs font-black rounded-full h-5 w-5 flex items-center justify-center border-2 border-background"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                                    >
                                        {itemCount}
                                    </motion.span>
                                )}
                            </Button>
                        </motion.div>

                        <UserAuth />

                        {/* Mobile Menu Toggle */}
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMenu}>
                            {isMenuOpen ? <X className="h-6 w-6 stroke-[3px]" /> : <Menu className="h-6 w-6 stroke-[3px]" />}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="md:hidden absolute top-16 left-0 w-full bg-background border-b-4 border-primary z-40 shadow-xl overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                        >
                            <motion.div
                                className="container mx-auto px-4 py-8 flex flex-col space-y-4 items-center"
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
                                    }
                                }}
                                initial="hidden"
                                animate="visible"
                            >
                                {navLinks.map((link) => (
                                    <motion.div
                                        key={link.href}
                                        variants={{
                                            hidden: { opacity: 0, x: -20 },
                                            visible: { opacity: 1, x: 0 }
                                        }}
                                    >
                                        <Link
                                            href={link.href}
                                            className="text-xl font-black uppercase tracking-wider hover:text-primary transition-transform hover:scale-110"
                                            onClick={() => setIsMenuOpen(false)}
                                        >
                                            {link.label}
                                        </Link>
                                    </motion.div>
                                ))}
                                <motion.div
                                    className="pt-4 w-full flex justify-center"
                                    variants={{
                                        hidden: { opacity: 0, y: 20 },
                                        visible: { opacity: 1, y: 0 }
                                    }}
                                >
                                    <Button asChild size="lg" className="w-full max-w-xs border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]" onClick={() => setIsMenuOpen(false)}>
                                        <Link href="/products">Shop All Products</Link>
                                    </Button>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Cart Drawer */}
            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </>
    );
};

export default Navbar;
