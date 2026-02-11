import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // 1. Create Admin User
    const adminEmail = 'admin@example.com';
    const adminPassword = await hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'Admin User',
            password: adminPassword,
            role: 'ADMIN',
        },
    });

    console.log(`👤 Admin user created/verified: ${admin.email}`);

    // 2. Create Categories
    const categories = ['Candles', 'Gifts', 'Combos'];

    for (const catName of categories) {
        await prisma.category.upsert({
            where: { name: catName },
            update: {},
            create: { name: catName },
        });
    }
    console.log(`📂 Categories created: ${categories.join(', ')}`);

    // 3. Create Sample Products
    const candleCategory = await prisma.category.findUnique({ where: { name: 'Candles' } });
    const giftCategory = await prisma.category.findUnique({ where: { name: 'Gifts' } });

    if (candleCategory) {
        await prisma.product.upsert({
            where: { id: 'seed-candle-1' },
            update: {},
            create: {
                id: 'seed-candle-1',
                name: 'Lavender Dreams',
                description: 'A soothing lavender scented candle made with natural soy wax.',
                price: 450,
                stock: 50,
                images: ['https://images.unsplash.com/photo-1602825266989-b68424268e30?w=500&auto=format&fit=crop&q=60'],
                categoryId: candleCategory.id,
            },
        });

        await prisma.product.upsert({
            where: { id: 'seed-candle-2' },
            update: {},
            create: {
                id: 'seed-candle-2',
                name: 'Vanilla Bean Bliss',
                description: 'Rich and creamy vanilla scent for a warm atmosphere.',
                price: 520,
                stock: 30,
                images: ['https://images.unsplash.com/photo-1570823635306-250abb06d4b3?w=500&auto=format&fit=crop&q=60'],
                categoryId: candleCategory.id,
            },
        });
    }

    if (giftCategory) {
        await prisma.product.upsert({
            where: { id: 'seed-gift-1' },
            update: {},
            create: {
                id: 'seed-gift-1',
                name: 'Premium Gift Box',
                description: 'A curated selection of our finest items.',
                price: 1200,
                stock: 15,
                images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60'],
                categoryId: giftCategory.id,
            },
        });
    }

    console.log('📦 Sample products created');
    console.log('✅ Seed completed successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
