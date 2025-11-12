import crypto from 'crypto'
import { cookies } from 'next/headers'
import type { ResponseCookies } from 'next/dist/server/web/spec-extension/cookies'
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
type CookieJar=Pick<ResponseCookies,'set'>
type CookieOptions=NonNullable<Parameters<ResponseCookies['set']>[2]>
const BASE_COOKIE_OPTIONS:Omit<CookieOptions,'maxAge'>={
  httpOnly:true,
  sameSite:'lax',
  secure:process.env.NODE_ENV==='production',
  path:'/'
}
function withMaxAge(maxAge:number):CookieOptions{
  return { ...BASE_COOKIE_OPTIONS, maxAge }
}
export function setSessionCookie(jar:CookieJar, token:string){
  jar.set(COOKIE_NAME, token, withMaxAge(EXPIRES_MINUTES*60))
}
export async function getSession(){
  const cookieStore=await cookies()
  const token=cookieStore.get(COOKIE_NAME)?.value
  return verifySession(token)
}
export function clearSession(jar:CookieJar){
  jar.set(COOKIE_NAME,'',withMaxAge(0))
}
