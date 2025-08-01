import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, UserProfileFormData } from "@/types";
import UserService from "@/services/userService";

export const useAuth = () => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (session?.user?.email) {
          const userData = await UserService.getCurrentUser();
          setUser(userData);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch user data"
        );
      } finally {
        setLoading(false);
      }
    };

    if (status === "authenticated") {
      fetchUser();
    } else if (status === "unauthenticated") {
      setUser(null);
      setLoading(false);
    }
  }, [session, status]);

  const updateUser = async (data: UserProfileFormData) => {
    if (!user) return;

    try {
      const updatedUser = await UserService.updateProfile(user.id, data);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
      throw err;
    }
  };

  const updateLanguage = async (language: string) => {
    if (!user) return;

    try {
      await UserService.updateLanguage(user.id, language);
      setUser((prev) =>
        prev ? { ...prev, languagePreference: language } : null
      );
      localStorage.setItem("language", language);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update language"
      );
      throw err;
    }
  };

  return {
    user,
    loading: loading || status === "loading",
    error,
    isAuthenticated: !!user && status === "authenticated",
    session,
    updateUser,
    updateLanguage,
  };
};
