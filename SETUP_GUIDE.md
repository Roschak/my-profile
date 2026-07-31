# Setup Guide — Portofolio Ragah Dirotama Wijaya

## Stack
- **Frontend**: Next.js 14 (App Router) — deployed on Vercel
- **Backend**: Express.js — deployed on Vercel (`porto-backend-rust.vercel.app`)
- **Database**: Supabase (PostgreSQL)
- **Auth**: NextAuth.js v4 + Google OAuth
- **Hosting**: Vercel (`portofolio-ragah.vercel.app`)

---

## Quick Start (Local Development)

```bash
cd frontend
npm install
npm run dev
```

Akses: `http://localhost:3000`

---

## Environment Variables

Copy `.env.example` ke `.env.local` dan isi semua nilai:

```bash
cp .env.example .env.local
```

| Variable | Wajib | Keterangan |
|---|---|---|
| `NEXT_PUBLIC_API_BASE_URL` | ✅ | URL backend Vercel |
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Supabase anon key |
| `GOOGLE_CLIENT_ID` | ✅ | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | ✅ | Google OAuth client secret |
| `NEXTAUTH_SECRET` | ✅ | Random secret untuk JWT |
| `NEXTAUTH_URL` | ✅ | `http://localhost:3000` (dev) |
| `ADMIN_EMAIL` | ✅ | Email Google yang boleh akses admin |
| `ADMIN_GOOGLE_ID` | ⚠️ Opsional | Google sub ID untuk double-check |
| `SUPABASE_SERVICE_ROLE_KEY` | ⚠️ Future | Untuk server-side write routes |

---

## Google OAuth Setup

1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Tambahkan Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://portofolio-ragah.vercel.app/api/auth/callback/google
   ```
5. Copy **Client ID** dan **Client Secret** ke `.env.local`

---

## Admin Access

- URL: `/admin`
- Login menggunakan Google account
- Hanya akun yang sesuai dengan `ADMIN_EMAIL` yang diizinkan
- Akun lain akan di-reject di level OAuth callback
- Middleware di-enforce di Edge sebelum halaman di-render

**Mendapatkan `ADMIN_GOOGLE_ID`:**
1. Login ke admin dengan akun yang benar
2. Buka Vercel logs atau tambahkan temporary log di `lib/auth.js`
3. Cari nilai `account.providerAccountId` di JWT callback
4. Set ke `ADMIN_GOOGLE_ID` env var
5. Hapus temporary log

---

## Deploy ke Vercel

```bash
# One-command deploy
npm run deploy
```

Atau manual:
```bash
npm run build
vercel --prod --yes --scope roschaks-projects
```

**Env vars di Vercel** (set via dashboard atau CLI):
- Semua variable di atas kecuali `NEXTAUTH_URL` → set ke `https://portofolio-ragah.vercel.app`

---

## Supabase RLS

Lihat `supabase/rls-recommendations.sql` untuk SQL policies yang direkomendasikan.
Jalankan manual di Supabase Dashboard → SQL Editor.

---

## Security Architecture

```
Request → middleware.js (Edge)
            ↓ no session → /admin login page
            ↓ session + not admin → /
            ↓ session + isAdmin → page renders
                        ↓
              page.jsx checks session.user.isAdmin
                        ↓
              mutations check userIsAdmin before Supabase calls
```

---

## File Structure (penting)

```
frontend/
├── app/
│   ├── admin/page.jsx          # Admin dashboard (protected)
│   ├── api/auth/[...nextauth]/ # NextAuth handler
│   ├── certificates/page.jsx   # Public certificates page
│   ├── projects/page.jsx       # Public projects page
│   ├── layout.jsx              # Root layout + metadata
│   ├── page.jsx                # Homepage (portfolio)
│   └── globals.css             # Luxury jazz theme
├── components/
│   ├── ParticleField.jsx       # Starry night canvas animation
│   └── PixelUrabeReal.jsx      # Pixel character animation
├── lib/
│   ├── auth.js                 # isAdmin() + authOptions (central)
│   ├── supabaseClient.js       # Supabase anon client
│   └── envValidation.js        # Env var audit helper
├── supabase/
│   ├── schema.sql              # DB schema
│   └── rls-recommendations.sql # RLS policies (run manually)
├── public/
│   └── images/                 # foto-aku.png, urabe-pixel.png
│   # ⚠️ Add CV-RAGAH-DIROTAMA-WIJAYA.pdf here
├── middleware.js               # Edge route protection
├── next.config.mjs             # Next.js config
├── vercel.json                 # Vercel deployment config
└── .env.local                  # Local secrets (NEVER commit)
```

---

## Scripts

| Command | Keterangan |
|---|---|
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run deploy` | Build + deploy ke Vercel production |
| `npm run lint` | ESLint check |
