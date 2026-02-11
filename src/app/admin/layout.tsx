"use client";

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LayoutDashboard, Package, ShoppingBag, Users, TestTube, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
            router.push('/'); // Redirect non-admins to home
        }
    }, [status, session, router]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [pathname]);

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-2xl font-black">Loading...</div>
            </div>
        );
    }

    if (!session) {
        return null;
    }

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/orders', label: 'Orders', icon: Package },
        { href: '/admin/products', label: 'Products', icon: ShoppingBag },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/test-order', label: 'Test Order', icon: TestTube },
    ];

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            <div className="p-6 border-b-4 border-black">
                <h1 className="text-2xl font-black">Admin Panel</h1>
                <p className="text-sm text-muted-foreground mt-1 truncate">{session.user?.email}</p>
            </div>
            <nav className="p-4 space-y-2 flex-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all border-2 ${isActive
                                ? 'bg-primary text-primary-foreground border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                                : 'hover:bg-primary/10 border-transparent hover:border-black'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
            <div className="p-4 border-t-4 border-black">
                <Link
                    href="/"
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold bg-secondary text-white border-2 border-black hover:bg-secondary/90 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                    <Home className="h-5 w-5" />
                    <span>Back to Store</span>
                </Link>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-secondary/10">
            {/* Desktop Sidebar */}
            <aside className="hidden md:block w-64 bg-white border-r-4 border-black fixed h-full z-10 overflow-y-auto">
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b-4 border-black z-20 flex items-center justify-between px-4">
                <h1 className="text-xl font-black">Admin Panel</h1>
                <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="border-2 border-black">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-72 border-r-4 border-black">
                        <SidebarContent />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 md:ml-64 mt-16 md:mt-0 transition-all">
                {children}
            </main>
        </div>
    );
}
