import { Session } from "../src/lib/auth.ts";

declare global {
  namespace Express {
    interface Request {
      session?: Session; 
    }
  }
}