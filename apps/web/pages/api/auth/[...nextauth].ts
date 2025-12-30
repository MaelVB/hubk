import NextAuth, { type NextAuthOptions } from "next-auth";
import OIDCProvider from "next-auth/providers/oauth";

const issuer = process.env.OIDC_ISSUER ?? "";

export const authOptions: NextAuthOptions = {
  providers: [
    OIDCProvider({
      id: "oidc",
      name: "OIDC",
      type: "oauth",
      wellKnown: `${issuer.replace(/\/$/, "")}/.well-known/openid-configuration`,
      clientId: process.env.OIDC_CLIENT_ID ?? "",
      clientSecret: process.env.OIDC_CLIENT_SECRET ?? "",
      authorization: {
        params: {
          scope: process.env.OIDC_SCOPES ?? "openid profile email"
        }
      },
      idToken: true,
      checks: ["pkce", "state"],
      profile(profile) {
        return {
          id: String(profile.sub ?? ""),
          name: typeof profile.name === "string" ? profile.name : null,
          email: typeof profile.email === "string" ? profile.email : null
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string | undefined;
      return session;
    }
  }
};

export default NextAuth(authOptions);
