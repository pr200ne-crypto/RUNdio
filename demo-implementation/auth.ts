import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

function isPublicPath(pathname: string) {
  if (pathname.startsWith("/api/auth")) return true;
  if (pathname === "/") return true;
  if (pathname.startsWith("/login")) return true;
  return false;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  trustHost: true,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ request, auth: session }) {
      if (isPublicPath(request.nextUrl.pathname)) return true;
      return !!session?.user;
    },
  },
});
