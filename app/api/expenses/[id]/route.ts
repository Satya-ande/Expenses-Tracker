import { NextResponse } from 'next/server'
// import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        // const { userId } = auth()
        // if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const userId = "test_user_id" // mock

        // Verify the expense belongs to the user
        const expense = await prisma.transaction.findUnique({
            where: { id }
        })

        if (!expense || expense.userId !== userId) {
            return new NextResponse('Not Found', { status: 404 })
        }

        await prisma.transaction.delete({
            where: { id }
        })

        return new NextResponse(null, { status: 204 })
    } catch (error) {
        console.error('[EXPENSE_DELETE]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const userId = "test_user_id"
        const body = await req.json()
        const { amount, title, date, categoryId, notes, merchant } = body
        const merchantName = title || merchant

        const expense = await prisma.transaction.update({
            where: { id },
            data: {
                amount: amount ? parseFloat(amount) : undefined,
                merchant: merchantName,
                date: date ? new Date(date) : undefined,
                categoryId,
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
            notes: expense.notes
        }

        return NextResponse.json(formatted)
    } catch (error) {
        console.error('[EXPENSE_PUT]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
