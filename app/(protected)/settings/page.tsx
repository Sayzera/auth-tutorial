'use client';

import { useTransition, useState } from "react";

import { CiSettings } from "react-icons/ci";

import * as z from 'zod'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';


import { useCurrentUser } from "@/hooks/session";
import { settings } from "@/actions/settings";
import { useSession } from "next-auth/react";


import {
  Button
} from '@/components/ui/button'
import {
  Card,
  CardHeader,
  CardContent
} from '@/components/ui/card'
import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { SettingsSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-sucess";

const SettingsPage = () => {
  const { update } = useSession();
  const user = useCurrentUser();
  const [success, setSuccess] = useState<string | undefined>('');
  const [errror, setError] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      name: user?.name || ''
    }
  })

  const onSubmit = (values: z.infer<typeof SettingsSchema>) => {

    startTransition(() => {
      settings(values).then((data) => {
        if (data?.error) {
          setError(data.error)
        }

        if (data?.success) {
          update();
          setSuccess(data.success);
        }
      })
    })

  }


  if (!user) {
    return <div>Loading...</div>
  }

  console.log(user, 'usrer')

  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="text-2xl font-semibold w-full flex items-center justify-center space-x-2 ">
          <CiSettings className="h-8 w-8" />
          <span> Ayarlar</span>
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <FormError message={errror} />
          <FormSuccess message={success} />
          <form onSubmit={form.handleSubmit(onSubmit)} 
           className="space-y-6"
          >
           <div className="space-y-4">
           <FormField
               name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ad</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} 
                    placeholder="Sezer Bölük"
                    />
                  </FormControl>
                </FormItem>
              )}

            />



           </div>
           <Button type="submit" disabled={isPending}>
              Kaydet
           </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SettingsPage;


