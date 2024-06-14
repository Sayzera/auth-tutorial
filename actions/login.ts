"use server";
import * as z from "zod";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { generateTwoFactorToken } from '@/lib/tokens';
import { getTwoFactorTokenByEmail } from "@/actions/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields!",
    };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return {
      error: 'e-Posta adresi bulunamadı.'
    }
  }


  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    )

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    )

    return {
      success: 'Doğrulama maili gönderildi.'
    }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if(code) {
      // TODO: Verify code
      const twoFactorToken = await getTwoFactorTokenByEmail(
        existingUser.email
      )

      if(!twoFactorToken) {
        return {
          error: 'Geçersiz kod!'
        }
      }

      if(twoFactorToken.token !== code) {
          return {
            error: 'Geçersiz kod!'
          }
      }
      
      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      if(hasExpired) {
        return {
          error: 'Girilen kodunun süresi geçersiz!'
        }
      }

      await db.twoFactrorToken.delete({
         where: {
           id: twoFactorToken.id
         }
      })

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)

      if(existingConfirmation) {
          await db.twoFactorConfirmation.delete({
            where : {
              id: existingConfirmation.id
            }
          })
      }

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id
        }
      })

      
    } else {

      const twoFactorToken = await generateTwoFactorToken(email)

      await sendTwoFactorTokenEmail(email, twoFactorToken.token)
  
      return {
        twoFactor: true
      }
    }
 

  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });


    return { 
      success: "Başarıyla giriş yapıldı",
    };
  } catch (error) {
    if (error instanceof AuthError) {

      // if(error.type === 'YetkisizErisim') {
      //   return {
      //     error: "Hesabınız onaylanmayı bekliyor222",
      //   };
      // }

      switch (error.type) {
        case "CallbackRouteError":
          return {
            error: "Geçersiz kimlik bilgisi.",
          };
        case "CredentialsSignin":
          return {
            error: "Geçersiz kimlik bilgisi.",
          };
        case "AccessDenied":
          return {
            error: "Hesabınız onaylanmayı bekliyor",
          };

        default:
          return {
            error: "Bilinmeyen bir hata oluştu.",
          };
      }
    }
    throw error;
  }
};
