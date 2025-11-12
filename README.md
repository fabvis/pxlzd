# Pixelized — Build complet (sécurisé)

- Login via MODX (bcrypt/argon2/PBKDF2/MD5)
- Cookie de session signé (HS256-like), httpOnly, SameSite=Lax, secure en prod
- Mini throttling (6 tentatives / 10 min par (username, IP))
- Dashboard protégé: compte `coverYYMMDD` (Europe/Zurich)
- API cookies: `/api/login`, `/api/logout`, `/api/session/me`, `/api/db/ping`
- Foundation CSS + Bootstrap Icons (pas de jQuery nécessaire)
- Route API en runtime Node.js (mysql2)

## Setup
```bash
npm install
cp .env.example .env.local
# configure MODX_DB_*, EXT_DB_*, SESSION_SECRET
npm run dev
```

## Env
Voir `.env.example`. Si DB et app sont sur le même serveur, préfère le **socket**:
```
MODX_DB_SOCKET=/var/run/mysqld/mysqld.sock
EXT_DB_SOCKET=/var/run/mysqld/mysqld.sock
```
Sinon utilise `127.0.0.1:3306`.

## Production (Infomaniak)
- Build: `npm run build`
- Start: `npm run start`
- Ajoute toutes les variables d'env dans le manager Node.
