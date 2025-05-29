import { withAuth } from "next-auth/middleware";
import type { NextRequest } from "next/server";
import type { JWT } from "next-auth/jwt";

export default withAuth({
  callbacks: {
    authorized({ token, req }: { token: JWT | null; req: NextRequest }) {
      const { pathname } = req.nextUrl;

      // 1. SUPERADMIN can hit *any* /api/* endpoint
      if (token?.role === "SUPERADMIN") {
        return true;
      }

      // 2. PRODUCTMANAGER can only hit /api/protected/products/*
      if (
        token?.role === "PRODUCTMANAGER" &&
        pathname.startsWith("/api/protected/products/")
      ) {
        return true;
      }

      // 3. everyone else (including USER) is denied
      return false;
    },
  },
});

// apply to all /api routes
export const config = {
  matcher: ["/api/protected/:path*"],
};
