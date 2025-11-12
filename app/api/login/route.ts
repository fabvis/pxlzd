export const runtime='nodejs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getPool } from '@/lib/db'
import { verifyModxPassword } from '@/lib/verifyModxPassword'
import { signSession, setSessionCookie } from '@/lib/session'
import { getClientKey, isRateLimited, pushAttempt } from '@/lib/rate'
const schema=z.object({username:z.string().min(1),password:z.string().min(1)})
export async function POST(req:Request){try{const body=await req.json();const {username,password}=schema.parse(body);const ip=req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()||null;const key=getClientKey(username,ip);if(isRateLimited(key))return NextResponse.json({ok:false,message:'Trop de tentatives, réessaie plus tard.'},{status:429});const pool=getPool();const prefix=process.env.MODX_DB_PREFIX||'modx_';const [rows]=await pool.query(`SELECT u.password, u.salt, u.hash_class, u.active FROM \`${prefix}users\` AS u WHERE u.username = ? LIMIT 1`,[username]) as any;if(!rows.length){pushAttempt(key);return NextResponse.json({ok:false,message:'Utilisateur inconnu'},{status:401})}const user=rows[0];if(user.active===0){pushAttempt(key);return NextResponse.json({ok:false,message:'Compte inactif'},{status:403})}const ok=await verifyModxPassword(password,{password:user.password,salt:user.salt,hash_class:user.hash_class});if(!ok){pushAttempt(key);return NextResponse.json({ok:false,message:'Identifiants invalides'},{status:401})}const token=signSession(username);await setSessionCookie(token);return NextResponse.json({ok:true,message:`Connecté: ${username}`})}catch(e:any){console.error('LOGIN_ERROR:',e);const msg=e?.message||'Erreur serveur';return NextResponse.json({ok:false,message:`Erreur serveur: ${msg}`},{status:500})}}
