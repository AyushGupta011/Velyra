import Link from 'next/link';
import { Button } from '@/components/ui/button';
import ProductList from '@/components/ProductList';

export const metadata = {
    title: 'Products | Candles & Gifts',
    description: 'Browse our collection of handcrafted candles and premium gifts.',
};

export default async function ProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedSearchParams = await searchParams;
    const category = typeof resolvedSearchParams.category === 'string' ? resolvedSearchParams.category : undefined;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Our Products</h1>
                    <p className="text-muted-foreground mt-2">
                        {category ? `Showing results for ${category}` : 'All Products'}
                    </p>
                </div>

                <div className="flex gap-2">
                    <Button variant={!category ? "default" : "outline"} asChild>
                        <Link href="/products">All</Link>
                    </Button>
                    <Button variant={category === 'candles' ? "default" : "outline"} asChild>
                        <Link href="/products?category=candles">Candles</Link>
                    </Button>
                    <Button variant={category === 'gifts' ? "default" : "outline"} asChild>
                        <Link href="/products?category=gifts">Gifts</Link>
                    </Button>
                    <Button variant={category === 'combos' ? "default" : "outline"} asChild>
                        <Link href="/products?category=combos">Combos</Link>
                    </Button>
                </div>
            </div>

            <ProductList category={category} />
        </div>
    );
}
