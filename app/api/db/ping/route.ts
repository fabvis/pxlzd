export const runtime='nodejs'
import { NextResponse } from 'next/server'
import { getPool, getExternalPool } from '@/lib/db'
export async function GET(){try{const [r1]=await (await getPool()).query('SELECT 1 AS ok_modx');const [r2]=await (await getExternalPool()).query('SELECT 1 AS ok_ext');return NextResponse.json({ok:true,modx:r1,ext:r2})}catch(e:any){return NextResponse.json({ok:false,error:e?.message||'ping failed'},{status:500})}}
