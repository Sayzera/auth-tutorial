import NextAuth from "next-auth";
import authConfig from "./auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicRoutes,
} from "@/routes";
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  // Gelen istek apilere mi gidiyor.
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  // Gelen istek public rotalardan birisine mi eşit
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  // Gelen istek private rotalardan birisine mi eşit
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }


  if (isAuthRoute) {
    if (isLoggedIn) {
      /**
       * eğer kullanıcı login olduysa bu ekranlara birdaha girememesi için otomatik olarak yönlendirme yapar.
       */
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  /**
   * Giriş yapmadıysa ve public bir rota değilse çıkışa yönlendir
   */
  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/auth/login", nextUrl));
  }

  return null
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
