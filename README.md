# Next.js E-commerce Platform

A modern, full-stack e-commerce application built with Next.js 16, Prisma, Tailwind CSS, and Stripe.

## Features

- **Storefront**: Browse products, view details, calculate prices.
- **Shopping Cart**: Add items, adjust quantities, real-time totals.
- **Checkout**: Secure payment processing with Stripe.
- **User Authentication**: Sign up, login, and manage profile (NextAuth.js).
- **Admin Dashboard**: Manage products, orders, and users.
- **Order History**: Users can view their past orders and status.
- **Responsive Design**: Mobile-friendly UI using Tailwind CSS.
- **Database**: PostgreSQL with Prisma ORM.

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Payments**: [Stripe](https://stripe.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Deployment**: Vercel / Docker

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Redis (optional, for caching/queues if used)
- Stripe account

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd nextjs-project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env` file in the root directory and add the following:

   ```env
   # Database
   DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"
   REDIS_URL="redis://localhost:6379"

   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-super-secret-key"

   # Stripe
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."

   # App Config
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NEXT_PUBLIC_BASE_URL="http://localhost:3000"
   ```

4. **Initialize the Database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Scripts

- `npm run dev`: Runs the development server.
- `npm run build`: Builds the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint checks.

## Docker Support

You can also run the application using Docker:

```bash
docker-compose up --build
```

Make sure to configure `docker-compose.yml` and `.env` correctly.

## Project Structure

- `src/app`: Next.js App Router pages and API routes.
- `src/components`: Reusable UI components.
- `src/lib`: Utility functions, Prisma client, and configurations.
- `prisma`: Database schema and migrations.
- `public`: Static assets.

## Learn More

To learn more about Next.js, take a look at the [Next.js Documentation](https://nextjs.org/docs).
