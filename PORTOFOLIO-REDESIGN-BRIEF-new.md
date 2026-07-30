# PORTFOLIO REDESIGN & BUG FIX BRIEF
## Tema: "Mount Olympus" — Greek Mythology Premium Experience
### Target kelas visual: Setara website senilai $30,000 (agency-grade, cinematic scroll)

---

## 0. RINGKASAN PROYEK

Ini adalah dokumen kerja (task brief) untuk merombak total tampilan (UI/UX/visual/animasi) dari portofolio yang sudah ada, **tanpa mengubah logika sistem, backend, routing data, ataupun struktur halaman fungsional (misal: halaman Profil, form, database, auth, dsb)**.

Fokus pekerjaan dibagi menjadi 2 jalur besar yang **harus dikerjakan terpisah dan tidak boleh saling menabrak**:

1. **JALUR A — AUDIT & PERBAIKAN BUG (SYSTEM LAYER)**
   Perbaiki semua error yang membuat halaman gagal dibuka / crash / blank / console error, tanpa mengubah perilaku atau data yang sudah ada.

2. **JALUR B — ROMBAK TOTAL VISUAL (PRESENTATION LAYER)**
   Desain ulang tampilan dari nol dengan tema Greek Mythology, level premium, penuh animasi scroll, tanpa menyentuh logic yang sudah berjalan.

> **ATURAN EMAS:** Kalau suatu perubahan berpotensi mengubah cara data diambil, disimpan, divalidasi, atau dikirim (state management, API call, form submit, auth, routing logic) — **JANGAN DISENTUH**, kecuali itu adalah penyebab langsung dari bug yang sedang diperbaiki di Jalur A.

---

## 1. CONSTRAINTS (BATASAN KERAS — WAJIB DIPATUHI)

- [ ] **DILARANG** mengubah struktur data / schema yang sudah dipakai halaman Profil dan halaman sistem lain.
- [ ] **DILARANG** mengganti library state management, routing, atau auth yang sudah dipakai, kecuali itu penyebab error yang sedang diperbaiki.
- [ ] **DILARANG** mengubah endpoint API, nama field, atau format response.
- [ ] **DILARANG** menghapus fitur yang sudah ada, walau terlihat tidak dipakai — tandai dulu sebagai "unused?" dan tanyakan sebelum dihapus.
- [ ] **BOLEH** mengubah total: HTML/JSX markup untuk keperluan visual, CSS/styling, class name, komponen presentational, animasi, layout, gambar, font, warna, transisi halaman.
- [ ] **BOLEH** membungkus ulang (wrap) komponen lama dengan komponen visual baru selama data & event handler yang dikirim/diterima tetap sama persis.
- [ ] Setiap perubahan pada file yang berhubungan dengan sistem (state, API, auth) harus dicatat terpisah di changelog dan diberi alasan.

---

## 2. JALUR A — AUDIT & PERBAIKAN BUG

### 2.1 Tujuan
Semua halaman yang sekarang error/blank/crash saat dibuka harus kembali normal, **tanpa mengubah fungsinya**, hanya memperbaiki apa yang rusak.

### 2.2 Checklist Audit (isi/centang saat proses berjalan)

- [ ] Jalankan build/dev server, catat **semua** error di terminal (build error, type error, missing module).
- [ ] Buka setiap halaman satu per satu, catat error yang muncul di console browser (JS error, network error 404/500, CORS error).
- [ ] Cek broken link/navigasi (menu, tombol, footer) yang mengarah ke halaman 404 atau kosong.
- [ ] Cek broken image / asset yang gagal load (icon, foto profil, logo, favicon).
- [ ] Cek environment variable / config yang hilang atau salah path (`.env`, API base URL, dsb).
- [ ] Cek dependency yang outdated/conflict yang menyebabkan build gagal.
- [ ] Cek halaman Profil secara khusus — pastikan semua data tampil benar, tidak ada field kosong/undefined/NaN.
- [ ] Cek form (jika ada) — submit, validasi, error message masih berjalan seperti semula.
- [ ] Cek responsive breakpoint — pastikan tidak ada elemen yang overflow/patah di mobile & tablet SEBELUM redesign (sebagai baseline).
- [ ] Cek performa loading awal (apakah ada blocking script, infinite loop, memory leak).
- [ ] Dokumentasikan setiap bug dalam format berikut:

