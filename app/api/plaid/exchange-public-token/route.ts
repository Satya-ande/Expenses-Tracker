import { NextResponse } from 'next/server'
// import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid' // Uncomment when installed
// import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

/*
const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
})
const plaidClient = new PlaidApi(configuration)
*/

export async function POST(req: Request) {
    try {
        // const { userId } = auth()
        // if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        // Mock user ID for now
        const userId = "test_user_id"

        const { publicToken } = await req.json()

        if (!publicToken) {
            return new NextResponse('Missing public token', { status: 400 })
        }

        // TODO: Exchange the public token for an access token
        /*
        const response = await plaidClient.itemPublicTokenExchange({
          public_token: publicToken,
        })
        
        const accessToken = response.data.access_token
        const itemId = response.data.item_id
        
        // Save token to DB...
        */

        return NextResponse.json({ message: "Plaid Item Public Token Exchange Placeholder" })
    } catch (error) {
        console.error('[PLAID_EXCHANGE_PUBLIC_TOKEN]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
