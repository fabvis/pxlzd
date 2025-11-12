export const runtime='nodejs'
import { NextResponse } from 'next/server'
import { clearSession } from '@/lib/session'
export async function POST(){ const response=NextResponse.json({ok:true,message:'Déconnecté'});clearSession(response.cookies);return response }
