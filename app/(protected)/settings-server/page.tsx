
'use server'

import { auth } from "@/auth"
import { SettingsForm } from "./_components/settings-form"
import { revalidatePath } from "next/cache"
import { ExtendedUser } from "@/types/next-auth"

revalidatePath('/settings-server')
const SettingsPage = async () => {
  const session = await auth() ;

  return (
    <SettingsForm user={session?.user } />
  )
}

export default SettingsPage