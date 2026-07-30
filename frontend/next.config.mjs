/** @type {import('next').NextConfig} */

// Detect which build target we're building for.
// Set BUILD_TARGET=firebase in env to generate static export for Firebase Hosting.
// Default (no BUILD_TARGET) = Vercel full-server build with next-auth support.
const isFirebaseBuild = process.env.BUILD_TARGET === "firebase";

const nextConfig = {
  // Static export only when targeting Firebase Hosting
  ...(isFirebaseBuild ? { output: "export" } : {}),

  images: {
    unoptimized: true,
  },
};

export default nextConfig;
