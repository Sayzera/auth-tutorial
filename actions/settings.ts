'use server';
import bcrypt from 'bcryptjs'
import * as z from 'zod';

import { db } from '@/lib/db';
import { SettingsSchema } from '@/schemas';
import { getUserByEmail, getUserById} from '@/data/user';
import { currentUser } from '@/lib/auth';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export const settings = async  (values: z.infer<typeof SettingsSchema>) => {



    // form validate 
    const validatedFields = SettingsSchema.safeParse(values);

    if(!validatedFields) {
        return {
            error: 'Geçersiz form!'
        }
    }
    
    const user = await currentUser();

    if(!user?.id) {
        return {
            error: 'Yetkisiz Erişim!'
        }
    }

    const dbUser = await getUserById(user.id);

    if(!dbUser?.password) {
        return {
            error: 'Kullanıcı bulunamadı!'
        }
    }

    if(user.isOAuth) {
        values.email = undefined;
        values.password = undefined;
        values.newPassword = undefined;
        values.isTwoFactorEnabled = undefined;
    }


    let isChangeEmail = false
    if(values.email && values.email !== user.email) {
        const existingUser = await getUserByEmail(values.email);

        // Böyle bir email varsa ve bu emailin idsi bana eşit değilse
        // başka birisinin emailini değiştiriyoruz demektir.
        if(existingUser && existingUser.id !== user.id) {
            return {
                error: 'Bu e-Posta adresi sistemimizde zaten kayıtlı!'
            }
        }
        const verificationToken = await generateVerificationToken(values.email)

        await sendVerificationEmail(
            values.email,
            verificationToken.token,
           )

        isChangeEmail = true;

    }

    if(!user.isOAuth && values.password && values.newPassword) {
       const passwordsMatch =   await bcrypt.compare(values.password, dbUser.password)
        if(!passwordsMatch) {
            return {
                error: 'Mevcut şifrenizi yanlış girdiniz lütfen tekrar deneyiniz'
            }
        }

        // şifre doğruysa 
        const hashedNewPassword = await bcrypt.hash(values.newPassword, 10)
        delete values.newPassword;
        values.password = hashedNewPassword

    }


    await db.user.update({
        where: {
            id: user?.id
        },
        data: {
            ...values
        }
    })


    return {
        success: isChangeEmail ? 'e-posta değişikliği için bir doğrulama maili gönderdik' : 'Ayarlar başarıyla değiştirildi'
    }


}