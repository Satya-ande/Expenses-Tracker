import { NextResponse } from 'next/server'
// import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET() {
    try {
        // const { userId } = auth()
        // if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const userId = "test_user_id"

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            return new NextResponse('User Not Found', { status: 404 })
        }

        // Map to frontend UserSettings interface
        const settings = {
            name: user.name || "Test User",
            email: user.email || "test@example.com",
            currency: user.homeCurrency || "inr",
            emailNotifications: true, // mock since not in schema
            budgetAlerts: true // mock since not in schema
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error('[SETTINGS_GET]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}

export async function PUT(req: Request) {
    try {
        const userId = "test_user_id"
        const body = await req.json()
        const { name, email, currency } = body

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                homeCurrency: currency
            }
        })

        const settings = {
            name: updatedUser.name || "Test User",
            email: updatedUser.email || "test@example.com",
            currency: updatedUser.homeCurrency || "inr",
            emailNotifications: true,
            budgetAlerts: true
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error('[SETTINGS_PUT]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
