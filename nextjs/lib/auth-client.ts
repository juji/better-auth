import { createAuthClient } from "better-auth/client"
import { bearer } from "better-auth/plugins";


export async function getUserSession({ token }: { token: string }) {
  const authClient = createAuthClient({
    baseURL: (process.env.NEXT_PUBLIC_HONO_SERVER || "http://localhost:3001") + '/auth',
    plugins: [
      bearer()
    ],
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