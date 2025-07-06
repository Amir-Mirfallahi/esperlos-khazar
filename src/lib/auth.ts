import NextAuth from "next-auth";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "@/utils/users";

// Extend the default session and JWT types
declare module "next-auth" {
  interface User {
    id: string;
    role: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "ایمیل", type: "email" },
        password: { label: "رمز عبور", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("لطفا ایمیل و رمز عبور را وارد کنید");
        }

        const user = await getUserByEmail(credentials.email);

        if (!user) {
          throw new Error("نام کاربری یا رمز عبور اشتباه است.");
        }

        console.log(credentials.password);
        console.log(user.password);

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        console.log(isPasswordValid);

        if (!isPasswordValid) {
          throw new Error("نام کاربری یا رمز عبور اشتباه است.");
        }

        return {
          id: String(user.id),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Export auth, signIn, signOut for use in application
export const { auth, signIn, signOut } = NextAuth(authOptions);

// Export handlers with GET and POST methods for API route
const handler = NextAuth(authOptions);
export const handlers = { GET: handler, POST: handler };
