import { auth } from "../lib/auth.js";
import type { Request, Response, NextFunction } from "express";

export async function authMiddleware(req: Request, res: Response, next: NextFunction){
  const session = await auth.api.getSession({
    headers: new Headers(Object.entries(req.headers).filter(([k, v]) => typeof v === "string") as [string, string][])
  })

  if(!session){
    return res.status(401).json({ error: "Unauthorized" });
  }

  req.session = session; // attach session to request object

  next();
}