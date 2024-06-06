
import { db } from '@/lib/db';



export const getVerificationTokenByEmail = async (email:string) => {
 try {
   const verificationToken = await db.verificationToken.findFirst({
      where:{
        email
      }
   })
}catch {
    return null
 }
}