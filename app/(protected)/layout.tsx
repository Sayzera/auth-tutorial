// import { Navbar } from "@/app/(protected)/_components/navbar";
'use client'
import { useCurrentUser } from '@/hooks/session';
import { Navbar } from './_components/navbar'

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  const user = useCurrentUser();

  if(!user) {
    return (
      <div>
        Yükleniyor
      </div>
    )
  }

  
  return (
    <div
      className="h-full w-full flex flex-col gap-y-10 items-center justify-center 
        bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
    from-sky-400 to-blue-800
  "
    >
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
