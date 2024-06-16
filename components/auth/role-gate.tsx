'use client';

import { UserRole } from "@prisma/client";


import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "@/components/form-error";

interface RoleGateProps {
    children: React.ReactNode;
    allowedRole:UserRole

}

export const RoleGate = ({
    children,
    allowedRole
}: RoleGateProps) => {
    const role = useCurrentRole();

    if(!role) {
        return (
            <div>Kontrol ediliyor...</div>
        )
    }

    if(role !== allowedRole) {
        return (
            <FormError message="Sizin bu içeriği görebilme yetkiniz bulunmamaktadır." />
        )
    }

    return children
}   