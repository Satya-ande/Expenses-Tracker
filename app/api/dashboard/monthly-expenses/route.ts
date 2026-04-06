import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { subMonths, startOfMonth, format } from 'date-fns'

export async function GET() {
    try {
        const userId = "test_user_id"
        const now = new Date()
        const sixMonthsAgo = startOfMonth(subMonths(now, 5))

        const expenses = await prisma.transaction.findMany({
            where: { userId, date: { gte: sixMonthsAgo }, type: "EXPENSE" },
            select: { date: true, amount: true }
        })

        // Initialize last 6 months with 0
        const monthlyGroups: Record<string, number> = {}
        for (let i = 0; i < 6; i++) {
             const m = format(subMonths(now, i), 'MMM')
             monthlyGroups[m] = 0
        }

        expenses.forEach(e => {
             const m = format(e.date, 'MMM')
             if (monthlyGroups[m] !== undefined) {
                 monthlyGroups[m] += e.amount
             }
        })

        // Reverse to get oldest first
        const formatted = Object.keys(monthlyGroups).reverse().map(m => ({
            month: m,
            amount: monthlyGroups[m]
        }))

        return NextResponse.json(formatted)
    } catch (error) {
        console.error('[MONTHLY_EXPENSES_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
