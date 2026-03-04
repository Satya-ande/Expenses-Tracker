import prisma from '@/lib/prisma'

export async function categorizeTransaction(merchant: string, userId: string): Promise<string | null> {
    const lowercaseMerchant = merchant.toLowerCase()

    // 1. Check simple hardcoded rules
    const rules = {
        'food & drink': ['starbucks', 'mcdonalds', 'restaurant', 'cafe', 'subway', 'burger king', 'kfc'],
        'groceries': ['walmart', 'target', 'kroger', 'whole foods', 'trader joe', 'costco', 'safeway'],
        'transportation': ['uber', 'lyft', 'shell', 'chevron', 'exxon', 'bp', 'mobil', 'transit'],
        'housing': ['rent', 'mortgage', 'pg&e', 'coned', 'water', 'electric'],
        'entertainment': ['netflix', 'spotify', 'hulu', 'amc', 'steam', 'playstation', 'xbox'],
    }

    let matchedCategoryName = 'Other'

    for (const [category, keywords] of Object.entries(rules)) {
        if (keywords.some(keyword => lowercaseMerchant.includes(keyword))) {
            matchedCategoryName = category
            break
        }
    }

    // 2. Fallback to existing logic or 'Other'

    // Try to find the category in the DB
    let dbCategory = await prisma.category.findFirst({
        where: {
            userId,
            name: {
                equals: matchedCategoryName,
                mode: 'insensitive'
            }
        }
    })

    // 3. Create 'Other' category if it doesn't exist and no match is found
    if (!dbCategory) {
        dbCategory = await prisma.category.create({
            data: {
                name: matchedCategoryName,
                userId
            }
        })
    }

    return dbCategory.id
}
