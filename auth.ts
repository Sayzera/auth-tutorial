import NextAuth, { AuthError } from "next-auth";
import authConfig from "@/auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import { getUserById } from "./data/user";

import { db } from "./lib/db";

// yetki özelle
// export class YetkisizErisim extends AuthError {
//     static type = "YetkisizErisim"
//   }

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  callbacks: {
    /**
     * Token objesini manupüle ettiğimizde session methodu üzerinden erişebiliyoruz
     * session değişkenini arayüzdede kullanabiliyoruz.
     */
    async signIn({user}) {
        const existingUser = await getUserById(user.id);
        // Giriş yapacak kullanıcı için

        // custom error 

        throw new YetkisizErisim();




        
        if(!existingUser || !existingUser.emailVerified) {
            return false
        }

        return true;
    },
    async jwt({ token }) {
        if(!token.sub) return token

        const existingUser = await getUserById(token.sub)

        if(!existingUser) return token;
        
        token.role = existingUser.role;
        
        return token;
    },
    async session({ token, session }) {

      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
