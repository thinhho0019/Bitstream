import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_API_URL: "http://127.0.0.1:8000/api",
    GOOGLE_CLIENT_ID: "741760352096-ui9gn41e1djmee76bcls7o275a6g09d4.apps.googleusercontent.com",
    GOOGLE_CLIENT_SECRET: "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",
    NEXTAUTH_SECRET: "7f8f3a1ddfc9604a76e3784e769c7fc0bbad1d661f4ec6c70c57b26717d5b1d9",
    NEXTAUTH_URL: "http://localhost:3000"
  }
};

export default nextConfig;
