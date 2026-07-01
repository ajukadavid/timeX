import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/why-timex",
        destination: "/why-logasiko",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
