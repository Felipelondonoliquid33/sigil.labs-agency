/** @type {import('next').NextConfig} */
import { fileURLToPath } from "node:url";

const nextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL(".", import.meta.url)),
  distDir: process.env.SIGIL_BUILD_DIR || ".next",
};

export default nextConfig;