```
BUG-001
Halaman     : /profil
Gejala      : Halaman blank, console error "Cannot read property 'name' of undefined"
Penyebab    : Data belum ter-fetch saat komponen render
Perbaikan   : Tambahkan loading state / null check sebelum render data
Risiko      : Rendah — hanya guard clause, tidak mengubah alur data
Status      : [ ] Belum / [ ] Proses / [ ] Selesai
```

### 2.3 Output yang diharapkan dari Jalur A
- Daftar bug lengkap (bug report) seperti format di atas.
- Semua halaman bisa dibuka tanpa error.
- Tidak ada regresi baru (fitur lama yang tadinya jalan jadi ikut rusak).

---

## 3. JALUR B — ROMBAK TOTAL VISUAL: TEMA "MOUNT OLYMPUS"

### 3.1 Konsep Besar
Website terasa seperti membuka sebuah **epik Yunani kuno yang hidup** saat di-scroll — pengunjung seolah menaiki Gunung Olympus, melewati medan perang para dewa, kuil-kuil marmer, dan berakhir di ruang takhta Zeus (bagian kontak/CTA). Setiap section adalah "babak" (chapter) dari cerita.

**Kata kunci mood:** epik, megah, dramatis, cinematic, mahal, marmer & emas, kilat & api, kabut, cahaya dewa (godrays).

### 3.2 Referensi Gaya (arahan, bukan aset yang harus ditiru persis)
- Awwwards-tier storytelling scroll site (single-page cinematic narrative).
- Nuansa museum/kuil: kolom marmer, ukiran relief, pecahan patung.
- Palet: hitam obsidian, putih marmer, emas metalik, aksen biru-petir/ungu-kilat, merah api perang.
- Tipografi: judul serif klasik (kesan pahatan/prasasti), body font modern sans-serif untuk keterbacaan.

### 3.3 Struktur Section (mapping ke konten portofolio yang sudah ada — data TETAP SAMA, hanya bungkus visualnya)

1. **Hero — "Kelahiran Sang Pahlawan"**
   - Full-screen intro, nama & tagline muncul seperti prasasti yang terpahat/terbakar.
   - Partikel abu/api atau kabut bergerak halus di background.
   - Petir menyambar sesekali sebagai aksen (subtle, tidak mengganggu).
   - Scroll indicator berbentuk seperti anak panah/petir Zeus.

2. **About / Profil — "Kisah Sang Pahlawan"**
   - Data profil (nama, deskripsi, foto) **tidak berubah**, hanya framing baru: seperti relief/ukiran di dinding kuil.
   - Foto profil dibingkai seperti medali/koin Yunani kuno atau patung marmer.
   - Teks muncul dengan efek "terpahat" (reveal per huruf/kata saat discroll).

3. **Skills / Kemampuan — "Senjata & Kekuatan Sang Dewa"**
   - Setiap skill divisualisasikan sebagai "senjata dewa" (ikon custom bertema: petir Zeus, trisula Poseidon, busur Apollo, dst — disesuaikan kategori skill).
   - Progress bar/level diganti jadi elemen visual seperti kekuatan energi/petir yang mengisi.

4. **Projects / Portofolio — "Medan Pertempuran (Battle Chronicles)"**
   - Tiap project = satu "pertempuran besar" dengan judul epik.
   - Transisi antar project seperti membalik halaman kitab kuno / peta perang yang terbuka.
   - Hover pada project card memicu efek particle (percikan api/petir) dan zoom parallax pada thumbnail.
   - Bisa pakai horizontal scroll section di dalam vertical scroll (scroll-jacking terkontrol) untuk efek "epic gallery".

5. **Experience / Timeline — "Garis Waktu Para Dewa"**
   - Timeline vertikal berbentuk seperti tangga menuju Olympus atau sungai Styx.
   - Setiap milestone muncul dengan animasi reveal saat elemen masuk viewport.

6. **Testimonial (jika ada) — "Sabda Para Oracle"**
   - Ditampilkan seperti prasasti/scroll (gulungan papirus) yang terbuka.

7. **Contact / CTA — "Ruang Takhta Zeus"**
   - Section akhir paling megah — background gerbang Olympus dengan cahaya dari atas (godrays).
   - Tombol CTA didesain seperti gerbang kuil yang terbuka saat di-hover.
   - Form kontak (jika ada) **logic tetap sama**, hanya dibungkus visual baru (input field bergaya marmer/emas).

