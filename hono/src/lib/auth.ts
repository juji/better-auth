import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.js";
import { sendEmail } from "./mailer/index.js";

import { createAuthMiddleware } from "better-auth/api";
import { magicLink } from "better-auth/plugins";
import { openAPI } from "better-auth/plugins"
import { passkey } from "better-auth/plugins/passkey"

import { 
  users, 
  accounts, 
  verifications, 
  sessions, 
  passkeys 
} from "./db/schema/auth.js";


export const auth = betterAuth({
  trustedOrigins: process.env.CORS_ORIGINS?.split(",") || [],
  basePath: "/auth",
  plugins: [
    openAPI(),
    passkey(), 
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
      passkeys: passkeys
    },
  }),
  advanced: {
    cookiePrefix: "j-auth-hono", // custom cookie prefix
    ...process.env.BETTER_AUTH_URL?.startsWith('http://localhost') ? {} : {
      defaultCookieAttributes: {
        sameSite: "none",
        secure: process.env.BETTER_AUTH_URL?.startsWith("https") ? true : false,
        partitioned: true // New browser standards will mandate this for foreign cookies
      }
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