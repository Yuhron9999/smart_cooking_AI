/**
 * Hydration Fix Utilities for Smart Cooking AI
 * Giải quyết các vấn đề hydration mismatch phổ biến
 */

import { useEffect, useState } from "react";

/**
 * Hook để tránh hydration mismatch với localStorage
 */
export const useLocalStorage = (key: string, initialValue: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: any) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};

/**
 * Hook để kiểm tra device type mà không gây hydration mismatch
 */
export const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<"mobile" | "tablet" | "desktop">(
    "desktop"
  );

  useEffect(() => {
    const checkDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType("mobile");
      } else if (width < 1024) {
        setDeviceType("tablet");
      } else {
        setDeviceType("desktop");
      }
    };

    checkDeviceType();
    window.addEventListener("resize", checkDeviceType);
    return () => window.removeEventListener("resize", checkDeviceType);
  }, []);

  return deviceType;
};

/**
 * Safe date formatter để tránh timezone mismatch
 */
export const formatDateSafe = (date: Date | string): string => {
  if (typeof window === "undefined") {
    // Server-side: return ISO string
    return new Date(date).toISOString().split("T")[0];
  }

  // Client-side: return localized format
  return new Date(date).toLocaleDateString("vi-VN");
};

/**
 * Safe number formatter với locale detection
 */
export const formatNumberSafe = (
  num: number,
  options?: {
    style?: "decimal" | "currency" | "percent";
    minimumFractions?: number;
    maximumFractions?: number;
  }
): string => {
  if (typeof window === "undefined") {
    // Server-side: simple format
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(0) + "K";
    }
    return num.toString();
  }

  // Client-side: use Intl
  try {
    return new Intl.NumberFormat("vi-VN", {
      style: options?.style || "decimal",
      minimumFractionDigits: options?.minimumFractions || 0,
      maximumFractionDigits: options?.maximumFractions || 1,
    }).format(num);
  } catch (error) {
    // Fallback
    return num.toLocaleString();
  }
};

/**
 * Theme detection hook that prevents hydration issues
 */
export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    setTheme(savedTheme || (prefersDark ? "dark" : "light"));
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return { theme, toggleTheme };
};

/**
 * Scroll position hook that's SSR-safe
 */
export const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return scrollY;
};

export default {
  useLocalStorage,
  useDeviceType,
  formatDateSafe,
  formatNumberSafe,
  useTheme,
  useScrollPosition,
};
