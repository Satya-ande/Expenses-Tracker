import { NextResponse } from 'next/server'
// import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid' // Uncomment when installed
// import { auth } from '@clerk/nextjs/server'

// Mock Plaid configuration until package is installed
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

        // const reqBody = await req.json()

        // TODO: Create Link Token logic
        /*
        const response = await plaidClient.linkTokenCreate({
          user: { client_user_id: userId },
          client_name: 'SpendWise AI',
          products: ['transactions'],
          country_codes: ['US'],
          language: 'en',
        })
        return NextResponse.json(response.data)
        */

        return NextResponse.json({ message: "Plaid Link Token Endpoint Placeholder" })
    } catch (error) {
        console.error('[PLAID_CREATE_LINK]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
