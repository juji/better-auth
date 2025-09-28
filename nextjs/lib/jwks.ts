import * as jose from 'jose'

const key = JSON.parse(process.env.AUTH_SERVER_JWKS || '{}')
const JWKS = jose.createLocalJWKSet({
  keys: [
    key
  ],
})

export function verifyJwt(jwt: string, audience: string) {

  if(!process.env.NEXT_PUBLIC_HONO_SERVER){
    throw new Error("NEXT_PUBLIC_HONO_SERVER is not set")
  }

  return jose.jwtVerify(jwt, JWKS, {
    issuer: process.env.NEXT_PUBLIC_HONO_SERVER,
    audience: audience,
  })

}