8. **Footer — "Prasasti Penutup"**
   - Minimalis, ukiran tipis, credit, social links berbentuk lambang dewa kecil.

### 3.4 Spesifikasi Animasi (Full Scroll Experience)

- [ ] **Scroll-triggered reveal** di setiap section (fade + translate + slight scale) — gunakan Intersection Observer / library setara (GSAP ScrollTrigger, Framer Motion `whileInView`, atau Lenis + GSAP untuk smooth scroll).
- [ ] **Smooth scroll / momentum scroll** di seluruh halaman (bukan scroll native browser yang kaku).
- [ ] **Parallax multi-layer** pada background tiap section (awan/kabut bergerak lebih lambat dari elemen depan).
- [ ] **Text reveal animation**: huruf/kata muncul satu-satu seperti terpahat atau terbakar.
- [ ] **Particle system** ringan (api, abu, kilau emas) — harus dioptimasi agar tidak nge-lag (gunakan canvas/WebGL ringan seperti `tsparticles` atau custom canvas, batasi jumlah partikel di mobile).
- [ ] **Cursor custom** bertema (misal jejak petir mengikuti kursor) — opsional, khusus desktop.
- [ ] **Page transition** antar route bertema (efek seperti gerbang kuil terbuka/tertutup, atau kilatan cahaya) — TANPA mengganggu routing logic yang sudah ada.
- [ ] **Micro-interaction**: tombol, card, ikon punya hover/tap feedback bertema (glow emas, getar petir halus).
- [ ] **Loading screen** awal bertema (misal logo terbentuk dari pecahan patung/petir menyambar membentuk nama).
- [ ] Semua animasi harus punya **fallback ringan** untuk device low-end & **respect** `prefers-reduced-motion` (aksesibilitas — matikan/kurangi animasi berat jika user set reduced motion).

### 3.5 Kualitas "Kelas $30,000" — Checklist Kredibilitas Visual

- [ ] Tidak ada elemen default/template yang terlihat "asal pasang" — semua custom-styled.
- [ ] Konsistensi spacing, grid, dan tipografi di seluruh halaman (pakai design token/CSS variables).
- [ ] Custom illustration/icon set bertema Yunani (bukan icon generic Font Awesome polos) — bisa SVG custom atau ilustrasi line-art bergaya relief.
- [ ] Detail kecil diperhatikan: cursor state, focus state, empty state, loading state, error state — semua tetap "in theme".
- [ ] Sound design opsional (subtle ambient/efek petir halus saat interaksi penting) — harus ada tombol mute, default off/on sesuai preferensi UX.
- [ ] Performance tetap jadi prioritas: Lighthouse score (performance) minimal 80+ di desktop meski penuh animasi (lazy load asset berat, compress gambar, code-splitting).
- [ ] Fully responsive: pengalaman "epic" tetap terasa di mobile, tapi versi yang lebih ringan (kurangi partikel & parallax berat di layar kecil).

---

## 4. TECH NOTES (SESUAIKAN DENGAN STACK YANG SUDAH ADA)

**Keputusan final:** Stack TETAP di **React / Next.js** — tidak jadi migrasi ke Vue. Fokus dialihkan ke optimasi performa (lihat Bagian 4A) karena penyebab lag biasanya bukan pilihan framework, melainkan asset & animasi yang tidak dioptimasi.

- Framework saat ini: `Next.js (React)`
- Library animasi yang akan dipakai: `Framer Motion` (native React, integrasi paling mulus dengan Next.js) atau `GSAP + ScrollTrigger` untuk efek scroll yang lebih sinematik/kompleks — bisa dipakai berdampingan sesuai kebutuhan section
- Smooth scroll: `Lenis` (ringan, kompatibel dengan Next.js App Router)
- Library particle: `tsparticles` (via `@tsparticles/react`) — batasi jumlah partikel & nonaktifkan/kurangi drastis di mobile
- Image: wajib pakai komponen `next/image` (auto-optimize, lazy load, responsive) untuk semua asset visual baru, bukan tag `<img>` biasa
- Font: Serif klasik untuk judul (contoh arah: Cinzel, Playfair Display, Cormorant) + Sans-serif modern untuk body (contoh arah: Inter, Manrope) — load via `next/font` supaya tidak ada layout shift & font di-self-host otomatis
- Asset yang perlu dibuat baru: custom icon set, illustration/background per section, texture marmer, particle sprite (semua dalam format `.webp`/`.avif` untuk ukuran file lebih kecil, plus versi SVG untuk icon)

