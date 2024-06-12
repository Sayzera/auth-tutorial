'use server'
import * as z from 'zod'

import { NewPasswordSchema } from '@/schemas'
import { getPasswordResetTokenByToken } from '@/data/password-reset-token'
import { getUserByEmail } from '@/data/user'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

export const newPassword = async (value: z.infer<typeof NewPasswordSchema>, token?:string | null ) => {
    if(!token) {
        return {
            error: 'Token bulunamadı!'
        } 
    }

    const validatedFields = NewPasswordSchema.safeParse(value);

    if(!validatedFields.success) {
        return {
            error: 'Lütfen gerekli alanları doldurunuz!'
        }
    }

    const { password } = validatedFields.data

    const existinToken = await getPasswordResetTokenByToken(token);

    if(!existinToken) {
        return {
            error: 'Token bulunamadı'
        }
    }

    const hasExpired = new Date(existinToken.expires) < new Date();

    if(hasExpired) {
        return {
            error: 'Tokenınızın süresi dolmuştur!'
        }
    }

    const existingUser = await getUserByEmail(existinToken.email);

    if(!existingUser) {
        return {
            error: 'e-Posta adresi bulunamadı!'
        }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.user.update({
        where: {
            id: existingUser.id
        },
        data: {
            password: hashedPassword
        }
    })

    await db.passwordResetToken.delete({
        where: {
            id: existinToken.id
        }
    })


    return {
        success: 'Şifreniz başarıyla değiştirildi'
    }



} 