"use server";

import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import bcrypt from "bcrypt";
import * as z from "zod";

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

  // TODO: Send verification token email


  return {
    success: "Kullanıcı başarıyla oluşturuldu.",
  };
};
