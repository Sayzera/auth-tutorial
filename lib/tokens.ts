
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { db } from '@/lib/db';

import { v4 as uuidv4} from 'uuid';

export const generateVerificationToken = async (email:string) => {
    const token = uuidv4();
    // 1 saat = 3600 saniye
    // 1 saniye = 1000 milisaniye
    // 3600 * 1000 = 3.600.000

    const now = new Date();
    // türkiye saatine göre ayarla
    now.setHours(now.getHours() + 3)
    const expires = new Date(now.getTime() + 3600 * 1000 ) // token süresi 1 saat olarak milisaniye cinsinden belirlendi


    const existingToken = await getVerificationTokenByEmail(email)

    // Eğer mevcut email adresine bağlı bir token varsa sil 
    if(existingToken) {
        await db.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }

    // ve tokenı tekrar oluştur
    const verificationToken = await db.verificationToken.create({
        data:{
            email,
            token,
            expires
        }
    })


    return verificationToken;



}