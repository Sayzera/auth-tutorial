'use server';

import { db } from '@/lib/db';
import { getUserByEmail } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verification-token'; 


export const newVerification = async (token:string) => {
    const existingToken = await getVerificationTokenByToken(token);

    // token var mı 
    if(!existingToken) {
        return {
            error: 'Token bulunamadı!'
        }
    }
    // Tokenın süresi dolmuş mu 
    const hasExpired = new Date(existingToken.expires) < new Date();

    if(hasExpired) {
        return {
            error: 'Tokenınızın süresi dolmuştur!'
        }
    }

    // kullanıcı var mı kontrol et
    const existignUser = await getUserByEmail(existingToken.email);

    if(!existignUser) {
        return {
            error: 'Kullanıcı bulunamadı!'
        }
    }

    // kullanıcı durumunu onayla
    await db.user.update({
        where: {
            id: existignUser.id
        },
        data: {
            emailVerified: new Date(),
            email: existingToken.email
        }
    })

    // tokenı sil
    await db.verificationToken.delete({
        where: {
            id: existingToken.id
        }
    })

    return {
        success: 'Doğrulama başarıyla tamamlandı.'
    }



}