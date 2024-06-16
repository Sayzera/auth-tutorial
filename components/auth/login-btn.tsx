"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import LoginForm from "./login-form";
import { useEffect, useState } from "react";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const [mounted, setMounted] = useState(true);
  const router = useRouter();


  useEffect(() => {
    setMounted(false)
  }, [])


  if (mounted) return null

  const onClick = () => {
    router.push('/auth/login')
  };

  if (mode == "modal") {
    return <div>
      <Dialog>
        <DialogTrigger asChild={asChild}>
          {children}
        </DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <LoginForm />
        </DialogContent>
      </Dialog>
    </div>;
  }
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};
