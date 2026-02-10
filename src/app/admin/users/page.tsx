"use client";

import { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Shield, User } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function AdminUsersPage() {
    const { data: session } = useSession();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            if (res.ok) {
                const data = await res.json();
                setUsers(data.users);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        setUpdatingId(userId);
        try {
            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role: newRole }),
            });

            if (res.ok) {
                const data = await res.json();
                setUsers(users.map(u => u.id === userId ? { ...u, role: data.user.role } : u));
            } else {
                alert('Failed to update role');
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-4xl font-black">👥 Users</h1>

            <div className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <Table>
                    <TableHeader className="bg-secondary/10 border-b-4 border-black">
                        <TableRow>
                            <TableHead className="font-black text-black">User</TableHead>
                            <TableHead className="font-black text-black">Role</TableHead>
                            <TableHead className="font-black text-black">Joined</TableHead>
                            <TableHead className="font-black text-black">Orders</TableHead>
                            <TableHead className="font-black text-black text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.id} className="border-b-2 border-black hover:bg-secondary/5">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center border-2 border-black">
                                                {user.role === 'ADMIN' ? <Shield className="h-5 w-5" /> : <User className="h-5 w-5" />}
                                            </div>
                                            <div>
                                                <div className="font-bold">{user.name}</div>
                                                <div className="text-sm text-muted-foreground">{user.email}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs font-black border-2 border-black ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {user.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                                    <TableCell>{user._count?.orders || 0}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end">
                                            <Select
                                                value={user.role}
                                                onValueChange={(val) => handleRoleChange(user.id, val)}
                                                disabled={updatingId === user.id || user.email === session?.user?.email} // Prevent changing own role
                                            >
                                                <SelectTrigger className="w-[130px] border-2 border-black h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="border-2 border-black">
                                                    <SelectItem value="CUSTOMER">Customer</SelectItem>
                                                    <SelectItem value="ADMIN">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
