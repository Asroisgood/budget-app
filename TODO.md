# Daftar Tugas Pengembangan Aplikasi Budget

## 🔧 Refactoring & Stabilitas

### 1. Struktur Folder

- [ ] Merapikan struktur folder `components` dengan mengelompokkan berdasarkan fitur
- [ ] Membuat folder `utils` untuk fungsi-fungsi helper
- [ ] Memisahkan tipe TypeScript ke dalam folder `types`
- [ ] Mengorganisir file-file konfigurasi

### 2. Type Safety

- [ ] Menambahkan tipe TypeScript yang lebih ketat
- [ ] Membuat tipe untuk semua props komponen
- [ ] Menambahkan validasi input dengan Zod di semua form
- [ ] Memastikan type coverage 100%

### 3. Error Handling

- [ ] Menambahkan error boundary di level route
- [ ] Membuat komponen error yang konsisten
- [ ] Menambahkan error logging
- [ ] Menangani error API dengan lebih baik

### 4. State Management

- [ ] Mengevaluasi kebutuhan state management
- [ ] Mengimplementasikan Zustand/Jotai jika diperlukan
- [ ] Menghapus state yang tidak terpakai
- [ ] Mengoptimalkan re-renders

### 5. Optimasi Performa

- [ ] Menggunakan `React.memo` untuk komponen yang sesuai
- [ ] Mengoptimalkan re-renders
- [ ] Menggunakan `next/dynamic` untuk komponen besar
- [ ] Mengoptimalkan gambar dan aset statis

### 6. Testing

- [ ] Setup testing dengan Jest dan React Testing Library
- [ ] Menulis unit test untuk utility functions
- [ ] Menulis integration test untuk komponen kritis
- [ ] Setup GitHub Actions untuk CI/CD

---

## 🚀 Fitur yang Akan Dikembangkan

### 1. Manajemen Kategori

- [ ] CRUD kategori
- [ ] Ikon untuk setiap kategori
- [ ] Warna kustom untuk kategori
- [ ] Filter transaksi berdasarkan kategori

### 2. Laporan & Analisis

- [ ] Grafik pengeluaran/pemasukan bulanan
- [ ] Filter laporan berdasarkan periode
- [ ] Ekspor laporan (PDF/Excel)
- [ ] Ringkasan keuangan (total pemasukan, pengeluaran, saldo)

### 3. Manajemen Transaksi

- [ ] Pencarian transaksi
- [ ] Filter transaksi (tanggal, kategori, jumlah)
- [ ] Import/Export data transaksi
- [ ] Duplikasi transaksi

### 4. Manajemen Pengguna

- [ ] Profil pengguna
- [ ] Ganti password
- [ ] Preferensi pengguna (mata uang, format tanggal, dll)

### 5. Fitur Lanjutan

- [ ] Multi-currency support
- [ ] Rekening bank ganda
- [ ] Transfer antar rekening
- [ ] Budgeting system
- [ ] Tagihan berulang
- [ ] Scan struk belanja (OCR)

---

## 📝 Catatan Pengembangan

### Aturan Commit

- Gunakan format: `[JENIS]: Deskripsi singkat`
- Contoh: `[FEAT]: Menambahkan form transaksi baru`
- Jenis commit yang tersedia:
  - `FEAT`: Fitur baru
  - `FIX`: Perbaikan bug
  - `REFACTOR`: Perubahan kode tanpa mengubah fungsionalitas
  - `STYLE`: Perubahan pada styling/formatting
  - `DOCS`: Perubahan pada dokumentasi
  - `TEST`: Menambah/memperbaiki test
  - `CHORE`: Perubahan pada build process/tools

### Cara Berkontribusi

1. Buat branch baru dari `main`: `git checkout -b fitur/nama-fitur`
2. Lakukan perubahan
3. Commit perubahan dengan pesan yang deskriptif
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buat Pull Request ke branch `main`

### Lingkungan Pengembangan

- Node.js: >=18.0.0
- npm: >=9.0.0
- Database: MySQL

### Script Penting

- `npm run dev` - Menjalankan development server
- `npm run build` - Build untuk produksi
- `npm run start` - Menjalankan versi produksi
- `npm run lint` - Menjalankan ESLint
- `npm test` - Menjalankan test

---

## 🗓️ Roadmap

### Fase 1: Stabilisasi (1-2 minggu)

- [ ] Menyelesaikan semua item di bagian Refactoring & Stabilitas
- [ ] Memperbaiki bug yang ada
- [ ] Meningkatkan dokumentasi

### Fase 2: Fitur Inti (2-3 minggu)

- [ ] Menyelesaikan Manajemen Kategori
- [ ] Menyelesaikan Manajemen Transaksi
- [ ] Mengimplementasikan Laporan Dasar

### Fase 3: Peningkatan (1-2 minggu)

- [ ] Menambahkan fitur lanjutan
- [ ] Meningkatkan UX/UI
- [ ] Optimasi performa

---

## 🐛 Daftar Bug yang Diketahui

- [ ] Bug saat refresh halaman dashboard
- [ ] Error validasi form yang tidak konsisten
- [ ] Masalah timezone pada input tanggal

## 💡 Ide untuk Masa Depan

- Aplikasi mobile
- Integrasi dengan bank lokal
- Fitur berbagi anggaran dengan pasangan/keluarga
- Analisis kebiasaan pengeluaran dengan AI
