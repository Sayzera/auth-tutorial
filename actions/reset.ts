'use server'
import * as z from 'zod';

import { ResetSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user"
import { sendPasswordResetEmail } from '@/lib/mail';
import { generatePasswordResetToken } from '@/lib/tokens';

export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);


    if(!validatedFields.success) {
        return {
            error: 'Geçersiz e-Posta adresi!'
        }
    }


    const { email } = validatedFields.data

    const existingUser = await getUserByEmail(email);

    if(!existingUser?.email) {
        return {
            error: 'e-Posta adresi bulunamadı!'
        }
    }

   
    // TODO: Generate token & send email 
    const passwordResetToken = await generatePasswordResetToken(existingUser.email)

    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token)

    return {
        success: 'Şifre sıfırlama maili, email adresinize gönderildi.'
    }



}