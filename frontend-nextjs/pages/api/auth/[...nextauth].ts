import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user",
  },

  callbacks: {
    async jwt({ token, account, profile, user }) {
      // Lưu thông tin user vào JWT token
      if (account && profile) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.role = "USER"; // Default role
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }

      if (user) {
        token.userId = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      // Gửi properties tới client
      if (token && session.user) {
        session.user.id = token.userId as string;
        session.user.role = token.role as string;
        session.user.provider = token.provider as string;
        session.accessToken = token.accessToken as string;
      }

      return session;
    },

    async signIn({ user, account, profile, email, credentials }) {
      // Kiểm tra và xử lý đăng nhập
      console.log("🔐 Sign in attempt:", {
        user: user?.email,
        provider: account?.provider,
      });

      // Có thể call API backend để lưu user info
      if (account?.provider === "google" && user?.email) {
        try {
          // Call backend API để tạo/update user
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google-login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: user.email,
                name: user.name,
                image: user.image,
                providerId: account.providerAccountId,
                provider: "GOOGLE",
              }),
            }
          );

          if (response.ok) {
            const userData = await response.json();
            console.log("✅ User synced with backend:", userData);
          }
        } catch (error) {
          console.error("❌ Failed to sync user with backend:", error);
          // Vẫn cho phép đăng nhập dù backend lỗi
        }
      }

      return true;
    },

    async redirect({ url, baseUrl }) {
      // Chuyển hướng sau khi đăng nhập
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return `${baseUrl}/dashboard`;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("🎯 User signed in:", {
        email: user.email,
        isNewUser,
        provider: account?.provider,
      });
    },
    async signOut({ token, session }) {
      console.log("👋 User signed out:", token?.email);
    },
    async createUser({ user }) {
      console.log("👤 New user created:", user.email);
    },
    async session({ session, token }) {
      // Log session activity for analytics
      console.log("📊 Session accessed:", session.user?.email);
    },
  },

  debug: process.env.NODE_ENV === "development",

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
