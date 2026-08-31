/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // The whole app is a single prerendered page, so it ships as a plain static
  // site. The host needs no Next.js runtime — the `out/` directory can be
  // served by anything, and Vercel picks it up as a static deployment.
  output: "export",

  // Static export has no image optimiser; this app ships no raster art anyway.
  images: { unoptimized: true },

  // Serve /path/ consistently in dev and on the host.
  trailingSlash: true,
};

export default nextConfig;
