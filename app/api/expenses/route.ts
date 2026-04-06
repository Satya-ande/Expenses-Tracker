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

        // Map backend schema to frontend expected shape
        const formatted = expenses.map(e => ({
            id: e.id,
            title: e.merchant,
            amount: e.amount,
            category: e.category?.name || "Other",
            date: e.date.toISOString().split('T')[0],
            type: e.type,
            notes: e.notes
        }))

        return NextResponse.json(formatted)
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

        // Ensure mock user exists to prevent foreign key constraint violations
        await prisma.user.upsert({
            where: { id: userId },
            update: {},
            create: {
                id: userId,
                clerkId: userId,
                email: 'test@example.com',
                name: 'Test User'
            }
        })

        const body = await req.json()
        const { amount, title, date, category, notes, merchant, type } = body

        // Frontend uses 'title', backend schema uses 'merchant'
        const merchantName = title || merchant

        if (!amount || !merchantName || !date) {
            return new NextResponse('Missing required fields', { status: 400 })
        }

        // Optional: auto-create the category if it doesn't exist
        let categoryId = body.categoryId
        if (category && !categoryId) {
            let dbCat = await prisma.category.findFirst({
                where: { name: category, userId }
            })
            if (!dbCat) {
                dbCat = await prisma.category.create({ data: { name: category, userId } })
            }
            categoryId = dbCat.id
        }

        const expense = await prisma.transaction.create({
            data: {
                userId,
                amount: parseFloat(amount),
                merchant: merchantName,
                date: new Date(date),
                categoryId,
                type: type === "INCOME" ? "INCOME" : "EXPENSE",
                notes
            },
            include: { category: true }
        })

        const formatted = {
            id: expense.id,
            title: expense.merchant,
            amount: expense.amount,
            category: expense.category?.name || "Other",
            date: expense.date.toISOString().split('T')[0],
            type: expense.type,
            notes: expense.notes
        }

        return NextResponse.json(formatted)
    } catch (error) {
        console.error('[EXPENSES_POST]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
