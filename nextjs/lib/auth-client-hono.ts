import { createAuthClient } from "better-auth/react"
import { magicLinkClient } from "better-auth/client/plugins";
import { passkeyClient } from "better-auth/client/plugins"
import { multiSessionClient } from "better-auth/client/plugins"
import { jwtClient } from "better-auth/client/plugins"


export const authClient = createAuthClient({
  baseURL: (process.env.NEXT_PUBLIC_HONO_SERVER || "http://localhost:3000") + '/auth',
  plugins: [
    magicLinkClient(),
    passkeyClient(),
    multiSessionClient(),
    jwtClient(),
  ],
  fetchOptions: {
    onSuccess: (ctx) => {
      const authToken = ctx.response.headers.get("set-auth-token") // get the token from the response headers
      const authJWT = ctx.response.headers.get("set-auth-jwt") // get the token from the response headers
      console.log('auth token from headers:', authToken);
      console.log('auth JWT from headers:', authJWT);
      // Store the token securely (e.g., in localStorage)
      ctx.response.headers.entries().forEach(([key, value]) => {
        console.log(`Response header: ${key} = ${value}`);
      });
    }
  }
})

export const {
  useSession,
  getSession,
  signIn,
  signOut,
  signUp,
  resetPassword,
  requestPasswordReset,
  changePassword,
  passkey,
  token,
  multiSession
} = authClient