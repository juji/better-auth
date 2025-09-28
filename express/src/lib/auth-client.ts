import { createAuthClient } from "better-auth/client"
import { bearer } from "better-auth/plugins";

export const authClient = createAuthClient({
  baseURL: (process.env.AUTH_SERVER || "http://localhost:3001") + '/auth',
  plugins: [
    bearer() 
  ]
})

export async function getUserSession({ token }: { token: string }) {
  const authClient = createAuthClient({
    baseURL: (process.env.AUTH_SERVER || "http://localhost:3001") + '/auth',
    fetchOptions: {
      auth: {
        type:"Bearer",
        token: token
      }
    }
  })

  const { data: session, error } = await authClient.getSession()
  return { session, error }
}