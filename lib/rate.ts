type Attempt={ts:number}
const ATTEMPTS=new Map<string,Attempt[]>()
const WINDOW_MS=10*60*1000
const MAX_ATTEMPTS=6
export function getClientKey(u:string,ip?:string|null){return `${u.toLowerCase()}|${ip||'unknown'}`}
export function isRateLimited(k:string){const n=Date.now();const l=(ATTEMPTS.get(k)||[]).filter(a=>n-a.ts<WINDOW_MS);ATTEMPTS.set(k,l);return l.length>=MAX_ATTEMPTS}
export function pushAttempt(k:string){const n=Date.now();const l=ATTEMPTS.get(k)||[];l.push({ts:n});ATTEMPTS.set(k,l)}
