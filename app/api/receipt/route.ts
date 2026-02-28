import { NextResponse } from 'next/server'
// import { DocumentProcessorServiceClient } from '@google-cloud/documentai' // Uncomment when installed
// import { auth } from '@clerk/nextjs/server'

/*
const client = new DocumentProcessorServiceClient({
  // Add credentials/projectId via env variables or file
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }
})
*/

export async function POST(req: Request) {
    try {
        // const { userId } = auth()
        // if (!userId) return new NextResponse('Unauthorized', { status: 401 })

        const formData = await req.formData()
        const file = formData.get('file') as Blob

        if (!file) {
            return new NextResponse('Missing file', { status: 400 })
        }

        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        const encodedImage = buffer.toString('base64')

        // Document AI configured processor ID
        const processorId = process.env.GOOGLE_DOCUMENT_AI_PROCESSOR_ID
        const location = process.env.GOOGLE_CLOUD_LOCATION || 'us'
        const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID

        // TODO: Call Google Document AI
        /*
        const name = `projects/${projectId}/locations/${location}/processors/${processorId}`
        const request = {
          name,
          rawDocument: {
            content: encodedImage,
            mimeType: file.type || 'image/jpeg',
          },
        }
    
        const [result] = await client.processDocument(request)
        const { document } = result
    
        // Extract relevant fields: merchant, amount, date based on your processor's schema
        let merchant = "Unknown Merchant"
        let amount = 0
        let date = new Date().toISOString()
        
        // Example entity extraction logic depending on Document AI setup:
        if (document?.entities) {
            for (const entity of document.entities) {
                if (entity.type === "supplier_name" && entity.mentionText) merchant = entity.mentionText;
                if (entity.type === "total_amount" && entity.normalizedValue?.text) amount = parseFloat(entity.normalizedValue.text);
                if (entity.type === "receipt_date" && entity.normalizedValue?.text) date = entity.normalizedValue.text;
            }
        }
    
        // Pass the merchant into our smart categorization logic
        // const { categorizeTransaction } = await import('@/lib/categorization')
        // const categoryId = await categorizeTransaction(merchant, userId)
    
        return NextResponse.json({
          merchant,
          amount,
          date,
          // categoryId,
        })
        */

        return NextResponse.json({ message: "Google Document AI Endpoint Placeholder" })
    } catch (error) {
        console.error('[RECEIPT_POST]', error)
        return new NextResponse('Internal Error', { status: 500 })
    }
}
