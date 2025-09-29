
import * as jose from 'jose'

const key = JSON.parse(process.env.AUTH_SERVER_JWKS || '{}')
const JWKS = jose.createLocalJWKSet({
  keys: [
    key
  ],
})

export function verifyJwt(jwt: string, audience: string) {

  if(!process.env.AUTH_SERVER){
    throw new Error("AUTH_SERVER is not set")
  }

  return jose.jwtVerify(jwt, JWKS, {
    issuer: process.env.AUTH_SERVER,
    audience: audience,
  })

}