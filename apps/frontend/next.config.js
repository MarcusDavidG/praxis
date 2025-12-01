/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@praxis/shared"],
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
};

module.exports = nextConfig;
