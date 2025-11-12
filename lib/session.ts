import crypto from 'crypto'
import { cookies } from 'next/headers'
const COOKIE_NAME='pxlzd_session'
const EXPIRES_MINUTES=60*24*7
function b64url(b:Buffer){return b.toString('base64').replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}
export type SessionPayload={sub:string;iat:number;exp:number}
export function signSession(username:string){
  const secret=process.env.SESSION_SECRET||'dev-insecure-secret-change-me'
  const header=b64url(Buffer.from(JSON.stringify({alg:'HS256',typ:'JWT'})))
  const now=Math.floor(Date.now()/1000)
  const payload:SessionPayload={sub:username,iat:now,exp:now+EXPIRES_MINUTES*60}
  const payloadB64=b64url(Buffer.from(JSON.stringify(payload)))
  const sig=crypto.createHmac('sha256',secret).update(`${header}.${payloadB64}`).digest()
  return `${header}.${payloadB64}.${b64url(sig)}`
}
export function verifySession(token?:string):SessionPayload|null{
  if(!token) return null
  try{
    const secret=process.env.SESSION_SECRET||'dev-insecure-secret-change-me'
    const [h,p,s]=token.split('.')
    const expected=b64url(crypto.createHmac('sha256',secret).update(`${h}.${p}`).digest())
    if(s!==expected) return null
    const payload=JSON.parse(Buffer.from(p.replace(/-/g,'+').replace(/_/g,'/'),'base64').toString('utf8')) as SessionPayload
    if(payload.exp < Math.floor(Date.now()/1000)) return null
    return payload
  }catch{ return null }
}
export function setSessionCookie(token:string){
  const c=cookies(); const maxAge=EXPIRES_MINUTES*60
  c.set(COOKIE_NAME, token, { httpOnly:true, sameSite:'lax', secure:process.env.NODE_ENV==='production', path:'/', maxAge })
}
export function getSession(){ const c=cookies(); const t=c.get(COOKIE_NAME)?.value; return verifySession(t) }
export function clearSession(){ const c=cookies(); c.set(COOKIE_NAME,'',{ httpOnly:true, path:'/', maxAge:0 }) }