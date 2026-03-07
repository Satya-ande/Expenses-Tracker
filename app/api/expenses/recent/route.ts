import { NextResponse } from 'next/server'
// import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
    try {
        // const { userId } = auth()
        // if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        // Mock user ID for now
        const userId = "test_user_id"

        const url = new URL(req.url)
        const limitStr = url.searchParams.get('limit')
        const limit = limitStr ? parseInt(limitStr, 10) : 7

        const expenses = await prisma.transaction.findMany({
            where: { userId },
            include: { category: true },
            orderBy: { date: 'desc' },
            take: limit
        })

        // Map backend schema to frontend expected shape
        const formatted = expenses.map(e => ({
            id: e.id,
            title: e.merchant,
            amount: e.amount,
            category: e.category?.name || "Other",
            date: e.date.toISOString().split('T')[0],
            notes: e.notes
        }))

        return NextResponse.json(formatted)
    } catch (error) {
        console.error('[EXPENSES_RECENT_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
