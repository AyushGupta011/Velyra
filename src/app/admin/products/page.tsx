"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pencil, Trash2, Plus, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        images: '',
        categoryId: '',
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [prodRes, catRes] = await Promise.all([
                fetch('/api/admin/products'),
                fetch('/api/admin/categories')
            ]);

            if (prodRes.ok) {
                const data = await prodRes.json();
                setProducts(data.products);
            }
            if (catRes.ok) {
                const data = await catRes.json();
                setCategories(data.categories);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: any) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            stock: product.stock,
            images: product.images?.join(', ') || '',
            categoryId: product.categoryId || '',
        });
        setIsOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure? This cannot be undone.')) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(products.filter(p => p.id !== id));
            } else {
                alert('Failed to delete product');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSave = async () => {
        if (!formData.name || !formData.price) {
            alert('Name and price are required');
            return;
        }

        setIsSaving(true);
        try {
            const payload = {
                ...formData,
                images: formData.images.split(',').map(s => s.trim()).filter(Boolean),
            };

            const url = editingProduct
                ? `/api/admin/products/${editingProduct.id}`
                : '/api/admin/products';

            const method = editingProduct ? 'PATCH' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                const data = await res.json();
                // Refresh list to show updated data (including joined category name)
                fetchData();
                setIsOpen(false);
                resetForm();
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to save');
            }
        } catch (error) {
            console.error(error);
            alert('Error saving product');
        } finally {
            setIsSaving(false);
        }
    };

    const resetForm = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            stock: '',
            images: '',
            categoryId: '',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-black">🛍️ Products</h1>
                <Button
                    onClick={() => { resetForm(); setIsOpen(true); }}
                    className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
            </div>

            <div className="bg-white rounded-xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="overflow-x-auto">
                    <Table className="min-w-[800px]">
                        <TableHeader className="bg-secondary/10 border-b-4 border-black">
                            <TableRow>
                                <TableHead className="font-black text-black">Image</TableHead>
                                <TableHead className="font-black text-black">Name</TableHead>
                                <TableHead className="font-black text-black">Category</TableHead>
                                <TableHead className="font-black text-black">Price</TableHead>
                                <TableHead className="font-black text-black">Stock</TableHead>
                                <TableHead className="text-right font-black text-black">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                    </TableCell>
                                </TableRow>
                            ) : products.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-12 font-bold text-muted-foreground">
                                        No products found. Add your first one!
                                    </TableCell>
                                </TableRow>
                            ) : (
                                products.map((product) => (
                                    <TableRow key={product.id} className="border-b-2 border-black hover:bg-secondary/5">
                                        <TableCell>
                                            <div className="h-12 w-12 rounded-md border-2 border-black bg-gray-100 overflow-hidden relative flex items-center justify-center">
                                                {product.images && product.images[0] ? (
                                                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-bold">{product.name}</TableCell>
                                        <TableCell>
                                            <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-bold border border-black">
                                                {product.category?.name || 'Uncategorized'}
                                            </span>
                                        </TableCell>
                                        <TableCell>₹{Number(product.price).toFixed(2)}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs font-black border-2 border-black ${product.stock > 10 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.stock}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleEdit(product)}
                                                className="border-2 border-black h-8 w-8 p-0"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => handleDelete(product.id)}
                                                className="border-2 border-black h-8 w-8 p-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">
                            {editingProduct ? 'Edit Product' : 'Add New Product'}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold">Product Name</label>
                            <Input
                                placeholder="E.g. Lavender Candle"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="border-2 border-black"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Category</label>
                                <Select
                                    value={formData.categoryId}
                                    onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                                >
                                    <SelectTrigger className="border-2 border-black">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent className="border-2 border-black">
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold">Price (₹)</label>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    className="border-2 border-black"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Stock</label>
                            <Input
                                type="number"
                                placeholder="0"
                                value={formData.stock}
                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                className="border-2 border-black"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Description</label>
                            <Textarea
                                placeholder="Product description..."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="border-2 border-black resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold">Images (comma separated URLs)</label>
                            <Textarea
                                placeholder="https://..., https://..."
                                value={formData.images}
                                onChange={e => setFormData({ ...formData, images: e.target.value })}
                                className="border-2 border-black resize-none"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsOpen(false)} className="border-2 border-black">Cancel</Button>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                        >
                            {isSaving ? 'Saving...' : 'Save Product'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
