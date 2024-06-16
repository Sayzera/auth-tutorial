
import { LoginButton } from "@/components/auth/login-btn";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ['latin'],
  weight: ['600']
})

export default function Home() {
  return (
   <main className="flex h-full flex-col items-center justify-center
   bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
    from-sky-400 to-blue-800 select-none
   ">
    <div className="space-y-6 text-center">
      <h1 className={cn('text-6xl font-semibold text-white drop-shadow-md',font.className)}>
       🔐 Auth.js
      </h1>
      <p className="text-white text-lg">
       Auth.js ile oturum yönetimi uygulaması
      </p>
      <div>
       <LoginButton  mode="modal" asChild>
        <Button variant={'secondary'} size={'lg'}>
             Giriş Yap
          </Button>
       </LoginButton>
      </div>
    </div>
   </main>
  );
}
