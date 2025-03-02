import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"

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
          where: {
            email: credentials.email,
          },
          include: {
            accounts: true,  // Include the accounts to check auth providers
          }
        })

        if (!user) {
          return null
        }

        // Check if this user has a Google account
        const hasGoogleAccount = user.accounts?.some(
          account => account.provider === "google"
        )

        // If user originally signed up with Google and has no valid password
        if (hasGoogleAccount) {
          throw new Error("Please sign in with Google for this account")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30, // 30 days
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
  
        try {
          // Check if user exists
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          })
  
          if (!existingUser) {
            // Create new user if they don't exist
            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "",
                image: user.image || null,
                // Set a placeholder password or null depending on your schema
                password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
              },
            })

            // Now create the account record to track the auth provider
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
              }
            })
          } else if (user.image && (!existingUser.image || existingUser.image !== user.image)) {
            // Update existing user's image if it changed or wasn't set before
            await prisma.user.update({
              where: { email: user.email },
              data: { image: user.image }
            })
            
            // Check if an account record already exists
            const existingAccount = await prisma.account.findFirst({
              where: {
                userId: existingUser.id,
                provider: account.provider,
              }
            })
            
            // Create account record if it doesn't exist
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
                }
              })
            }
          }
          return true
        } catch (error) {
          console.error("Error in signIn callback:", error)
          return false
        }
      }
      return true
    },
    async redirect({ url, baseUrl }) {
      // Handle the URLs based on your routing structure
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
        }
      }

      // If the token hasn't expired, return it
      if (Date.now() < (typeof token.exp === 'number' ? token.exp : 0) * 1000) {
        return token
      }

      // Otherwise, refresh the token
      try {
        return {
          ...token,
          exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
        }
      } catch (error) {
        console.error("Error refreshing access token:", error)
        return { ...token, error: "RefreshAccessTokenError" }
      }
    },
    session: ({ session, token }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
        },
      }
    },
  },
}