import { DefaultSession } from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

declare module "next-auth" {
  interface User {
    role?: string
    id: string
  }
  interface Session extends DefaultSession {
    user: {
      id: string
      role?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
    id: string
  }
}

const prisma = new PrismaClient()

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { accounts: true },
        })

        if (!user) return null

        // 🚨 Block deleted accounts
        if (user.isDeleted) {
          throw new Error("Account does not exist")
        }

        const hasGoogleAccount = user.accounts?.some(
          (account) => account.provider === "google"
        )
        if (hasGoogleAccount) {
          throw new Error("Please sign in with Google for this account")
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )
        if (!isPasswordValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30,
  },
  pages: {
    signIn: "/log-in",
    error: "/log-in",
    signOut: "/log-in",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false

        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        })

        // 🚨 Block deleted accounts
        if (existingUser?.isDeleted) {
          throw new Error("Account does not exist")
        }

        if (!existingUser) {
          // create new user + account
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "",
              image: user.image || null,
              password: await bcrypt.hash(
                Math.random().toString(36).slice(-8),
                10
              ),
              role: "USER",
            },
          })

          await prisma.account.create({
            data: {
              userId: newUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            },
          })
        } else if (
          user.image &&
          (!existingUser.image || existingUser.image !== user.image)
        ) {
          await prisma.user.update({
            where: { email: user.email },
            data: { image: user.image },
          })

          const existingAccount = await prisma.account.findFirst({
            where: {
              userId: existingUser.id,
              provider: account.provider,
            },
          })

          if (!existingAccount) {
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
                access_token: account.access_token,
                refresh_token: account.refresh_token,
                expires_at: account.expires_at,
                token_type: account.token_type,
                scope: account.scope,
                id_token: account.id_token,
              },
            })
          }
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/admin-dashboard") || url.startsWith("/dashboard")) {
        return url
      }
      if (url.startsWith(baseUrl)) return url
      if (url.startsWith("/")) return `${baseUrl}${url}`
      return baseUrl
    },
    async jwt({ token, user, account }) {
      if (account && user) {
        return {
          ...token,
          accessToken: account.access_token,
          id: user.id,
          role: user.role,
        }
      }
      if (Date.now() < (typeof token.exp === "number" ? token.exp : 0) * 1000) {
        return token
      }
      return {
        ...token,
        exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60,
      }
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          role: token.role,
        },
      }
    },
  },
}
