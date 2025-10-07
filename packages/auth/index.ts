import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@repo/db"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getServerSession, NextAuthOptions } from "next-auth"

interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  emailVerified?: boolean;
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Not valid email");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password) throw new Error("No user found");

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) throw new Error("Invalid Password");

        return user as User;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
          token.id = user.id;

          // Check if it's OAuth sign-in
          if (account?.provider === "google" || account?.provider === "github") {
            token.emailVerified = true;
            
            await prisma.user.update({
              where: { id: user.id },
              data: { emailVerified: true }, 
            });
          } else {
            token.emailVerified = !!user.emailVerified;
          }
      } 
      return token;
    },
    async session({ session, token }) {
      if (session.user && token?.id) {
        session.user.id = token.id as string;  
        session.user.emailVerified = !!token.emailVerified;
      }
      return session;
    },
  },
  pages : {
    signIn : "/auth/sign-in",
    error: "/auth/sign-in",
  },
};

export const getCurrentUser = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  return session.user;
};