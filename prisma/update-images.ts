import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const IMAGE_MAP: Record<string, string[]> = {
    'candles': [
        'https://images.unsplash.com/photo-1602825266989-b68424268e30?w=500&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1570823635306-250abb06d4b3?w=500&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1596436087523-28682e5b8801?w=500&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=60'
    ],
    'gifts': [
        'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=500&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=500&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=500&auto=format&fit=crop&q=60'
    ],
    'combos': [
        'https://images.unsplash.com/photo-1607344645866-009c320b63e0?w=500&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1484156885348-ab550f800f40?w=500&auto=format&fit=crop&q=60'
    ]
};

async function main() {
    console.log('🔄 Starting image update...');

    const products = await prisma.product.findMany({
        include: { category: true }
    });

    let updatedCount = 0;

    for (const product of products) {
        if (!product.images || product.images.length === 0) {
            const categoryName = product.category?.name.toLowerCase() || 'candles';
            // Find matching category key (partial match or default)
            let imageKey = Object.keys(IMAGE_MAP).find(k => categoryName.includes(k)) || 'candles';

            const availableImages = IMAGE_MAP[imageKey];
            const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];

            await prisma.product.update({
                where: { id: product.id },
                data: {
                    images: [randomImage]
                }
            });

            console.log(`✅ Updated "${product.name}" with image: ${randomImage}`);
            updatedCount++;
        }
    }

    console.log(`🎉 Finished! Updated ${updatedCount} products.`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
