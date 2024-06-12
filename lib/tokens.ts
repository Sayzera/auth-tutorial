
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid';

import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { db } from '@/lib/db';
import { getTwoFactorTokenByEmail } from '@/actions/two-factor-token';


export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    // TODO: Later change to 15 minutes
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getTwoFactorTokenByEmail(email);

    if (existingToken) {
        await db.twoFactrorToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const twoFactorToken = await db.twoFactrorToken.create({
        data:{
            email,
            token,
            expires
        }
    })


    return twoFactorToken;

}

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000)

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    })

    return passwordResetToken;

}


export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();
    // 1 saat = 3600 saniye
    // 1 saniye = 1000 milisaniye
    // 3600 * 1000 = 3.600.000

    const now = new Date();
    // türkiye saatine göre ayarla
    now.setHours(now.getHours() + 3)
    const expires = new Date(now.getTime() + 3600 * 1000) // token süresi 1 saat olarak milisaniye cinsinden belirlendi


    const existingToken = await getVerificationTokenByEmail(email)

    // Eğer mevcut email adresine bağlı bir token varsa sil 
    if (existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    // ve tokenı tekrar oluştur
    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    })


    return verificationToken;



}