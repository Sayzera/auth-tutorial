
'use server'

import { auth } from "@/auth"
import { SettingsForm } from "./_components/settings-form"

const SettingsPage = async () => {
  const session = await auth() ;

  return (
    <SettingsForm user={session?.user } />
  )
}

export default SettingsPage