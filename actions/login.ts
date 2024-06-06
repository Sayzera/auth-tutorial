"use server";
import * as z from "zod";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { LoginSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields!",
    };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if(!existingUser || !existingUser.email || !existingUser.password  ) {
    return {
      error: 'e-Posta adresi bulunamadı.'
    }
  }


  // if(!existingUser.emailVerified) {
  //   const verificationToken = await generateVerificationToken(
  //     existingUser.email
  //   )

  //   return {
  //     success : 'Doğrulama maili gönderildi.'
  //   }
  // }

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
