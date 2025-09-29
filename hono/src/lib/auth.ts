import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.js";
import { sendEmail } from "./mailer/index.js";

import { magicLink } from "better-auth/plugins";
import { openAPI } from "better-auth/plugins"
import { passkey } from "better-auth/plugins/passkey"
import { multiSession, jwt, bearer } from "better-auth/plugins"

import { 
  users, 
  accounts, 
  verifications, 
  sessions, 
  passkeys,
  jwkss 
} from "./db/schema/auth.js";


export const auth = betterAuth({
  trustedOrigins: process.env.CORS_ORIGINS?.split(",").map(s => s.trim()) || [],
  basePath: "/auth",
  plugins: [
    openAPI(),
    jwt({
      jwt: {
        audience: process.env.JWT_AUDIENCE || 'http://localhost:3000',
      }
    }),
    bearer(),
    passkey(
      {
        rpID: process.env.BETTER_AUTH_PASSKEY_RPID || "localhost",
        rpName: "BetterAuth Demo",
        origin: process.env.BETTER_AUTH_PASSKEY_ORIGIN || "http://localhost:3000",
      }
    ), 
    multiSession(),
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        await sendEmail({
          to: email,
          subject: "Login With Magic Link",
          text: `Click the link to login: ${url}\nToken: ${token}`,
        });
      }
    }),
  ],
  socialProviders: {
    github: { 
      clientId: process.env.GITHUB_CLIENT_ID as string, 
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: { 
      prompt: "select_account", 
      clientId: process.env.GOOGLE_CLIENT_ID as string, 
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite",
    usePlural: true,
    schema: {
      users: users,
      accounts: accounts,
      sessions: sessions,
      verifications: verifications,
      passkeys: passkeys,
      jwkss: jwkss
    },
  }),
  advanced: {
    cookiePrefix: "j-auth-hono", // custom cookie prefix
    crossSubDomainCookies: {
      enabled: true,
      domain: process.env.CROSS_SUBDOMAIN_COOKIE_DOMAIN,
    }
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({user, url}) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your password",
        text: `Click the link to reset your password: ${url}`,
      });
    },
    onPasswordReset: async ({ user }) => {
      // your logic here
      console.log(`Password for user ${user.email} has been reset.`);
    },
  }
});

export type Session = typeof auth.$Infer.Session