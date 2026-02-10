import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

// GET /api/setup-admin - Promote current user to ADMIN (DEV ONLY)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Please login first' },
                { status: 401 }
            );
        }

        const user = await prisma.user.update({
            where: { email: session.user.email },
            data: { role: 'ADMIN' },
        });

        return NextResponse.json({
            success: true,
            message: `User ${user.email} is now an ADMIN!`,
            user
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
