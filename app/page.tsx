'use client'
import { useState } from 'react'
export default function HomePage(){
  const [username,setUsername]=useState(''); const [password,setPassword]=useState('')
  const [status,setStatus]=useState<null|{ok:boolean;message:string}>(null); const [loading,setLoading]=useState(false)
  async function onSubmit(e:React.FormEvent){ e.preventDefault(); setLoading(true); setStatus(null)
    try{
      const res=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password})})
      const data=await res.json(); setStatus({ok:data.ok,message:data.message}); if(data.ok) setTimeout(()=>location.href='/dashboard',300)
    }catch{ setStatus({ok:false,message:'Erreur réseau'}) } finally{ setLoading(false) }
  }
  return(<div className='main-wrap'><div className='card callout secondary'>
    <h1><i className='bi bi-controller'></i> Pixelized — Connexion</h1>
    <form onSubmit={onSubmit}>
      <label>Identifiant<input type='text' value={username} onChange={e=>setUsername(e.target.value)} placeholder='Ton login MODX' required/></label>
      <label>Mot de passe<input type='password' value={password} onChange={e=>setPassword(e.target.value)} placeholder='••••••••' required/></label>
      <button className='button expanded btn-primary' type='submit' disabled={loading}>{loading?'Vérification…':'Connexion'}</button>
    </form>
    {status && (<div className={`status ${status.ok?'ok':'err'}`}>{status.message}</div>)}
    <p className='help'>Auth MODX côté serveur. Une session est créée si OK. <a className='link' href='/dashboard'>Tableau de bord</a>. • <a className='link' href='/api/session/me' target='_blank'>/api/session/me</a></p>
  </div></div>) }