import { newPassword } from "@/actions/new-password";
import { UserRole } from "@prisma/client";
import * as z from "zod";

export const SettingsSchema = z.object({
  name: z.optional(z.string()),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.enum([UserRole.ADMIN, UserRole.USER]),
  email: z.optional(z.string().email({
    message: 'Lütfen geçerli bir e-Posta adresi giriniz'
  })),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6))
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false
    }

    return true;

  }, {
    message: 'Yeni şifre gereklidir',
    path: ['newPassword']
  })
  .refine((data) => {
    if (!data.password && data.newPassword) {
      return false
    }

    return true;

  }, {
    message: 'Şifre gereklidir',
    path: ['password']
  })

export const NewPasswordSchema = z
  .object({
    password: z.string().min(6, { message: "En az 6 karekter giriniz." }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Şifreleniz eşleşmiyor",
    path: ["confirm"],
  });

export const ResetSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Sadece metin girebilirsiniz",
    })
    .email({ message: "Lütfen geçerli bir E posta giriniz." }),
});

export const LoginSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Sadece metin girebilirsiniz",
    })
    .email({ message: "Lütfen geçerli bir E posta giriniz." }),
  password: z.string().min(1, {
    message: "Şifre alanı gereklidir.",
  }),
  code: z.optional(z.string())
});

export const RegisterSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Sadece metin girebilirsiniz",
    })
    .email({ message: "Lütfen geçerli bir E posta giriniz." }),
  password: z.string().min(6, {
    message: "Şifre alanı en az 6 karakter olmalıdır.",
  }),
  name: z.string().min(1, {
    message: "İsim alanı gereklidir.",
  }),
});
