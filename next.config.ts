/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Mematikan indikator kecil Next.js di mode development
  // karena error kamu muncul dari handleStaticIndicator
  devIndicators: false,
};

module.exports = nextConfig;