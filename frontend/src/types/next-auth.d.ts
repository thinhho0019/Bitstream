// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expires?: string;
    user: {
      name?: string;
      email?: string;
      image?: string;
      privider?: string; // 👈 nếu bạn muốn lưu provider
      id_token?: string; // 👈 nếu bạn dùng id_token để gửi về backend
      providerAccountId?: string;
    } & DefaultSession["user"];
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    accessTokenExpires?: number;
    id_token?: string;
    providerAccountId?: string;
    name?: string;
    email?: string;
    image?: string;
    userId?: string;
    privider?: string; // 👈 nếu bạn muốn lưu provider
  }
}
