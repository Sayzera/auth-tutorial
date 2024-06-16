import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const currentUser= async () => {
    const session = await auth();

    // revalidatePath('/')
    revalidatePath('/settings')

    return session?.user;
}

export const currentRole= async () => {
    const session = await auth();


    return session?.user?.role;
}