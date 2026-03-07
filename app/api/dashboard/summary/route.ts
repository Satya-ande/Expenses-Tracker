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
        const expenseChangePercent = prevTotalExpenses === 0 ? 0 : ((totalExpenses - prevTotalExpenses) / prevTotalExpenses) * 100

        return NextResponse.json({
            totalExpenses,
            totalIncome: 0, // Mock income
            remainingBalance: 0 - totalExpenses, // Mock balance
            expenseChangePercent,
            incomeChangePercent: 0,
            savingsPercent: 0
        })
    } catch (error) {
        console.error('[ANALYTICS_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
