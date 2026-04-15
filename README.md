# Profil Ragah - Next.js + Express

Portfolio profile dengan tema hitam-neon elegan + particle background.

- Frontend: Next.js (static export) untuk deploy ke Firebase Hosting
- Backend: Express API untuk deploy ke Vercel

## 1) Menjalankan di lokal

### Prasyarat
- Node.js 18+
- npm

### Jalankan backend
```bash
cd backend
npm install
npm run dev
```
Backend aktif di `http://localhost:4000`.

### Jalankan frontend
Buka terminal baru:
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```
Frontend aktif di `http://localhost:3000`.

## 2) Deploy backend ke Vercel

1. Push project ke GitHub.
2. Login ke Vercel dan import repository ini.
3. Atur Root Directory ke `backend`.
4. Build Command: biarkan default (`npm install` otomatis).
5. Output: default.
6. Tambahkan environment variable:
   - `CORS_ORIGIN` = URL frontend Firebase kamu (contoh: `https://profil-ragah.web.app`).
7. Deploy.
8. Catat URL backend Vercel, contoh: `https://profil-ragah-backend.vercel.app`.

## 3) Deploy frontend ke Firebase Hosting

1. Update file `frontend/.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=https://URL-BACKEND-KAMU.vercel.app
```
2. Build frontend:
```bash
cd frontend
npm run build
```
3. Install Firebase CLI (sekali saja):
```bash
npm install -g firebase-tools
```
4. Login Firebase:
```bash
firebase login
```
5. Isi project id di `.firebaserc` bagian `default`.
6. Deploy hosting dari root project:
```bash
cd ..
firebase deploy --only hosting
```

## 4) Struktur project

```txt
profil-ragah/
  backend/
    src/index.js
    vercel.json
  frontend/
    app/
      layout.jsx
      page.jsx
      globals.css
    components/
      ParticleField.jsx
      ProfileBoard.jsx
  firebase.json
  .firebaserc
```

## 5) Kustomisasi cepat

- Ubah kata-kata profil API di `backend/src/index.js`.
- Ubah warna neon di `frontend/app/globals.css` variabel `:root`.
- Ubah jumlah particle di `frontend/components/ParticleField.jsx` pada `PARTICLE_COUNT`.
