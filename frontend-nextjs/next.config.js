/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config.js");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Use i18n from next-i18next config
  i18n,

  // Image configuration
  images: {
    domains: [
      "localhost",
      "lh3.googleusercontent.com",
      "firebasestorage.googleapis.com",
      "storage.googleapis.com",
      "images.unsplash.com",
      "via.placeholder.com",
    ],
    formats: ["image/webp", "image/avif"],
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080",
    NEXT_PUBLIC_AI_SERVICE_URL:
      process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:5000",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
    NEXTAUTH_SECRET:
      process.env.NEXTAUTH_SECRET ||
      "smart-cooking-ai-development-secret-key-2024",
  },

  // API rewrites for backend integration
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    const aiServiceUrl =
      process.env.NEXT_PUBLIC_AI_SERVICE_URL || "http://localhost:5000";

    return [
      {
        source: "/api/backend/:path*",
        destination: `${apiUrl}/api/:path*`,
      },
      {
        source: "/api/ai/:path*",
        destination: `${aiServiceUrl}/api/ai/:path*`,
      },
    ];
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
