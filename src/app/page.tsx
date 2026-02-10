import HeroSection from '@/components/HeroSection';
import FeaturedProductsSection from '@/components/FeaturedProductsSection';
import FeaturesSection from '@/components/FeaturesSection';

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-background">
            <HeroSection />
            <FeaturedProductsSection />
            <FeaturesSection />
        </div>
    );
}
