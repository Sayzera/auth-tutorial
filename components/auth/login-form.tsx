"use client";
import { CardWrapper } from "@/components/auth/card-wrapper";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/schemas";
import Link from "next/link";


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-sucess";
import { login } from "@/actions/login";

const LoginForm = () => {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl')
  console.log(callbackUrl, 'callbackUrl')
  const urlError = searchParams.get('error') === 'OAuthAccountNotLinked'
    ? 'Bu e-Posta adresi farklı bir sağlayıcı üzerinden alınmıştır!'
    : '';
  const [showTwoFactor, setShowTwoFactor] = useState<boolean | undefined>(false)
  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>();


  const [isPending, startTranstion] = useTransition();


  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      code: ''
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setSuccess('');
    setError('');


    startTranstion(() => {
      login(values,callbackUrl ?? '')
        .then((data) => {
          setError(data?.error);
          setSuccess(data?.success)
          // form.reset();

          if (data?.twoFactor) {
            setShowTwoFactor(data?.twoFactor)
          }

        })
        .catch(() => {
          setError('Bilinmeye bir hata oldu lütfen daha sonra tekrar deneyiniz')

        })


    });
  }

  // console.log(form.formState.errors , 'form.formState')



  return (
    <CardWrapper
      headerLabel="Hoş geldiniz"
      backButtonLabel="Bir hesabınız yok mu ?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {
            showTwoFactor && (
              <>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Doğrulama Kodu</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            {...field}
                            placeholder="****"
                            className=""
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )
          }

          {
            !showTwoFactor && (
              <>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E Posta</FormLabel>
                        <FormControl>
                          <Input
                            disabled={isPending}
                            {...field}
                            placeholder="sezer.boluk@ornek.com"
                            className=""
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Şifre</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            placeholder="******"
                            type="password"
                            className=""
                          />
                        </FormControl>
                        <Button size={'sm'} variant={'link'}
                          asChild
                          className="px-0 font-normal"
                        >
                          <Link href={'/auth/reset'}>
                            Şifrenizi mi unuttunuz?
                          </Link>
                        </Button>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )
          }


          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            disabled={isPending}
            type="submit" className="w-full">
            {!showTwoFactor ? 'Giriş Yap' : 'İki adımlı doğrulamayı onayla'}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
