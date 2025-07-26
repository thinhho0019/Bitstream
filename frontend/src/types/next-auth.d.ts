// types/next-auth.d.ts
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    expires?: string;
    provider?: string; // 👈 nếu bạn muốn lưu provider
    user: {
      name?: string;
      email?: string;
      image?: string;
      privider?: string; // 👈 nếu bạn muốn lưu provider
      id_token?: string; // 👈 nếu bạn dùng id_token để gửi về backend
      providerAccountId?: string;
      account_id?: string; // 👈 nếu bạn muốn lưu account_id
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
    picture?: string;
    image?: string;
    userId?: string;
    provider?: string; // 👈 nếu bạn muốn lưu provider
  }
}
