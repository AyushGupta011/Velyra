import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Verify ownership
        const address = await prisma.address.findUnique({
            where: { id },
        });

        if (!address || address.userId !== session.user.id) {
            return NextResponse.json({ error: 'Address not found' }, { status: 404 });
        }

        await prisma.address.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Address deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete address' }, { status: 500 });
    }
}
