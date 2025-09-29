
import { createRemoteJWKSet, jwtVerify } from 'jose'

let cachedJWKS: ReturnType<typeof createRemoteJWKSet> | null = null;

export function verifyJwt(jwt: string, audience: string) {

  if(!process.env.AUTH_SERVER){
    throw new Error("AUTH_SERVER is not set")
  }

  if(!cachedJWKS){
    cachedJWKS = createRemoteJWKSet(
      new URL(process.env.AUTH_SERVER + '/auth/jwks')
    )
  }

  return jwtVerify(jwt, cachedJWKS, {
    issuer: process.env.AUTH_SERVER,
    audience: audience,
  })

}