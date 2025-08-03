/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Tắt strict mode để tránh hydration errors

  // Clean experimental config
  experimental: {
    esmExternals: false,
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Custom webpack config để optimize hydration
  webpack: (config, { dev, isServer }) => {
    // Disable SSR warnings
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }

    return config;
  },

  // Environment variables untuk tắt warnings
  env: {
    NEXT_PUBLIC_DISABLE_HYDRATION_WARNING: "true",
  },
};

module.exports = nextConfig;
