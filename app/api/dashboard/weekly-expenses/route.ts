import { NextResponse } from 'next/server'
// import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        // const { userId } = auth()
        // if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const userId = "test_user_id"

        // Mocking Weekly data logic for now
        const formatted = [
            { day: "Mon", amount: 0 },
            { day: "Tue", amount: 0 },
            { day: "Wed", amount: 0 },
            { day: "Thu", amount: 0 },
            { day: "Fri", amount: 0 },
            { day: "Sat", amount: 0 },
            { day: "Sun", amount: 0 },
        ]

        return NextResponse.json(formatted)
    } catch (error) {
        console.error('[WEEKLY_EXPENSES_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
