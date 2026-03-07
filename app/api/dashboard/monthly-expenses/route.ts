import { NextResponse } from 'next/server'
// import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        // const { userId } = auth()
        // if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const userId = "test_user_id"

        // Mocking Monthly data logic for now
        const formatted = [
            { month: "Jan", amount: 0 },
            { month: "Feb", amount: 0 },
            { month: "Mar", amount: 0 },
        ]

        return NextResponse.json(formatted)
    } catch (error) {
        console.error('[MONTHLY_EXPENSES_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
