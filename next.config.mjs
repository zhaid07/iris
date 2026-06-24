/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          destination: "/landing.html",
        },
        {
          source: "/privacy",
          destination: "/privacy.html",
        },
      ],
    };
  },
};

export default nextConfig;
