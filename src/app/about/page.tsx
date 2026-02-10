import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Velyra',
    description: 'Learn more about our mission to bring you the finest handcrafted candles and curated gifts.',
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            <h1 className="text-4xl font-bold mb-8 text-center">About Us</h1>
            <div className="max-w-3xl mx-auto space-y-6 text-lg">
                <p>
                    Welcome to <strong>Velyra</strong>, where warmth meets elegance.
                    We are passionate about bringing you beautifully handcrafted candles
                    sourced directly from organic farms, alongside a curated collection of
                    exquisite gifts for every occasion.
                </p>
                <p>
                    Our journey began with a simple appreciation for the art of candle making
                    and its health benefits. We wanted to share this golden goodness with the world,
                    ensuring that every block and granule retains its natural richness.
                </p>
                <p>
                    But we didn't stop there. We believe that life's sweetest moments should be celebrated.
                    That's why we've expanded our offerings to include a range of thoughtful gifts,
                    perfect for sharing joy with your loved ones.
                </p>
                <p>
                    Thank you for choosing us to be a part of your celebrations and your daily life.
                </p>
            </div>
        </div>
    );
}
