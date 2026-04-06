import { NextResponse } from 'next/server'
// import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { startOfMonth, endOfMonth } from 'date-fns'

export async function GET() {
    try {
        // const { userId } = auth()
        // if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const userId = "test_user_id"
        const now = new Date()
        const currentMonthStart = startOfMonth(now)
        const currentMonthEnd = endOfMonth(now)

        const categoryQuery = await prisma.transaction.groupBy({
            by: ['categoryId'],
            where: { userId, date: { gte: currentMonthStart, lte: currentMonthEnd }, type: "EXPENSE" },
            _sum: { amount: true }
        })

        const categoryIds = categoryQuery.map(c => c.categoryId).filter(Boolean) as string[]
        const categories = await prisma.category.findMany({
            where: { id: { in: categoryIds } }
        })

        const colors = [
            "var(--color-chart-1)",
            "var(--color-chart-2)",
            "var(--color-chart-3)",
            "var(--color-chart-4)",
            "var(--color-chart-5)",
        ]

        const formatted = categoryQuery.map((group, index) => {
            const category = categories.find(c => c.id === group.categoryId)
            return {
                name: category ? category.name : 'Other',
                value: group._sum.amount || 0,
                fill: colors[index % colors.length]
            }
        })

        return NextResponse.json(formatted)
    } catch (error) {
        console.error('[CATEGORY_EXPENSES_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
