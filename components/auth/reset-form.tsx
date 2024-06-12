"use client";
import { CardWrapper } from "@/components/auth/card-wrapper";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ResetSchema } from "@/schemas";


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
import { reset } from "@/actions/reset";

const ResetForm = () => {

  const [error, setError] = useState<string | undefined>('');
  const [success, setSuccess] = useState<string | undefined>();


  const [isPending, startTranstion] = useTransition();


  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setSuccess('');
    setError('');


    startTranstion(() => {
      reset(values)
        .then((data) => {
          setError(data?.error);
          // TODO: Add when we add 2FA
          
          setSuccess(data?.success)
        })
  });
}


  return (
    <CardWrapper
      headerLabel="Şifrenizi mi unuttunuz?"
      backButtonLabel='Giriş ekranına dön'
      backButtonHref="/auth/login"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        
          <FormError message={error} />
          <FormSuccess message={success}/>
          <Button
          disabled={isPending}
          type="submit" className="w-full">
            Şifre sıfırlama e-Postası gönderiniz
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetForm;
