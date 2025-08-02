import { useEffect, useState } from "react";

/**
 * Hook để tránh hydration mismatch trong Next.js
 * Đảm bảo component chỉ render client-side sau khi hydration hoàn tất
 */
export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return hasMounted;
};

/**
 * Hook để check client-side rendering
 */
export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};

export default useHasMounted;
