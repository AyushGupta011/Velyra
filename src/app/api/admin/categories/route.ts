import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/adminAuth';

// GET /api/admin/categories
export async function GET(req: NextRequest) {
    try {
        const authCheck = await checkAdminAuth();
        if (!authCheck.authorized) {
            return NextResponse.json(
                { error: authCheck.error },
                { status: 401 }
            );
        }

        const categories = await prisma.category.findMany({
            orderBy: { name: 'asc' },
        });

        return NextResponse.json({ categories });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
