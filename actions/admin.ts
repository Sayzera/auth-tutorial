'use server';
import { currentRole } from "@/lib/auth";
import { UserRole } from "@prisma/client";


export const admin = async() => {
    const role = await currentRole();

    if(role !== UserRole.ADMIN) {
        return {
            error: 'Yetkisiz erişim!'
        }
    }


    return {
        success: 'Bu içeriği görebilirsiniz.'
    }
}