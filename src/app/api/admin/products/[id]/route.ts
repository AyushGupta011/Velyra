import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/adminAuth';

// PATCH /api/admin/products/[id] - Update product
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return NextResponse.json(
                { error: authCheck.error },
                { status: 401 }
            );
        }

        const { id } = await params;
        const body = await req.json();


        // Whitelist allowed fields to prevent pollution
        const allowedFields = ['name', 'description', 'price', 'stock', 'images', 'categoryId'];
        const updateData: any = {};

        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        // Validate & Transform Types
        if (updateData.price !== undefined) {
            const parsedPrice = parseFloat(String(updateData.price));
            if (isNaN(parsedPrice)) {
                return NextResponse.json({ error: "Invalid price value" }, { status: 400 });
            }
            updateData.price = parsedPrice;
        }

        if (updateData.stock !== undefined) {
            const parsedStock = parseInt(String(updateData.stock));
            if (isNaN(parsedStock)) {
                return NextResponse.json({ error: "Invalid stock value" }, { status: 400 });
            }
            updateData.stock = parsedStock;
        }

        if (updateData.categoryId === "") {
            updateData.categoryId = null;
        }

        const product = await prisma.product.update({
            where: { id },
            data: updateData,
        });

        // Revalidate products page
        try {
            const { revalidatePath } = await import('next/cache');
            revalidatePath('/products');
        } catch (e) {
            console.error('Revalidation failed', e);
        }

        return NextResponse.json({
            success: true,
            product: { ...product, price: Number(product.price) }
        });
    } catch (error: any) {
        console.error('Error updating product:', error);
        // Return explicit Prisma error if possible
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }

}

// DELETE /api/admin/products/[id] - Delete product
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return NextResponse.json(
                { error: authCheck.error },
                { status: 401 }
            );
        }

        const { id } = await params;

        // Check if product is in any orders
        const orderCount = await prisma.orderItem.count({
            where: { productId: id }
        });

        if (orderCount > 0) {
            return NextResponse.json(
                { error: "Cannot delete product because it has been ordered by customers. Consider disabling it instead (set stock to 0)." },
                { status: 400 }
            );
        }

        await prisma.product.delete({
            where: { id },
        });

        // Revalidate products page
        try {
            const { revalidatePath } = await import('next/cache');
            revalidatePath('/products');
        } catch (e) {
            console.error('Revalidation failed', e);
        }

        return NextResponse.json({ success: true, message: "Product deleted" });
    } catch (error: any) {
        console.error('Error deleting product:', error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
