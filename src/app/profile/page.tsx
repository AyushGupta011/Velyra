'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, MapPin, Plus, Trash2, User, Edit2, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Order {
    id: string;
    total: number;
    status: string;
    createdAt: string;
    items: {
        name: string;
        quantity: number;
        price: number;
    }[];
}

interface Address {
    id: string;
    name: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
}

interface UserProfile {
    name: string;
    email: string;
    role: string;
}

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);

    // Address form state
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'India',
    });

    // Profile edit state
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [editedName, setEditedName] = useState('');

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        } else if (session?.user) {
            fetchData();
        }
    }, [session, status, router]);

    const fetchData = async () => {
        try {
            const [userRes, ordersRes, addressesRes] = await Promise.all([
                fetch('/api/user'),
                fetch('/api/user/orders'),
                fetch('/api/user/addresses')
            ]);

            if (userRes.ok) {
                const userData = await userRes.json();
                setUser(userData);
                setEditedName(userData.name || '');
            }
            if (ordersRes.ok) {
                const ordersData = await ordersRes.json();
                setOrders(ordersData);
            }
            if (addressesRes.ok) {
                const addressesData = await addressesRes.json();
                setAddresses(addressesData);
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async () => {
        try {
            const res = await fetch('/api/user', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: editedName }),
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUser(prev => prev ? { ...prev, name: updatedUser.name } : null);
                setIsEditingProfile(false);
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
        }
    };

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/user/addresses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newAddress, isDefault: addresses.length === 0 }),
            });

            if (res.ok) {
                const savedAddress = await res.json();
                setAddresses([...addresses, savedAddress]);
                setShowAddressForm(false);
                setNewAddress({
                    name: '',
                    email: '',
                    address: '',
                    city: '',
                    postalCode: '',
                    country: 'India',
                });
            }
        } catch (error) {
            console.error('Failed to add address:', error);
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;
        try {
            const res = await fetch(`/api/user/addresses/${id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setAddresses(addresses.filter(a => a.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete address:', error);
        }
    };

    if (status === 'loading' || loading) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-4xl font-black mb-2">My Profile</h1>
            <p className="text-muted-foreground mb-8">Manage your personal details, orders, and addresses</p>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    {/* Personal Information Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <User className="h-6 w-6" /> Personal Information
                            </h2>
                            {!isEditingProfile ? (
                                <Button onClick={() => setIsEditingProfile(true)} size="sm" variant="ghost" className="text-muted-foreground hover:text-foreground">
                                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                                </Button>
                            ) : (
                                <div className="flex gap-2">
                                    <Button onClick={() => setIsEditingProfile(false)} size="sm" variant="ghost">Cancel</Button>
                                    <Button onClick={handleUpdateProfile} size="sm" className="bg-primary text-primary-foreground">Save</Button>
                                </div>
                            )}
                        </div>

                        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <CardContent className="p-6 space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="profile-name">Full Name</Label>
                                    {isEditingProfile ? (
                                        <Input
                                            id="profile-name"
                                            value={editedName}
                                            onChange={(e) => setEditedName(e.target.value)}
                                            className="border-2 border-black"
                                        />
                                    ) : (
                                        <div className="text-lg font-medium">{user?.name || 'Not set'}</div>
                                    )}
                                </div>
                                <div className="grid gap-2">
                                    <Label>Email Address</Label>
                                    <div className="text-lg font-medium text-muted-foreground">{user?.email}</div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Orders Section */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Package className="h-6 w-6" /> Order History
                        </h2>
                        {orders.length === 0 ? (
                            <Card className="border-2 border-dashed border-muted">
                                <CardContent className="p-8 text-center text-muted-foreground">
                                    No orders yet
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <Card key={order.id} className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] transition-all">
                                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                                            <div className="space-y-1">
                                                <CardTitle className="text-lg">Order #{order.id.slice(-6)}</CardTitle>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-lg">₹{Number(order.total).toFixed(2)}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full text-white font-bold ${order.status === 'DELIVERED' ? 'bg-green-500' :
                                                    order.status === 'SHIPPED' ? 'bg-blue-500' :
                                                        order.status === 'PROCESSING' ? 'bg-yellow-500' :
                                                            'bg-gray-500'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground mb-4">
                                                {order.items.length} items: {order.items.map(i => i.name).join(', ')}
                                            </p>
                                            <Button asChild variant="outline" size="sm" className="w-full border-2 border-black hover:bg-accent font-bold">
                                                <Link href={`/orders/${order.id}`}>View Details</Link>
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Addresses Section */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <MapPin className="h-6 w-6" /> Saved Addresses
                        </h2>
                        {!showAddressForm && (
                            <Button onClick={() => setShowAddressForm(true)} size="sm" className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                <Plus className="h-4 w-4 mr-2" /> Add New
                            </Button>
                        )}
                    </div>

                    {showAddressForm && (
                        <Card className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            <CardHeader>
                                <CardTitle>Add New Address</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleAddAddress} className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={newAddress.name}
                                            onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                            required
                                            className="border-2 border-black"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            value={newAddress.email}
                                            onChange={(e) => setNewAddress({ ...newAddress, email: e.target.value })}
                                            required
                                            className="border-2 border-black"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input
                                            id="address"
                                            value={newAddress.address}
                                            onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                            required
                                            className="border-2 border-black"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label htmlFor="city">City</Label>
                                            <Input
                                                id="city"
                                                value={newAddress.city}
                                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                                required
                                                className="border-2 border-black"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="postalCode">Postal Code</Label>
                                            <Input
                                                id="postalCode"
                                                value={newAddress.postalCode}
                                                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                                required
                                                className="border-2 border-black"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="country">Country</Label>
                                        <Input
                                            id="country"
                                            value={newAddress.country}
                                            onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                            required
                                            className="border-2 border-black"
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-end mt-4">
                                        <Button type="button" variant="outline" onClick={() => setShowAddressForm(false)} className="border-2 border-black">
                                            Cancel
                                        </Button>
                                        <Button type="submit" className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                            Save Address
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    <div className="grid gap-4">
                        {addresses.map((addr) => (
                            <Card key={addr.id} className="border-2 border-black relative group">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-bold">{addr.name}</p>
                                                {addr.isDefault && <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">Default</span>}
                                            </div>
                                            <p className="text-sm mt-1">{addr.address}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {addr.city}, {addr.postalCode}, {addr.country}
                                            </p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDeleteAddress(addr.id)}
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {!showAddressForm && addresses.length === 0 && (
                            <div className="text-center p-8 border-2 border-dashed border-muted rounded-lg text-muted-foreground">
                                No saved addresses
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
