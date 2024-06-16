'use client'
import { admin } from '@/actions/admin'
import { RoleGate } from '@/components/auth/role-gate'
import { FormSuccess } from '@/components/form-sucess'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { UserRole } from '@prisma/client'
import React, { useState } from 'react'
import { toast } from 'sonner'

type Props = {
  role: string
}

function AdminComponent({
  role
}: Props) {

  const [success, setSuccess] = useState<string | undefined>('');
  const [error, setError] = useState<string | undefined>('');


  const onApiRouteClick = () => {
    fetch('/api/admin')
      .then((response) => {
        if (response.ok) {
          toast.success('Bu işleme izin verildi')
        } else {
          toast.error('Yetkisiz erişim!')
        }
      })
  }


  const onServerRouteClick =  () => {
      admin()
      .then((data) => {
        setSuccess(data?.success)
        setError(data?.error)

        if(data?.success) {
          toast.success('Bu işleme izin verildi')

        } else if(data?.error) {
          toast.error('Yetkisiz erişim!')
        }
      })
      .catch((error) => {
        console.log(error,'error')
        setError('Bilinmeyen bir hata oluştu!')
        toast.error('Yetkisiz erişim!')
      })
  }


  console.log(success, error)

  return (
    <Card className='w-[600px] shadow-md'>
      <CardHeader>
        <p className='text-2xl font-semibold text-center'>
          Admin
        </p>
        <CardContent className='space-y-4'>
          <RoleGate allowedRole={UserRole.ADMIN}>
            <FormSuccess  message='Bu içeriği görebilirsiniz.'/>
          </RoleGate>
          <div className='flex flex-row items-center justify-between
          rounded-lg border p-3 shadow-md
          '>
            <p> Admin-only API Route</p>

            <Button onClick={onApiRouteClick}>
              Click to test
            </Button>
          </div>

          <div className='flex flex-row items-center justify-between
          rounded-lg border p-3 shadow-md
          '>
            <p> Admin-only Server Action</p>

            <Button onClick={onServerRouteClick}>
              Click to test
            </Button>
          </div>

        </CardContent>
      </CardHeader>
    </Card>
  )
}

export default AdminComponent