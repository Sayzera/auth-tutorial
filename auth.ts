import NextAuth, { AuthError } from "next-auth";
import authConfig from "@/auth.config";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { UserRole } from "@prisma/client";
import { getUserById } from "./data/user";

import { db } from "./lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

// yetki özelle
// export class YetkisizErisim extends AuthError {
//     static type = "YetkisizErisim"
//   }

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    /**
     * Kullanıcı kayıt edildikten sonra çalışır
     */
    async linkAccount({ user }) {
      await db.user.update({
        where: {
          id: user.id,
        },
        data: {
          emailVerified: new Date(),
        },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      console.log(account, user)
      /* Eğer kimlik doğrulama dışında bir giriş varsa direk kabul et
       * Çünkü sistemde tanımlı olan providerlardan bir tanesi ile giriş yapmıştır
       */
      if (account?.provider !== "credentials") return true;

      if (user?.id) {
        const existingUser = await getUserById(user.id);
        if (!existingUser?.emailVerified) return false;

        // TODO: Add 2FA check
        if (existingUser.isTwoFactorEnabled) {
          const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id)
          console.log(twoFactorConfirmation, 'twoFactorConfirmation')
          if (!twoFactorConfirmation) return false

          // Delete two factor confirmation for next sign in
          await db.twoFactorConfirmation.delete({
            where: {
              id: twoFactorConfirmation.id
            }
          })
        }
      }

      return true;
    },

    /**
     * Token objesini manupüle ettiğimizde session methodu üzerinden erişebiliyoruz
     * session değişkenini arayüzdede kullanabiliyoruz.
     */

    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.role = existingUser.role;

      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = token.role as UserRole;
      }

      return session;
    },
    //   async signIn({user}) {
    //     const existingUser = await getUserById(user.id as string);
    //     // custom error
    //     // throw new YetkisizErisim();

    //     if(!existingUser || !existingUser.emailVerified) {
    //         return false
    //     }

    //     return true;
    // },
  },

  session: {
    strategy: "jwt",
  },
  ...authConfig,
});
