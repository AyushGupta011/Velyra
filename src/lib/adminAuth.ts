import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function checkAdminAuth() {
    const session = await getServerSession();

    if (!session?.user?.email) {
        return { authorized: false, error: 'Unauthorized - Please login' };
    }

    // Get user from database to check role
    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true, email: true, name: true, role: true },
    });

    if (!user) {
        return { authorized: false, error: 'User not found' };
    }

    // Check if user has admin role
    if (user.role !== 'ADMIN') {
        return { authorized: false, error: 'Forbidden - Admin access required' };
    }

    return { authorized: true, user };
}

export async function adminAuthMiddleware(req: NextRequest) {
    const authCheck = await checkAdminAuth();

    if (!authCheck.authorized) {
        return NextResponse.json(
            { error: authCheck.error },
            { status: authCheck.error?.includes('Forbidden') ? 403 : 401 }
        );
    }

    return null; // Auth successful
}
