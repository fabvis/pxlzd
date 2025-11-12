import mysql from 'mysql2/promise'
function makePoolFromEnv(prefix:'MODX'|'EXT'){
  const useSocket=!!process.env[`${prefix}_DB_SOCKET`]
  const common={ user:process.env[`${prefix}_DB_USER`], password:process.env[`${prefix}_DB_PASS`], database:process.env[`${prefix}_DB_NAME`],
    waitForConnections:true, connectionLimit:6, queueLimit:0, connectTimeout:Number(process.env.DB_CONNECT_TIMEOUT_MS||8000),
    enableKeepAlive:true, keepAliveInitialDelay:10000, charset:'utf8mb4_general_ci' as const }
  const ssl=process.env.DB_SSL==='true'?{rejectUnauthorized:process.env.DB_SSL_REJECT_UNAUTHORIZED!=='false'}:undefined
  return useSocket? mysql.createPool({ ...common, socketPath: process.env[`${prefix}_DB_SOCKET`]!, ssl })
                  : mysql.createPool({ ...common, host:process.env[`${prefix}_DB_HOST`]||'127.0.0.1', port:Number(process.env[`${prefix}_DB_PORT`]||3306), ssl })
}
let poolModx: mysql.Pool|null=null, poolExt: mysql.Pool|null=null
export function getPool(){ if(!poolModx) poolModx=makePoolFromEnv('MODX'); return poolModx }
export function getExternalPool(){ if(!poolExt) poolExt=makePoolFromEnv('EXT'); return poolExt }