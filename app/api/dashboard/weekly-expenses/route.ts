import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { subDays, startOfDay, format } from 'date-fns'

export async function GET() {
    try {
        const userId = "test_user_id"
        const now = new Date()
        const sevenDaysAgo = startOfDay(subDays(now, 6))

        const expenses = await prisma.transaction.findMany({
            where: { userId, date: { gte: sevenDaysAgo }, type: "EXPENSE" },
            select: { date: true, amount: true }
        })

        // Initialize last 7 days with 0
        const weeklyGroups: Record<string, number> = {}
        for (let i = 0; i < 7; i++) {
             const d = format(subDays(now, i), 'EEE') // e.g. Mon, Tue
             weeklyGroups[d] = 0
        }

        expenses.forEach(e => {
             const d = format(e.date, 'EEE')
             if (weeklyGroups[d] !== undefined) {
                 weeklyGroups[d] += e.amount
             }
        })

        // Reverse to get oldest first
        const formatted = Object.keys(weeklyGroups).reverse().map(d => ({
            day: d,
            amount: weeklyGroups[d]
        }))

        return NextResponse.json(formatted)
    } catch (error) {
        console.error('[WEEKLY_EXPENSES_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
