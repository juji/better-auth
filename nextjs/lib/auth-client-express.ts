import { createAuthClient } from "better-auth/react"

export const {
  useSession,
  signIn,
  signOut,
  signUp,
  resetPassword,
  requestPasswordReset,
  changePassword
} = createAuthClient({
  baseURL: (process.env.NEXT_PUBLIC_EXPRESS_SERVER || "http://localhost:3000") + '/auth'
})

