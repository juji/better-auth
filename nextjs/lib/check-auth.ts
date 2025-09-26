import { auth, type Session } from "@/lib/auth"; // path to your Better Auth server instance
import { headers } from "next/headers";


export async function checkAuth(fn: ( session: Session ) => Promise<Response> | Response) {

  const reqHeaders = await headers();
  const session = await auth.api.getSession({ headers: reqHeaders });

  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return fn( session );

}