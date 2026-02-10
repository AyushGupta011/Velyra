import ProductList from '@/components/ProductList';
import AnimatedProductGrid from '@/components/AnimatedProductGrid';
import FeaturedProductsClient from '@/components/FeaturedProductsClient';

export default async function FeaturedProductsSection() {
    return (
        <FeaturedProductsClient>
            <AnimatedProductGrid>
                <ProductList />
            </AnimatedProductGrid>
        </FeaturedProductsClient>
    );
}

