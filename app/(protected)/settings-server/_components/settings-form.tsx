'use client';

import { useTransition, useState, useEffect } from "react";

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
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import {

  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem
} from '@/components/ui/select'
import { SettingsSchema } from "@/schemas";
import { Input } from "@/components/ui/input";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-sucess";
import { UserRole } from "@prisma/client";
import { Switch } from "@/components/ui/switch";
import { ExtendedUser } from "@/types/next-auth";

export const SettingsForm = ({
    user
}: ExtendedUser) => {
  const { update } = useSession();
  const [success, setSuccess] = useState<string | undefined>('');
  const [errror, setError] = useState<string | undefined>('');

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof SettingsSchema>>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      password: undefined,
      newPassword: undefined,
      name: user?.name || '',
      email: user?.email || '',
      role: user?.role as UserRole,
      isTwoFactorEnabled: user.isTwoFactorEnabled

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
                    <FormMessage />

                  </FormItem>
                )}

              />
              {
                user?.isOAuth === false && (
<>
<FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>e-Posta</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending}
                        type="email"
                        placeholder="white.code.text@gmail.com"
                      />
                    </FormControl>
                    <FormMessage />

                  </FormItem>
                )}

              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Şifre</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending}
                        type="password"
                        placeholder="******"
                      />
                    </FormControl>
                    <FormMessage />

                  </FormItem>
                )}

              />

              <FormField
                name="newPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Yeni Şifre</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending}
                        type="password"
                        placeholder="******"
                      />
                    </FormControl>
                    <FormMessage />

                  </FormItem>
                )}

              />
</>
                )
              }


              <FormField
                name="role"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select
                      disabled={isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Rol seçiniz"></SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={UserRole.ADMIN}>
                          Admin
                        </SelectItem>
                        <SelectItem value={UserRole.USER}>
                          User
                        </SelectItem>
                      </SelectContent>

                    </Select>
                    <FormMessage />

                  </FormItem>
                )}

              />

              <FormField
                name="isTwoFactorEnabled"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center
                  justify-between rounded-lg border p-3 shadow-sm
                  ">
                    <div className="space-y-0.5">
                      <FormLabel>
                        İki Adımlı Doğrulama
                      </FormLabel>
                      <FormDescription>
                        Sizin hesabınız için "İki Adımlı Doğrulamayı" aktif eder.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}

              />


            </div>
            <FormError message={errror} />
            <FormSuccess message={success} />

            <Button type="submit" disabled={isPending}>
              Kaydet
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};



