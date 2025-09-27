import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db/index.js";
import { sendEmail } from "./mailer/index.js";

import { users, accounts, verifications, sessions } from "./db/schema/auth.js";

export const auth = betterAuth({
  trustedOrigins: [process.env.CORS_ORIGIN],
  basePath: "/auth",
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite",
    usePlural: true,
    schema: {
      users: users,
      accounts: accounts,
      sessions: sessions,
      verifications: verifications,
    },
  }),
  advanced: {
    cookiePrefix: "j-auth-express", // custom cookie prefix
    // whether to use cross subdomain cookies
    ...process.env.BETTER_AUTH_URL?.startsWith('http://localhost') ? {} : {
      crossSubDomainCookies: {
        enabled: true,
        domain: process.env.CORS_ORIGIN?.replace('http://', '').replace('https://', ''),
      }
    },
    // ...process.env.BETTER_AUTH_URL?.startsWith('http://localhost') ? {} : {
    //   defaultCookieAttributes: {
    //     sameSite: "none",
    //     httpOnly: true,
    //     secure: process.env.BETTER_AUTH_URL?.startsWith("https") ? true : false,
    //     partitioned: true // New browser standards will mandate this for foreign cookies
    //   }
    // }
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

