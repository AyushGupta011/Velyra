import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

const INITIAL_PRODUCTS = [
    {
        name: 'Lavender Soy Candle',
        description: 'Hand-poured soy candle with calming lavender essential oils for relaxation.',
        price: 450,
        category: 'candles',
        stock: 50,
        images: ['/images/lavender-candle.jpg']
    },
    {
        name: 'Vanilla Bean Candle Set',
        description: 'Set of 3 premium vanilla-scented candles perfect for creating a cozy atmosphere.',
        price: 850,
        category: 'candles',
        stock: 30,
        images: ['/images/vanilla-candle.jpg']
    },
    {
        name: 'Premium Gift Box',
        description: 'A curated selection of dry fruits, chocolates, and handcrafted items.',
        price: 1200,
        category: 'gifts',
        stock: 20,
        images: ['/images/gift-box.jpg']
    },
    {
        name: 'Festive Gift Hamper',
        description: 'Curated gift box with artisan candles, aromatherapy oils, and decorative items.',
        price: 1500,
        category: 'combos',
        stock: 15,
        images: ['/images/festive-combo.jpg']
    }
];

// GET /api/seed-products - Seed initial products
export async function GET(req: NextRequest) {
    try {
        // TEMPORARY: Public access for seeding

        // Create categories
        const categories = ['candles', 'gifts', 'combos'];

        for (const catName of categories) {
            await prisma.category.upsert({
                where: { name: catName },
                update: {},
                create: { name: catName },
            });
        }

        // Create products
        const results: any[] = [];
        for (const p of INITIAL_PRODUCTS) {
            // Find category
            const category = await prisma.category.findUnique({
                where: { name: p.category }
            });

            if (category) {
                // Check if product exists by name to avoid duplicates
                const existing = await prisma.product.findFirst({
                    where: { name: p.name }
                });

                if (!existing) {
                    const product = await prisma.product.create({
                        data: {
                            name: p.name,
                            description: p.description,
                            price: p.price,
                            stock: p.stock,
                            images: p.images,
                            categoryId: category.id,
                        }
                    });
                    results.push(product);
                } else {
                    results.push({ name: existing.name, status: 'already exists' });
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: `Processed products. Created: ${results.filter(r => !r.status).length}`,
            products: results
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
