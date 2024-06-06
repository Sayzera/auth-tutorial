"use server";

import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields!",
    };
  }

  const { name, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await getUserByEmail(email);

  if(existingUser) {
    return {
        error: 'Bu e-Posta adresi sistemimize daha önceden kayıt edilmiş. Lütfen başka bir e-Posta adresi deneyiniz.'
    }
  }

  await db.user.create({
    data: {
        name,
        email,
        password: hashedPassword
    }
  })

  const verificationToken = await generateVerificationToken(email);

  // TODO: Send verification token email
  await sendVerificationEmail(verificationToken.email, verificationToken.token)

  return {
    success: `Hesabınızın aktif olması için bir onay maili gönderildi.`,
  };
} ;
