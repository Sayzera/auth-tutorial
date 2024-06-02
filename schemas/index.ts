import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Sadece metin girebilirsiniz",
    })
    .email({ message: "Lütfen geçerli bir E posta giriniz." }),
  password: z.string().min(1, {
    message: "Şifre alanı gereklidir.",
  }),
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
