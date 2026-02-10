import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/adminAuth';

// GET /api/admin/products - Get all products
export async function GET(req: NextRequest) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return NextResponse.json(
                { error: authCheck.error },
                { status: 401 }
            );
        }

        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                category: true,
                _count: {
                    select: { orderItems: true }
                }
            }
        });

        // Parse Decimals to number for JSON
        const sanitizedProducts = products.map(p => ({
            ...p,
            price: Number(p.price),
        }));

        return NextResponse.json({ products: sanitizedProducts });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// POST /api/admin/products - Create new product
export async function POST(req: NextRequest) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return NextResponse.json(
                { error: authCheck.error },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { name, description, price, stock, images, categoryId } = body;

        // Basic validation
        if (!name || !price) {
            return NextResponse.json(
                { error: "Name and price are required" },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                name,
                description: description || '',
                price: parseFloat(price),
                stock: parseInt(stock) || 0,
                images: images || [],
                categoryId: categoryId || null,
            },
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
        console.error('Error creating product:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
