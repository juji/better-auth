
import { checkAuth } from "@/lib/check-auth";

export async function GET(){

  return await checkAuth(( session ) => Response.json({ message: 42, authSession: session }) );

}