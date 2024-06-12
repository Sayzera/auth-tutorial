"use client";
import { CardWrapper } from "@/components/auth/card-wrapper";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { NewPasswordSchema } from "@/schemas";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-sucess";
import { newPassword } from "@/actions/new-password";

const NewPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token')
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>();

  const [isPending, startTranstion] = useTransition();

  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setSuccess("");
    setError("");

    startTranstion(() => {
      newPassword(values, token).then((data) => {
        setError(data?.error);
        // TODO: Add when we add 2FA

        setSuccess(data?.success);
      });
    });
  };

  return (
    <CardWrapper
      headerLabel="Yeni şifrenizi giriniz"
      backButtonLabel="Giriş ekranına dön"
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Şifre</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      type="password"
                      placeholder="*******"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tekrar Şifre</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      {...field}
                      type="password"
                      placeholder="*******"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />
          <Button disabled={isPending} type="submit" className="w-full">
          Şifremi Değiştir
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default NewPasswordForm;
