import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
export function middleware(req:NextRequest){ const url=req.nextUrl; if(url.pathname.startsWith('/dashboard')){ const token=req.cookies.get('pxlzd_session')?.value; if(!token){ url.pathname='/'; return NextResponse.redirect(url) } } return NextResponse.next() }
export const config={ matcher:['/dashboard'] }
