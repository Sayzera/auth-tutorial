'use client';

import { UserInfo } from "@/components/user-info";
import { useCurrentUser } from "@/hooks/session";
import { ExtendedUser } from "@/types/next-auth";

const ClientPage =  () => {
    const user = useCurrentUser(); 

    return (
        <UserInfo 
        label="Client Component"
        user={user as ExtendedUser}
        />
     )
}
 
export default ClientPage;