### 4A. PERFORMANCE OPTIMIZATION CHECKLIST (khusus Next.js — biar "ngebut")

- [ ] Audit dulu skor awal (baseline) pakai Lighthouse & Chrome DevTools Performance tab sebelum mulai redesign, biar ada pembanding.
- [ ] Ganti semua `<img>` jadi `next/image` dengan `width`/`height` atau `fill` yang benar (cegah layout shift / CLS).
- [ ] Compress semua asset gambar ke `.webp`/`.avif`, target di bawah 200KB per gambar hero/besar.
- [ ] Lazy-load section yang di bawah fold pakai `next/dynamic` (`{ ssr: false }` untuk komponen berat seperti particle canvas).
- [ ] Batasi jumlah partikel/elemen animasi berjalan bersamaan — pakai `requestAnimationFrame`, bukan `setInterval`, untuk animasi custom.
- [ ] Pastikan animasi pakai properti CSS yang di-GPU-accelerate (`transform`, `opacity`) — HINDARI animasi yang men-trigger `width`/`height`/`top`/`left` langsung.
- [ ] `will-change` dipakai secukupnya saja (jangan di semua elemen, bisa boros memory malah bikin lag).
- [ ] Cek dan hapus dependency/library lama yang sudah tidak dipakai (`npm run build` lalu cek bundle size dengan `@next/bundle-analyzer`).
- [ ] Terapkan `prefers-reduced-motion` dan deteksi device low-end (mis. `navigator.hardwareConcurrency` atau `deviceMemory`) untuk otomatis menurunkan intensitas efek di device yang lemah.
- [ ] Pastikan smooth-scroll library (Lenis) tidak konflik dengan native scroll restoration Next.js saat pindah halaman.
- [ ] Test ulang Lighthouse & Performance tab setelah redesign selesai — bandingkan dengan baseline, target Performance ≥ 80 di desktop dan ≥ 65 di mobile (mobile wajar lebih rendah karena animasi berat, tapi tetap harus terasa smooth, bukan patah-patah).

---

## 5. WORKFLOW PENGERJAAN YANG DISARANKAN

1. **Fase 0 — Audit total** (Jalur A selesai dulu, pastikan semua halaman bisa dibuka tanpa error, sebagai baseline stabil).
2. **Fase 1 — Design system & moodboard**: tentukan palet warna final, tipografi, style guide "Mount Olympus" (bisa dibuat di Figma dulu sebelum coding).
3. **Fase 2 — Bangun 1 section dulu sebagai prototype** (misal Hero) untuk validasi arah visual & animasi sebelum lanjut ke semua section.
4. **Fase 3 — Implementasi section lain** mengikuti pattern yang sudah divalidasi di Fase 2.
5. **Fase 4 — Optimasi performa & aksesibilitas** (lazy load, reduce motion, compress asset).
6. **Fase 5 — QA lintas device & browser** (Chrome, Safari, Firefox, mobile iOS/Android).
7. **Fase 6 — Final review & launch.**

---

## 6. DEFINITION OF DONE

- [ ] Tidak ada 1 pun halaman yang error saat dibuka.
- [ ] Semua data di halaman sistem (Profil, dsb) tampil identik seperti sebelumnya — hanya visualnya berubah.
- [ ] Seluruh section mengikuti tema Greek Mythology / Mount Olympus secara konsisten.
- [ ] Scroll animation berjalan mulus di desktop & mobile tanpa lag signifikan.
- [ ] Lighthouse Performance ≥ 80, Accessibility ≥ 90.
- [ ] `prefers-reduced-motion` dihormati.
- [ ] Tidak ada perubahan tak terdokumentasi pada logic/system layer.
- [ ] Changelog lengkap tersedia (daftar bug yang diperbaiki + daftar perubahan visual).

---

## 7. CATATAN TAMBAHAN

Dokumen ini adalah **brief kerja**, bukan kontrak akhir — silakan disesuaikan lagi setelah audit awal selesai dan stack teknis sudah dipastikan. Bagian 4 (Tech Notes) sengaja dikosongkan sebagian karena perlu disesuaikan dengan kondisi kode yang sudah ada.
