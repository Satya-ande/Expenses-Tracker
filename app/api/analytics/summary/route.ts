import { NextResponse } from 'next/server'
// import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'

export async function GET(req: Request) {
    try {
        // const { userId } = auth()
        // if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        // Mock user ID for now
        const userId = "test_user_id"

        // Get current date
        const now = new Date()

        // 1. Calculate Monthly Expenses
        const currentMonthStart = startOfMonth(now)
        const currentMonthEnd = endOfMonth(now)

        // Previous month comparison
        const previousMonthStart = startOfMonth(subMonths(now, 1))
        const previousMonthEnd = endOfMonth(subMonths(now, 1))

        const currentMonthTransactions = await prisma.transaction.aggregate({
            where: { userId, date: { gte: currentMonthStart, lte: currentMonthEnd } },
            _sum: { amount: true }
        })

        const previousMonthTransactions = await prisma.transaction.aggregate({
            where: { userId, date: { gte: previousMonthStart, lte: previousMonthEnd } },
            _sum: { amount: true }
        })

        const totalExpenses = currentMonthTransactions._sum.amount || 0
        const prevTotalExpenses = previousMonthTransactions._sum.amount || 0

        // Percentage change
        const expenseChange = prevTotalExpenses === 0 ? 0 : ((totalExpenses - prevTotalExpenses) / prevTotalExpenses) * 100

        // 2. Aggregate spending by category for Doughnut chart
        const categoryQuery = await prisma.transaction.groupBy({
            by: ['categoryId'],
            where: { userId, date: { gte: currentMonthStart, lte: currentMonthEnd } },
            _sum: { amount: true }
        })

        // Fetch category names
        const categoryIds = categoryQuery.map(c => c.categoryId).filter(Boolean) as string[]
        const categories = await prisma.category.findMany({
            where: { id: { in: categoryIds } }
        })

        // Map the grouped data to category names
        const spendingByCategory = categoryQuery.map(group => {
            const category = categories.find(c => c.id === group.categoryId)
            return {
                name: category ? category.name : 'Unknown',
                value: group._sum.amount || 0
            }
        })

        return NextResponse.json({
            summary: {
                totalExpenses,
                expenseChange,
                currentMonth: currentMonthStart.toISOString(),
            },
            spendingByCategory
        })
    } catch (error) {
        console.error('[ANALYTICS_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
