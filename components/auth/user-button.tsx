"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "@/components/auth/logout-btn";

import { useCurrentUser } from "@/hooks/session";

import {ExitIcon} from '@radix-ui/react-icons'
import { FaUser } from "react-icons/fa";




export const UserButton = () => {
    const user = useCurrentUser()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image ?? ''} />
          <AvatarFallback className="bg-sky-500">
            <FaUser className="text-white" />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-40" align="end">
        <LogoutButton>
            <DropdownMenuItem>
                <ExitIcon className="h-4 w-4 mr-2"/>
                Çıkış Yap
            </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
