import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import argon2 from 'argon2'
export type HashRow={password:string; salt:string|null; hash_class:string|null}
function isBcrypt(h:string){return h.startsWith('$2a$')||h.startsWith('$2y$')||h.startsWith('$2b$')}
function isArgon2(h:string){return h.startsWith('$argon2')}
export async function verifyModxPassword(candidate:string,row:HashRow):Promise<boolean>{
  const hash=row.password||''; const salt=row.salt||''; const cls=(row.hash_class||'').toLowerCase()
  if(isBcrypt(hash)) return bcrypt.compare(candidate,hash)
  if(isArgon2(hash)){ try{ return await argon2.verify(hash,candidate) }catch{ return false } }
  if(cls.includes('pbkdf2')){
    const it=Number(process.env.MODX_PBKDF2_ITERATIONS||1000), keylen=Number(process.env.MODX_PBKDF2_KEYLEN||32)
    const digest=(process.env.MODX_PBKDF2_DIGEST||'sha256') as 'sha256'|'sha1'
    const derived=crypto.pbkdf2Sync(candidate, Buffer.from(salt,'hex'), it, keylen, digest)
    return crypto.timingSafeEqual(Buffer.from(derived.toString('base64')), Buffer.from(hash))
  }
  if(cls.includes('modmd5') || /^[a-f0-9]{32}$/i.test(hash)){
    const md5=crypto.createHash('md5').update(candidate).digest('hex')
    return crypto.timingSafeEqual(Buffer.from(md5), Buffer.from(hash))
  }
  if(salt){ try{
      const it=Number(process.env.MODX_PBKDF2_ITERATIONS||1000), keylen=Number(process.env.MODX_PBKDF2_KEYLEN||32)
      const digest=(process.env.MODX_PBKDF2_DIGEST||'sha256') as 'sha256'|'sha1'
      const derived=crypto.pbkdf2Sync(candidate, Buffer.from(salt,'hex'), it, keylen, digest)
      return derived.toString('base64')===hash
    }catch{ return false } }
  return false
}