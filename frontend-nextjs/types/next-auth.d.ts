import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      provider: string;
    } & DefaultSession["user"];
    accessToken?: string;
  }

  interface User extends DefaultUser {
    role?: string;
    provider?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    userId?: string;
    role?: string;
    provider?: string;
    providerAccountId?: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

// Smart Cooking AI User Types
export interface SmartCookingUser {
  id: string;
  email: string;
  name: string;
  image?: string;
  role: "USER" | "CHEF" | "ADMIN";
  provider: "GOOGLE" | "LOCAL";
  providerId?: string;
  languagePreference: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  // Location data
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  regionPreference?: string;
}

export interface AuthContextType {
  user: SmartCookingUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: () => void;
  signOut: () => void;
  updateProfile: (data: Partial<SmartCookingUser>) => Promise<void>;
}
