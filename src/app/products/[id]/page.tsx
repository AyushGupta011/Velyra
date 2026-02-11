import { prisma } from '@/lib/prisma';
import ProductDetailClient from './ProductDetailClient';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    // Await params for Next.js 15+ compatibility
    const { id } = await params;

    const product = await prisma.product.findUnique({
        where: { id },
        include: {
            category: true,
        },
    });

    if (!product) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <h1 className="text-4xl font-black mb-4">Product Not Found</h1>
                    <p className="text-muted-foreground mb-8">The product you are looking for does not exist or has been removed.</p>
                    <Button asChild>
                        <Link href="/products">Back to Products</Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Transform Prisma data to Client component props
    const transformedProduct = {
        id: product.id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        category: product.category?.name || 'General',
        image: product.images[0] || null,
        details: null, // Not in DB yet
        features: [],  // Not in DB yet
    };

    return <ProductDetailClient product={transformedProduct} />;
}
