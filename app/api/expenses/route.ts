import { NextResponse } from 'next/server'
// import { auth } from '@clerk/nextjs/server' // Uncomment when packages are installed
import prisma from '@/lib/prisma'

export async function GET(req: Request) {
    try {
        // const { userId } = auth()
        // if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        // Mock user ID for now
        const userId = "test_user_id"

        const expenses = await prisma.transaction.findMany({
            where: { userId },
            include: { category: true },
            orderBy: { date: 'desc' }
        })

        return NextResponse.json(expenses)
    } catch (error) {
        console.error('[EXPENSES_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        // const { userId } = auth()
        // if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        // Mock user ID for now
        const userId = "test_user_id"

        const body = await req.json()
        const { amount, merchant, date, categoryId, notes } = body

        if (!amount || !merchant || !date) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        const expense = await prisma.transaction.create({
            data: {
                userId,
                amount: parseFloat(amount),
                merchant,
                date: new Date(date),
                categoryId,
                notes
            }
        })

        return NextResponse.json(expense)
    } catch (error) {
        console.error('[EXPENSES_POST]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
