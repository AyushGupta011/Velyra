import ProductCard from '@/components/ProductCard';
import { prisma } from '@/lib/prisma';

interface ProductListProps {
    category?: string;
}

export default async function ProductList({ category }: ProductListProps) {
    let products: any[] = [];

    try {
        const whereFn = category ? { category: { name: category } } : {};

        products = await prisma.product.findMany({
            where: whereFn,
            include: { category: true },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        // Fallback or empty array
    }

    if (products.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No products found.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
                <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={Number(product.price)}
                    description={product.description}
                    image={product.images[0]}
                    category={product.category?.name || 'general'}
                    index={index}
                />
            ))}
        </div>
    );
}
