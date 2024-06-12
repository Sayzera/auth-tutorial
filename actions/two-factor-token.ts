import { db } from '@/lib/db'

export const getTwoFactorTokenByToken = async (token:string) => {
    try {

        const twoFactorToken = await db.twoFactrorToken.findUnique({
            where: {
                token
            }
        })

        return twoFactorToken
         
    } catch {
        return null
    }
}

export const getTwoFactorTokenByEmail = async (email:string) => {
    try {

        const twoFactorToken = await db.twoFactrorToken.findFirst({
            where: {
                email
            }
        })

        return twoFactorToken
         
    } catch {
        return null
    }
}