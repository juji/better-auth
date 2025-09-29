import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"


export const authClient = createAuthClient({
  baseURL: (process.env.NEXT_PUBLIC_HONO_SERVER || "http://localhost:3000") + '/auth',
  plugins: [
    // magicLinkClient(),
    // passkeyClient(),
    // multiSessionClient(),
    jwtClient(),
  ],
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
  // passkey,
  token,
  // multiSession
} = authClient