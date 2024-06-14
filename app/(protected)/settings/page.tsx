'use client';
import { logout } from "@/actions/logout";
import { useCurrentUser } from "@/hooks/session";
import { signOut  } from "next-auth/react";
const SettingsPage =  () => {

const user  = useCurrentUser()
  const onClick = () => {
   logout()
  }


if(!user) {
  return <div>Loading...</div>
}

  return (
    <div className="bg-white p-10 rounded-xl">
      <button 
        onClick={onClick}
      >Sign Out</button>
    </div>
  );
};

export default SettingsPage;


