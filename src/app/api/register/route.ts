import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcrypt';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password, name } = body;
        console.log('[REGISTER_POST] Received body:', { email, name, passwordReceived: !!password });

        if (!email || !password) {
            return new NextResponse('Missing email or password', { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return new NextResponse('User already exists', { status: 400 });
        }

        const hashedPassword = await hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                role: 'CUSTOMER',
            },
        });

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('[REGISTER_POST_ERROR]', error);
        if (error instanceof Error) {
            console.error('[REGISTER_POST_STACK]', error.stack);
            console.error('[REGISTER_POST_MESSAGE]', error.message);
        }
        return new NextResponse('Internal Error', { status: 500 });
    }
}
