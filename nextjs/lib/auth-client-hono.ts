import { createAuthClient } from "better-auth/react"
import { magicLinkClient } from "better-auth/client/plugins";
import { passkeyClient } from "better-auth/client/plugins"
import { multiSessionClient } from "better-auth/client/plugins"
import { jwtClient } from "better-auth/client/plugins"
import { organizationClient } from "better-auth/client/plugins"


export const authClient = createAuthClient({
  baseURL: (process.env.NEXT_PUBLIC_HONO_SERVER || "http://localhost:3000") + '/auth',
  plugins: [
    magicLinkClient(),
    passkeyClient(),
    multiSessionClient(),
    jwtClient(),
    organizationClient(),
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
  passkey,
  token,
  multiSession
} = authClient