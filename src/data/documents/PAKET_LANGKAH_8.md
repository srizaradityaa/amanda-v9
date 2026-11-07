# PAKET LANGKAH 8: ANALITIK PA/KPA, PORTAL PUBLIK & PENGAWAS

**Sumber kebenaran mutlak:** Dokumen 01 v1.53, Dokumen 02 v1.33, Dokumen 03 v1.58, Dokumen 04 v1.38, Dokumen 05 v1.64.  
**Cakupan paket ini:** Tahap A, yaitu frontend dengan data contoh. Pekerjaan backend Langkah 8 baru dimulai di Tahap B (lihat `SUSUNAN_PENGEMBANGAN_AMANDA_BERTAHAP.md`).

## Perintah kerja
Kerjakan hanya fitur yang tercantum di bagian 1, berurutan dari atas ke bawah, memakai aturan yang tertulis di bagian 2 dan 3. Jangan menambah, mengurangi, atau mengubah aturan bisnis. Bila ada hal yang tidak diatur dokumen, hentikan dan tanyakan, jangan merancang sendiri. Langkah selesai bila seluruh skenario di bagian 4 dapat didemonstrasikan pada antarmuka dengan data contoh.

## 1. Fitur Langkah 8 (urutan kerja)
| Urut | ID | Fitur | Peran | Prioritas | Pekerjaan | Dependensi |
|---|---|---|---|---|---|---|
| 116 | PUB-06 | Server hanya mengirim agregat aman | Publik | P0 | Backend saja (tidak dikerjakan sekarang) | FND-02 |
| 117 | DSB-05 | Dasbor Pengawas (menu atas) | Pengawas | P1 | Frontend | AUT-02 |
| 118 | PUB-01 | Portal keterbukaan: akses & pilih TA | Publik | P1 | Frontend | FND-02 |
| 119 | PUB-02 | Persentase realisasi (server-side) | Publik | P1 | Frontend | BKU-01 |
| 120 | PUB-03 | Kategori status SPJ (4 kategori eksklusif) | Publik | P1 | Frontend | SPJ-02 |
| 121 | ANA-01 | Perhitungan Time Elapsed, Burn-Rate & lonjakan 14 hari | Sistem | P2 | Frontend | BKU-01, SPD-04 |
| 122 | ANA-07 | Heatmap Sebaran Realisasi Bulanan (halaman sendiri) | PA/KPA | P2 | Frontend | BKU-01, FND-02 |
| 123 | PUB-04 | Peringkat seksi | Publik | P1 | Frontend | PUB-02 |
| 124 | PUB-05 | Visualisasi, fullscreen, refresh | Publik | P1 | Frontend | PUB-02, PUB-03 |
| 125 | ANA-02 | Klasifikasi 4 zona warna | PA/KPA | P2 | Frontend | ANA-01 |
| 126 | ANA-06 | Isolasi RBAC analitik | PA/KPA | P1 | Frontend | ANA-02, FND-02 |
| 127 | PUB-07 | Tema & responsif portal | Publik | P1 | Frontend | UIX-01, PUB-05 |
| 128 | ANA-03 | Pembekuan analitik Masa Transisi/Arsip | Sistem | P2 | Frontend | ANA-02, TA-01 |
| 129 | ANA-04 | Dasbor Eksekutif PA/KPA (Pro Mode) | PA/KPA | P2 | Frontend | ANA-02, DRL-01 |
| 130 | ANA-05 | Sifat advisory tanpa blokir | PA/KPA | P2 | Frontend | ANA-02 |

## 2. Aturan kunci per fitur (ringkasan)
### PUB-06 — Server hanya mengirim agregat aman
- **Peran:** Publik
- **Aturan:** Tidak ada nominal rupiah, data transaksi, penerima, NIP/NIK, rekening, akun, audit pada response; uji response API & request langsung; endpoint privat menolak anonim.
- **Rujukan:** D01 §10 poin 2, 8; D03 §9 poin 6; D04 §2.3

### DSB-05 — Dasbor Pengawas (menu atas)
- **Peran:** Pengawas
- **Aturan:** TA yang ditugaskan, nomor surat tugas, tanggal akhir akses, tautan laporan & Jejak Audit (baca saja); tanpa analitik/countdown/banner/progress bar/sidebar.
- **Rujukan:** D03 §1, §7, §14; D01 §8
- **Keputusan pemilik yang sudah masuk dokumen:** N-03/N-04: Pengawas tidak melihat analitik. N-10: dasbor memuat TA yang ditugaskan, nomor surat tugas, tanggal akhir akses, tautan ke laporan dan Jejak Audit.

### PUB-01 — Portal keterbukaan: akses & pilih TA
- **Peran:** Publik
- **Aturan:** Anonim baca-saja; TA Aktif default + TA historis tersedia.
- **Rujukan:** D03 §9 poin 1, 5; D01 §10 poin 1

### PUB-02 — Persentase realisasi (server-side)
- **Peran:** Publik
- **Aturan:** BKU dibukukan ÷ pagu × 100; komitmen tidak dihitung; denominator nol/tidak tersedia → "Belum tersedia".
- **Rujukan:** D01 §10 poin 3; D04 §2.3

### PUB-03 — Kategori status SPJ (4 kategori eksklusif)
- **Peran:** Publik
- **Aturan:** Selesai/Dibukukan, Dalam Verifikasi, Perlu Perbaikan, Draf/Persiapan PPTK; total = cacah SPJ; draf persiapan dibedakan dari dikembalikan melalui penanda alur eksplisit.
- **Rujukan:** D01 §10 poin 4; D04 §2.3

### ANA-01 — Perhitungan Time Elapsed, Burn-Rate & lonjakan 14 hari
- **Peran:** Sistem
- **Aturan:** Time Elapsed = hari lewat sejak 1 Jan ÷ 365/366 (WITA); Burn-Rate = realisasi BKU ÷ Pagu Sah Terakhir (Induk, atau DPA-P setelah APBD-P); lonjakan = kenaikan realisasi BKU ≥40% dalam 14 hari kalender terakhir (hari ini + 13 hari sebelumnya) berdasar Tanggal BKU; cache 15–30 menit.
- **Rujukan:** D01 §12 poin 2; D03 §11; D04 §2.6 (proyeksi analitik)
- **Keputusan pemilik yang sudah masuk dokumen:** N-01: jendela lonjakan 14 hari kalender terakhir, ambang ≥ 40%. N-07: istilah "Burn-Rate" = realisasi BKU ÷ pagu sah terakhir (bukan "serapan").

### ANA-07 — Heatmap Sebaran Realisasi Bulanan (halaman sendiri)
- **Peran:** PA/KPA
- **Aturan:** Baris Seksi → Subkegiatan; sel bulan = nominal realisasi BKU + persen berlabel "Porsi Realisasi Bulanan terhadap Pagu Sah Terakhir" (pembagi pagu subkegiatan, bukan Serapan); bulan menurut Tanggal BKU; rekonsiliasi tanpa selisih; snapshot Arsip; hanya PA/KPA.
- **Rujukan:** D01 §12 poin 5

### PUB-04 — Peringkat seksi
- **Peran:** Publik
- **Aturan:** Urut persentase tertinggi → terendah; nama + persentase saja; "Belum tersedia" tanpa denominator.
- **Rujukan:** D01 §10 poin 5; D03 §9 poin 2

### PUB-05 — Visualisasi, fullscreen, refresh
- **Peran:** Publik
- **Aturan:** Donut/pie, gauge, bar, ticker tanpa nominal pada label/tooltip/aria; kontrol fullscreen (pintasan F tak mengganggu input; F11 tidak dijamin); refresh halus 15–30 menit + waktu pembaruan.
- **Rujukan:** D01 §10 poin 6–7; D03 §9 poin 3–5

### ANA-02 — Klasifikasi 4 zona warna
- **Peran:** PA/KPA
- **Aturan:** Satu zona per seksi, prioritas Merah > Oranye > Kuning > Hijau; Kuning (TE>75% & burn<50%) "Serapan Lambat"; Merah (TE>90% & burn<60%) "Kritis" di baris teratas; Oranye (realisasi BKU naik ≥40% pagu sah seksi dalam 14 hari kalender terakhir) "Lonjakan Tidak Wajar"; Hijau = selain ketiga kondisi itu.
- **Rujukan:** D01 §12 poin 3; D03 §6, §11
- **Keputusan pemilik yang sudah masuk dokumen:** N-01: Oranye bila ≥ 40% dalam 14 hari kalender terakhir (hari ini + 13 hari sebelumnya, WITA). N-02: satu zona per seksi; prioritas Merah > Oranye > Kuning > Hijau; kondisi di luar zona lain = Hijau (Normal).

### ANA-06 — Isolasi RBAC analitik
- **Peran:** PA/KPA
- **Aturan:** Hanya PA/KPA; tidak tampil di Admin, Bendahara, PPTK, Verifikator, Pengawas, portal publik; endpoint khusus internal PA/KPA.
- **Rujukan:** D01 §12 poin 4; D04 §2.6 poin 2
- **Keputusan pemilik yang sudah masuk dokumen:** N-03: analitik khusus PA/KPA; Pengawas/Auditor tidak mengakses (menggantikan D01 §12 poin 4, D05 baris Analitik, N-108).

### PUB-07 — Tema & responsif portal
- **Peran:** Publik
- **Aturan:** Token Treasury sama; Pro Mode layar besar/fullscreen, mode standar satu kolom < 768 px; ikon+teks pada status; WCAG AA; keyboard & fokus amber; tautan "Lihat Ringkasan Publik" dari login.
- **Rujukan:** D03 §9 poin 7–9; D01 §10 poin 9

### ANA-03 — Pembekuan analitik Masa Transisi/Arsip
- **Peran:** Sistem
- **Aturan:** Time Elapsed tetap 100%, zona dibekukan pada posisi akhir tutup buku (is_frozen).
- **Rujukan:** D01 §12 poin 2; D03 §11 poin 2; D04 §2.5

### ANA-04 — Dasbor Eksekutif PA/KPA (Pro Mode)
- **Peran:** PA/KPA
- **Aturan:** Ticker ringkasan zona (X Normal, Y Perlu Perhatian, Z Lonjakan); drill-down seksi → subkegiatan dengan titik warna & tooltip deviasi; Kritis di atas; satu zona per seksi; arsip TA analitik terkunci; laporan a,b,d,e,f,g; identitas PA/KPA tampil pada kuitansi.
- **Rujukan:** D03 §6, §11 poin 3; D01 §3.3
- **Keputusan pemilik yang sudah masuk dokumen:** N-02: ticker menghitung satu zona per seksi, sehingga jumlah semua zona = jumlah seksi.

### ANA-05 — Sifat advisory tanpa blokir
- **Peran:** PA/KPA
- **Aturan:** Badge/zona tidak pernah memblokir kuitansi, SPJ, verifikasi, BKU.
- **Rujukan:** D01 §12 poin 1

## 3. Kutipan bagian dokumen yang dirujuk (apa adanya)
Bagian berikut disalin tanpa perubahan dari dokumen sumber. Bila ringkasan di bagian 2 berbeda dengan kutipan ini, kutipan yang berlaku.

#### Dokumen 03 §1

## 1. Prinsip lintas role
- Master data bersifat global; setiap TA memiliki snapshot operasionalnya sendiri.
- **Autentikasi Cerdas & Desain Antarmuka Halaman Login:**
  - **Arsitektur Visual (Treasury & Market Terminal):**
    - Halaman login memakai tema Treasury & Market Terminal: nuansa terminal keuangan yang tenang dan mudah dibaca, bukan layar hitam pekat dengan teks hijau terang.
    - Latar memakai slate/charcoal gelap (`#0B1120`) dengan permukaan panel `#111827` dan garis tepi 1 px `#1F2937`. Halaman login tidak memakai efek kaca (*glassmorphism*), blur, gradasi cahaya, animasi, atau ticker.
    - Garis kisi mikro boleh dipakai sebagai ornamen statis tipis pada panel kiri, dengan kontras teks tetap memenuhi aturan aksesibilitas pada bagian Tema Visual.
  - **Tata Letak Responsif (Split-Hero):**
    - **Panel Kiri (Identitas & Wibawa Instansi):**
      - Header identitas resmi: *"Pemerintah Kabupaten Balangan • Kecamatan Batumandi"*.
      - Logo instansi daerah bersanding dengan jenama **AMANDA** (*Aplikasi Manajemen Data Anggaran*), tampil datar tanpa efek cahaya.
      - Pesan nilai/etos kerja aparatur muda: *"Tertib Administrasi, Akuntabel, dan Transparan dalam Setiap Rupiah."*
      - Halaman bebas dari ticker/banner animasi yang mengganggu fokus.
    - **Panel Kanan (Kartu Login Datar):**
      - Kartu datar dengan garis tepi 1 px dan tanpa blur atau bayangan tebal.
      - *Field Identitas Terpadu (Single-Field Identifier):* Satu kolom berlabel `NIP / NIK / Email Auditor` dengan teks monospace untuk NIP/NIK. Input angka dikenali sebagai personel internal; tanda `@` dikenali sebagai Pengawas/Auditor dan ditandai dengan ikon serta label teks "Akun Pengawas/Auditor", tidak hanya warna.
      - *Field Kata Sandi:* Dilengkapi **tombol intip sandi** (*toggle show/hide password*) responsif (password minimal 6 karakter).
      - *Tombol Aksi Utama:* Tombol *"Masuk ke Sistem"* berwarna amber (`#F59E0B`) dengan teks gelap (`#0B1120`). Saat diproses, tombol menampilkan teks "Memeriksa akun..." dan tidak dapat ditekan dua kali.
      - *Pesan Galat:* Galat login ditampilkan sebagai teks dengan ikon di atas tombol, tanpa menyebut apakah NIP atau kata sandi yang salah.
      - *Catatan Bantuan Admin:* Kotak informasi mikro berlabel tegas *"Lupa password atau akun terkendala? Hubungi Administrator Sistem."* (karena reset password bersifat terpusat oleh Admin).
      - *Tautan Cepat Portal Publik:* Tombol sekunder teal outline (`#2DD4BF`) berlabel jelas *"Lihat Ringkasan Publik"* untuk akses instan ke Portal Keterbukaan Informasi anonim tanpa login.
  - **Responsif Layar Sempit:** Pada layar sempit, panel kiri menjadi header ringkas di atas kartu login. Seluruh elemen tersusun satu kolom dengan field dan tombol selebar layar.
- **Tata Letak Dasbor (Sidebar & Topbar):**
  - Semua peran kecuali Pengawas/Auditor memakai sidebar untuk menu dan topbar tipis untuk konteks (TA aktif, peran aktif sebagai label, mini progress bar, dan logout).
  - Pengawas/Auditor memakai navigasi atas tanpa sidebar dan tanpa mini progress bar.
  - Admin hanya melihat Pagu Induk pada topbar.
  - Larangan dropdown ganti TA atau peran di topbar tetap berlaku.
- **Tema Visual Treasury (Login, Pro Mode, dan Mode Standar):**
  - **Token Bersama:** Seluruh antarmuka memakai satu set token warna, huruf, dan jarak. Nilai awal: latar `#0B1120`; permukaan `#111827`; garis tepi `#1F2937`; teks utama `#E5E7EB`; teks sekunder `#9CA3AF`; aksen utama amber `#F59E0B`; aksen sekunder teal `#2DD4BF`; status baik/naik hijau `#34D399`; kritis merah `#F87171`; peringatan kuning `#FBBF24`; lonjakan oranye `#FB923C`.
  - **Huruf:** Sans-serif (Inter) untuk teks umum dan judul. Monospace (JetBrains Mono) untuk NIP/NIK, kode TA, nomor BKU, nomor bukti, dan kode rekening. Angka nominal memakai angka tabular (lebar digit sama) agar kolom angka sejajar.
  - **Pro Mode (Dashboard Utama dan Monitoring/Analitik):**
    - Diterapkan pada dasbor utama dan modul monitoring atau analitik bagi pengelola keuangan tingkat lanjut, yaitu dasbor PA/KPA (§6 dan §11), dasbor Bendahara, dan dasbor Verifikator.
    - Kepadatan tinggi: ticker ringkasan horizontal di bagian atas (sesuai §6 dan §11), tabel rapat dengan tinggi baris sekitar 32 px, angka rata kanan, dan titik warna untuk zona analitik.
    - Pro Mode tidak mengubah cakupan data. Setiap dasbor hanya menampilkan angka yang diizinkan untuk role tersebut.
  - **Mode Standar (Input Transaksi dan Laporan Harian):**
    - Diterapkan pada halaman input kuitansi, SPJ, Form Dinamis, dan halaman BKU serta laporan harian.
    - Kepadatan lega: jarak antarelemen 16–24 px, ukuran teks dasar 16 px, tinggi baris tabel sekitar 48 px, dan hanya kolom yang diperlukan untuk keputusan.
    - Setiap layar memiliki satu aksi utama yang jelas. Pop-up dan halaman sendiri mengikuti Dokumen 01 §15.
    - Tidak ada tombol ganti mode. Mode standar otomatis dipakai pada layar kecil (di bawah 768 px), sedangkan Pro Mode mengikuti lebar layar yang lebih besar.
  - **Status dan Keterbacaan:** Setiap status (zona hijau, kuning, merah, dan oranye; status Dibukukan atau Terkunci; dan sejenisnya) wajib memakai teks atau ikon, tidak hanya warna. Kontras teks normal minimal 4,5:1 dan teks besar serta ikon minimal 3:1 (WCAG AA). Fokus keyboard memakai cincin amber 2 px yang terlihat. Transisi dibatasi, dan dimatikan jika pengguna memilih pengurangan gerak di perangkatnya.
  - **Batas Data:** Tema tidak mengubah cakupan data. Dasbor Admin tidak menampilkan realisasi atau sisa SPD (§2.1 poin 6 dan Dokumen 01 §6). Portal publik tidak menampilkan nominal rupiah (§9 poin 6). Portal publik mengikuti tema ini sesuai §9 poin 7–9.
- **Alur Masuk Berjenjang & Auto-Skip Pasca-Login:**
  1. **Admin:** Langsung masuk ke Dasbor Administrasi Global (Master & TA) tanpa melalui layar pemilih TA atau jabatan.
  2. **Pengawas/Auditor:** Langsung masuk ke Dasbor Pengawas (Laporan & Audit Trail Baca-Saja) TA yang ditugaskan. Jika surat tugas menugaskan lebih dari satu TA, Auditor memilih TA penugasan terlebih dahulu lalu langsung masuk ke dasbor TA tersebut.
  3. **Personel Internal (Bendahara, PPTK, Verifikator, PA/KPA):**
     - Jika personel hanya memiliki tepat 1 penugasan di 1 TA: sistem otomatis langsung masuk (*auto-skip*) ke dasbor TA dan jabatan tersebut.
     - Jika personel memiliki penugasan di lebih dari 1 TA: sistem menampilkan layar daftar TA penugasan terlebih dahulu, dilanjutkan layar daftar jabatan aktif pada TA yang dipilih (bila memegang lebih dari 1 jabatan di TA tersebut), baru kemudian masuk ke dasbor operasional.
     - Jika personel hanya memiliki penugasan di 1 TA tetapi memegang lebih dari 1 jabatan di TA tersebut: sistem langsung menampilkan layar daftar jabatan aktif lalu masuk ke dasbor operasional.
- **Isolasi Konteks Sesi & Larangan Alih Konteks Tanpa Logout:** Sesi operasional terisolasi ketat pada tepat satu TA (`active_ta_id`) dan satu Peran (`active_role`) yang aktif. Sistem dilarang menyediakan mekanisme alih TA (*switch TA*) atau alih peran (*switch role*) secara langsung di dalam aplikasi (misalnya melalui dropdown navbar). Untuk berpindah Tahun Anggaran atau berganti jabatan/peran, pengguna **wajib melakukan Logout** (menghancurkan sesi aktif) dan melakukan login ulang.
- **Pembatasan Percobaan Login & Batas Tidak Aktif:** Setelah 10 kali gagal login berturut-turut, akun terkunci dan pemulihannya dilakukan melalui reset password oleh Admin. Batas ini tidak berlaku untuk akun Admin, yang tidak dikunci karena percobaan gagal. Bila Admin lupa password, reset dilakukan melalui backend, bukan melalui aplikasi. Sesi berakhir otomatis (auto logout) setelah 1 jam tanpa aktivitas. Tidak ada batas maksimum lama login dan tidak ada peringatan sebelum logout.
- Penugasan, transaksi, dan perubahan anggaran terikat pada TA dan masa berlaku masing-masing.
- **Delegasi Plh./Plt.:** Delegasi sementara mengikuti Dokumen 01 §6 poin 7–11. Penugasan Delegasi Aktif ikut dihitung dalam alur masuk berjenjang, dan selama delegasi aktif hak transaksi pejabat definitif nonaktif.
- Perubahan tidak menghapus sejarah. Dokumen lama tetap dapat ditelusuri dan diakses sesuai hak.
- Mini progress bar di topbar mengikuti Dokumen 01 §3.3; laporan PDF dan Excel mengikuti Dokumen 01 §9 dan hanya memuat data Dibukukan. Rincian Kartu Kendali Kegiatan per subkegiatan dan rekening belanja (Dokumen 01 §9 poin 2g) mengikuti cakupan laporan a. Unduhan Excel rekap isian SPJ berisi satu sheet per jenis belanja (Dokumen 01 §9 poin 6–7). Pajak tidak termasuk rekap isian SPJ; rekap pajak per jenis pajak (Dokumen 01 §9 poin 10, hanya SPJ yang sudah memiliki BKU) dapat dilihat Bendahara, PPTK untuk seksinya, Verifikator, PA/KPA, dan Pengawas.
- Input nominal memakai format Rupiah dengan pemisah ribuan titik; kode dan nomor rekening adalah teks.
- Pencarian dan filter hanya pada daftar yang ditetapkan, dan hanya dalam cakupan data peran pengguna. Aksi singkat dan konfirmasi memakai pop-up; isian panjang memakai halaman sendiri (Dokumen 01 §15).
- Rekening belanja adalah kamus global yang dapat dipakai di subkegiatan mana pun; pasangan subkegiatan dan rekening membedakan baris alokasi (Dokumen 04 §2.2).
- Setiap aksi tercatat atas nama personel yang login, bukan akun generik (lihat Dokumen 04 §6).
- Batas peran Admin dan pemisahan tugas mengikuti Dokumen 01 §6: Bendahara tidak boleh merangkap PPTK pada TA yang sama, dan hanya satu TA yang boleh berstatus Aktif Penuh pada satu waktu.

#### Dokumen 01 §8

## 8. AKUN PENGAWAS/AUDITOR
1. **Bukan personel:** Akun Pengawas/Auditor tidak tercatat di Master Personel, tidak memiliki histori pangkat atau gelar, dan tidak wajib memiliki NIP/NIK, pangkat, TMT, atau nomor WhatsApp.
2. **Data wajib:** Nama lengkap, instansi asal, nomor surat tugas (wajib), tanggal surat tugas, email login, dan tanggal akhir akses.
3. **Pembuatan dan password:** Admin membuat akun dan menetapkan password awal (minimal 6 karakter). Password dikelola Admin seperti akun lain, termasuk reset oleh Admin. Pengguna tidak diwajibkan mengganti password saat login pertama.
4. **Penugasan:** Admin menugaskan Pengawas ke TA tertentu. Penugasan tanpa seksi dan mencakup seluruh seksi pada TA yang ditugaskan.
5. **Masa berlaku:** Login ditolak setelah tanggal akhir akses. Admin dapat mengubah tanggal akhir akses dengan alasan yang tercatat.
6. **Status:** Admin dapat menonaktifkan akun dengan alasan tertulis yang tercatat di Jejak Audit. Status NON-ACTIVE memutus login tanpa menghapus data atau riwayat.
7. **Cakupan akses:** Laporan dan Jejak Audit pada TA yang ditugaskan (seluruh seksi), mode baca saja. Tanpa drill-down anggaran, master, akun, penugasan, dan tombol proses.
8. **Audit:** Aksi Pengawas, termasuk mengunduh atau mencetak laporan, dan aksi Admin terhadap akun Pengawas dicatat dengan snapshot nama, instansi asal, nomor surat tugas, dan peran Pengawas.

---

#### Dokumen 03 §9

## 9. Pengunjung Publik (Anonim)
1. Pengunjung membuka halaman keterbukaan informasi tanpa login dan secara default melihat TA Aktif; TA terdahulu/arsip yang tersedia dapat dipilih.
2. Pengunjung membaca persentase realisasi berdasarkan BKU yang telah dibukukan, grafik distribusi status SPJ dalam bentuk cacah dan proporsi, serta peringkat seksi berdasarkan persentase realisasi.
3. Halaman dapat menampilkan donut/pie status SPJ, gauge atau busur realisasi, bar progres horizontal dan ticker ringkasan. Ticker, label, tooltip, dan tampilan fullscreen hanya menampilkan informasi yang telah diizinkan untuk publik.
4. Pengunjung dapat mengaktifkan fullscreen melalui kontrol halaman; tata letak menyesuaikan layar besar. Pintasan seperti F dapat didukung. F11 merupakan kendali browser/perangkat dan tidak dijamin oleh aplikasi.
5. Data agregat diperbarui di latar belakang setiap 15–30 menit. Pengunjung tetap anonim dan tidak memperoleh akses ke menu internal.
6. Tidak tersedia akses publik ke nominal rupiah, data sumber transaksi, kuitansi, lampiran, identitas penerima/personel, NIP/NIK, nomor rekening, akun, maupun jejak audit. Server hanya menyediakan agregat aman sebagaimana Dokumen 01 §10 dan Dokumen 04 §2.3, kecuali halaman keaslian SPJ pada poin 10 yang hanya memuat status, nama TA, nama seksi, dan tanggal verifikasi satu SPJ.
7. Tampilan portal publik memakai tema Treasury & Market Terminal (§1, Tema Visual Treasury) dengan token warna dan huruf yang sama dengan login dan Pro Mode: latar `#0B1120`, permukaan `#111827`, garis tepi `#1F2937`, huruf sans-serif untuk teks umum, dan angka monospace bertabel angka sejajar untuk persentase dan cacah. Amber dipakai untuk bar realisasi utama; teal untuk aksen sekunder dan tautan.
8. Di layar besar dan mode fullscreen, portal memakai kepadatan Pro Mode: ticker ringkasan di bagian atas, lalu donut status SPJ, gauge realisasi, dan bar peringkat seksi sesuai poin 2 dan 3. Huruf dibuat lebih besar agar terbaca dari jarak jauh. Di layar kecil, portal beralih ke mode standar satu kolom dengan kartu bertumpuk.
9. Setiap zona atau status pada portal publik wajib memakai ikon dan teks, tidak hanya warna, dan memenuhi kontras WCAG AA sebagaimana aturan Keterbacaan pada §1. Portal tidak menampilkan nominal rupiah, nomor, nama personel, atau lampiran sesuai poin 6, dan hanya menampilkan persentase, cacah, proporsi, serta peringkat seksi.
10. **Halaman terpisah:** Halaman keaslian SPJ (Dokumen 02 §8) adalah halaman publik terpisah dari portal ini. Halaman itu hanya memeriksa keaslian satu SPJ melalui token pada barcode, dengan batas tampilan mengikuti Dokumen 02 §8 poin 4. Portal ini tidak menampilkan data keaslian SPJ, dan halaman keaslian tidak menampilkan persentase, cacah, atau grafik.

#### Dokumen 01 §10

## 10. PORTAL KETERBUKAAN INFORMASI PUBLIK (TANPA LOGIN)

1. **Akses dan cakupan:** AMANDA menyediakan halaman publik baca-saja yang dapat dibuka tanpa login. Pengunjung dapat memilih TA yang tersedia; TA Aktif menjadi pilihan awal, sedangkan TA terdahulu/arsip dapat dipilih sebagai histori.
2. **Batas data yang ditampilkan:** Portal keterbukaan hanya menampilkan persentase dan cacah berkas SPJ. Halaman keaslian SPJ (poin 10) dikecualikan dan hanya menampilkan status keaslian satu SPJ. Tidak menampilkan nominal rupiah dalam bentuk apa pun, termasuk pagu, realisasi rupiah, sisa, nilai kuitansi, atau nilai per seksi. Halaman juga tidak menampilkan data sumber transaksi, data penerima, rincian kuitansi/SPJ, lampiran, NIP/NIK, nomor rekening, akun, jejak audit, atau informasi pribadi lainnya.
3. **Realisasi agregat:** Persentase realisasi instansi dihitung di sisi server sebagai total nilai BKU (realisasi pengeluaran belanja yang sudah dibukukan) dibagi total pagu TA, dikali 100%. Persentase seksi dihitung dengan rumus yang sama pada cakupan seksi. Komitmen kuitansi yang belum dibukukan bukan realisasi untuk indikator publik ini. Jika denominator tidak tersedia atau nol, tampilkan indikator sebagai “Belum tersedia” dan bukan nilai tak terhingga/hasil yang menyesatkan. Angka rupiah mentah tidak dikirim ke browser.
4. **Progres SPJ:** Tampilkan total cacah SPJ beserta cacah dan proporsi untuk kategori: Selesai/Dibukukan BKU; Dalam Verifikasi; Perlu Perbaikan; dan Draf/Persiapan PPTK. Satu SPJ hanya dihitung pada satu kategori pada satu waktu. Status/kategori yang dipakai harus mengikuti workflow Dokumen 02 dan Dokumen 03; sistem perlu membedakan draf persiapan dari draf yang dikembalikan untuk perbaikan melalui status atau penanda alur, bukan menebak dari isi dokumen.
5. **Peringkat seksi:** Tampilkan seluruh seksi TA yang memenuhi cakupan data, diurutkan dari persentase realisasi tertinggi ke terendah. Tampilkan nama seksi dan persentase saja, tanpa pagu/realisasi nominal. Seksi tanpa denominator yang dapat dihitung ditampilkan sebagai “Belum tersedia” dan tidak diberi persentase buatan.
6. **Visualisasi dan layar penuh:** Halaman dapat menyajikan grafik donat/pie untuk distribusi status SPJ, gauge atau indikator busur untuk realisasi keseluruhan, bar progres horizontal untuk realisasi instansi/seksi, serta ticker ringkasan yang hanya memuat TA, persentase, cacah SPJ, dan nama seksi. Visualisasi bersifat informatif dan seluruh angka di dalam tooltip/label harus mengikuti batas data publik pada poin 2. Tersedia kontrol fullscreen dan tata letak responsif untuk layar besar/kiosk. Pintasan papan ketik boleh disediakan; F11 tetap mengikuti kendali browser/perangkat dan tidak dijamin dapat dikendalikan aplikasi.
7. **Pembaruan data:** Data agregat diperbarui berkala secara halus setiap 15–30 menit tanpa memuat ulang seluruh halaman. Waktu pembaruan terakhir dapat ditampilkan.
8. **Pemisahan akses dan keamanan:** Pengunjung publik pada portal keterbukaan adalah akses anonim baca-saja khusus agregat; halaman keaslian SPJ (poin 10) hanya membaca status satu SPJ melalui token. Server hanya mengembalikan field agregat yang diperlukan (persentase, cacah, label TA/seksi, kategori status, dan waktu pembaruan); tidak mengirimkan baris sumber/nominal mentah atau data pribadi. Batasan ini wajib ditegakkan pada layanan/server, bukan hanya dengan menyembunyikan elemen antarmuka. Pengujian kebocoran meliputi response jaringan dan akses langsung ke endpoint.
9. **Tampilan dan keterbacaan:** Portal publik mengikuti Tema Visual Treasury pada Dokumen 03 §1 dan §9 poin 7–9. Tampilan memakai kepadatan Pro Mode di layar besar dan mode standar di layar kecil. Setiap status atau zona wajib memakai ikon dan teks, tidak hanya warna, serta memenuhi kontras WCAG AA. Aturan ini tidak mengubah batas data pada poin 2 dan 8.


---
10. **Halaman terpisah:** Halaman keaslian SPJ (Dokumen 02 §8) adalah halaman publik terpisah dari portal ini. Halaman itu hanya memeriksa keaslian satu SPJ melalui token pada barcode, dengan batas tampilan mengikuti Dokumen 02 §8 poin 4 (status, nama TA, nama seksi, dan tanggal verifikasi). Portal ini tidak menampilkan data keaslian SPJ, dan halaman keaslian tidak menampilkan persentase, cacah, atau grafik.

#### Dokumen 04 §2.3

### 2.3 Proyeksi agregat publik (tanpa akses data sumber)
| Proyeksi konseptual | Data yang boleh disajikan | Aturan |
|---|---|---|
| Statistik Keterbukaan Publik per TA | ID/tahun TA, total cacah SPJ, cacah per kategori status, persentase per kategori, persentase realisasi BKU terhadap pagu, waktu pembaruan | Hasil agregasi dihitung di server. Tidak ada nominal pagu/realisasi/sisa atau baris transaksi dalam payload publik. TA Aktif menjadi default; TA historis hanya untuk workspace yang tersedia. |
| Peringkat Realisasi per Seksi | ID seksi TA, nama snapshot seksi, persentase realisasi BKU terhadap pagu seksi, urutan peringkat | Hanya nama seksi dan persentase yang keluar ke pengunjung. Seksi dengan denominator nol/tidak tersedia tidak diberi persentase buatan dan ditandai belum tersedia. |
| Status Keaslian SPJ (halaman keaslian, Dokumen 02 §8) | Status Berlaku atau Tidak berlaku, nama TA, nama seksi, dan tanggal verifikasi; hanya untuk satu token yang diperiksa | Pengecualian terbatas dari portal agregat. Tidak ada persentase, cacah, nominal, identitas, lampiran, atau jejak audit. Token tidak dikenal atau tidak berlaku menghasilkan respons seragam. Tidak ada daftar atau pencarian token. |

- Rumus persentase realisasi publik: total BKU dibukukan ÷ pagu yang berlaku pada TA/cakupan yang sama × 100%. Komitmen kuitansi belum dibukukan tidak dihitung sebagai realisasi. Kalkulasi dilakukan di server; nominal mentah tidak dipulangkan ke klien.
- Kategori cacah SPJ: Selesai/Dibukukan BKU, Dalam Verifikasi, Perlu Perbaikan, dan Draf/Persiapan PPTK. Kategori saling eksklusif dan satu SPJ hanya masuk satu kategori. Karena status Draft dapat berasal dari persiapan atau pengembalian, pembeda workflow perlu direpresentasikan eksplisit sebagai status/penanda agar agregat akurat.
- Grafik pie/donut, gauge/busur, progres horizontal, ticker, dan fullscreen hanya memakai agregat yang diizinkan. Tooltip maupun metadata chart tidak boleh menyertakan nominal atau detail sumber. Pembaruan agregat dilakukan setiap 15–30 menit.
- Skema fisik, nama tabel, materialized view, endpoint, dan strategi cache merupakan keputusan teknis implementasi; proyeksi di atas adalah batas kontrak data, bukan SQL final.
- Akses anonim hanya boleh membaca proyeksi ini, ditambah baris status keaslian SPJ di atas yang hanya dapat dibuka melalui token pada barcode. Endpoint publik tidak boleh menyediakan akses ke tabel transaksi, file lampiran, identitas, atau audit.

#### Dokumen 01 §12

## 12. ANALITIK BURN-RATE & SISTEM PERINGATAN DINI DASBOR PA/KPA

Untuk memperkuat peran supervisi Pengguna Anggaran / Kuasa Pengguna Anggaran (PA/KPA) dari sekadar pembacaan tabel drill-down pasif menjadi pengawasan aktif berbasis data cerdas, AMANDA menyediakan modul analitik kecepatan penyerapan anggaran (*budget burn-rate*) dan peringatan dini (*early warning system*) yang berjalan di sisi backend.

1. **Prinsip Dasar & Non-Blokir (Advisory Flag):**
   - Analitik ini bersifat murni penelaahan eksekutif (*read-only intelligence & advisory flag*).
   - Seluruh badge, notifikasi, dan zona analitik tidak pernah memblokir proses kuitansi, pengajuan SPJ, verifikasi, maupun pembukuan BKU yang sah oleh tim operasional.
   - Analitik bertujuan mendeteksi risiko penumpukan anggaran di akhir tahun (*under-absorption*), keterlambatan pelaksanaan kegiatan seksi, serta lonjakan belanja mendadak yang memerlukan perhatian supervisi.

2. **Dua Parameter Utama Perhitungan (Zona Waktu WITA / UTC+8):**
   - **Time Elapsed (% Waktu Berjalan):**
     $$\text{Time Elapsed (\%)} = \frac{\text{Jumlah Hari yang Terlewati sejak 1 Januari}}{\text{Total Hari dalam Tahun Anggaran (365 atau 366 hari kabisat)}} \times 100\%$$
     - **Status TA Aktif Penuh:** Nilai dihitung dinamis setiap hari berdasarkan tanggal kalender sistem (WITA).
     - **Status TA Masa Transisi & Arsip Read-Only:** Nilai `Time Elapsed` otomatis dikunci (*frozen*) tetap di angka **100%**. Status zona dibekukan pada posisi akhir penutupan buku tahun anggaran tersebut sehingga data historis arsip tidak menghasilkan anomali.
   - **Budget Burn-Rate (% Realisasi BKU terhadap Pagu Sah Terakhir Seksi):**
     $$\text{Budget Burn-Rate (\%)} = \frac{\text{Akumulasi Realisasi Belanja BKU Seksi yang Telah Dibukukan}}{\text{Pagu Sah Terakhir Seksi}} \times 100\%$$
     - **Realisasi Belanja Sah:** Dihitung murni dari total nilai kuitansi/SPJ yang telah memiliki No. BKU dan berstatus Dibukukan. Komitmen kuitansi aktif atau SPJ dalam proses tidak dihitung sebagai realisasi. Istilah "Burn-Rate" hanya dipakai pada analitik ini dan tidak sama dengan "Serapan" (§7 poin 2) maupun "Realisasi (%)" pada laporan (§9 poin 2a).
     - **Pagu Sah Terakhir (Denominator Dinamis):** Sebelum penetapan APBD-P disahkan, menggunakan Pagu Induk/Murni Seksi. Setelah APBD-P disahkan, otomatis beralih menggunakan Pagu Perubahan Seksi (DPA-P).

3. **Klasifikasi 4 Zona Warna & Ambang Batas:**
   - 🟢 **Zona Hijau (Normal / Seimbang):**
     - Kondisi: Seksi yang tidak memenuhi kondisi Zona Kuning, Merah, maupun Oranye. Selisih antara % Burn-Rate dan % Time Elapsed tidak menjadi syarat tersendiri.
     - Tindakan: Kondisi aman, tidak ada tindakan khusus.
   - 🟡 **Zona Kuning (Under-Absorption / Penyerapan Lambat):**
     - Kondisi: Linimasa waktu TA telah berjalan signifikan (Time Elapsed $> 75\%$), namun Burn-Rate seksi tertinggal jauh ($< 50\%$).
     - Tindakan: Sistem menampilkan badge "Serapan Lambat" agar PA/KPA dapat melakukan evaluasi dan menegur kendala teknis penyerapan sebelum penutupan buku.
   - 🔴 **Zona Merah (Critical Under-Absorption / Risiko Gagal Eksekusi):**
     - Kondisi: Linimasa waktu TA hampir berakhir (Time Elapsed $> 90\%$), namun Burn-Rate seksi mandek di angka sangat rendah ($< 60\%$).
     - Tindakan: Sistem menampilkan label "Kritis" dan memprioritaskan seksi tersebut ke urutan paling atas dasbor supervisi.
   - 🟠 **Zona Oranye (Abnormal Spike / Lonjakan Belanja Mendadak):**
     - Kondisi: Terjadi percepatan belanja ekstrem dalam durasi singkat, yaitu kenaikan realisasi BKU sebesar $\ge 40\%$ dari pagu sah terakhir seksi dalam 14 hari kalender terakhir (hari ini dan 13 hari sebelumnya, WITA).
     - Dasar Perhitungan: Dihitung dari total realisasi BKU Dibukukan yang **Tanggal BKU**-nya berada dalam jendela 14 hari kalender terakhir tersebut, dibagi Pagu Sah Terakhir seksi.
     - Tindakan: Sistem menampilkan label penelaahan "Lonjakan Tidak Wajar" sebagai sinyal supervisi PA/KPA untuk memeriksa keabsahan dan dokumen pendukung transaksi periode tersebut.
   - **Aturan Penetapan Zona:** Setiap seksi menempati tepat satu zona pada satu waktu. Bila lebih dari satu kondisi terpenuhi, berlaku prioritas Merah > Oranye > Kuning > Hijau. Ticker ringkasan menghitung satu zona per seksi, sehingga jumlah seluruh zona sama dengan jumlah seksi.

4. **Kerahasiaan & Batasan Akses (RBAC):**
   - Modul analitik, early warning ticker, dan badge zona warna ini eksklusif hanya untuk peran **PA/KPA**, termasuk Heatmap Sebaran Realisasi Bulanan (poin 5). Pengawas/Auditor tidak memiliki akses ke modul analitik.
   - **Dilarang keras** ditampilkan pada Portal Keterbukaan Publik (portal publik hanya menampilkan agregat umum non-nominal tanpa metrik anomali internal).
   - Tampilan kerja harian Bendahara Pengeluaran dan PPTK/Seksi tidak menampilkan widget ini guna menjaga fokus operasional.
5. **Heatmap Sebaran Realisasi Bulanan (Sub-Activity Budget Utilization Heatmap):**
   a. Modul ini berupa matriks analitik berjenjang, bukan grafik bebas. Baris mengikuti jenjang Seksi → Subkegiatan. PA/KPA melihat seluruh seksi sampai subkegiatan dan tidak melihat tingkat rekening belanja (§7 poin 5c).
   b. Modul ini hanya untuk PA/KPA. Admin, Bendahara Pengeluaran, PPTK/Seksi, Verifikator, Pengawas/Auditor, dan Publik tidak memiliki akses. Pengawas/Auditor tetap memakai Katalog Laporan dan Jejak Audit sesuai §8.
   c. Setiap sel bulan memuat nominal realisasi BKU pada bulan tersebut beserta persentasenya. Warna hanya menjadi penanda visual tambahan, dan informasi tetap dapat dibaca tanpa warna (§1 Dokumen 03).
   d. Persentase diberi label "Porsi Realisasi Bulanan terhadap Pagu Sah Terakhir". Pembaginya adalah pagu subkegiatan. Persentase ini tidak menyertakan komitmen kuitansi aktif dan tidak disebut Serapan, sehingga berbeda dengan rumus Serapan pada §7 poin 2.
   e. Realisasi dihitung dari SPJ Dibukukan dengan BKU tercatat, dan bulan ditentukan oleh Tanggal BKU (poin 3). Tanggal BKU yang ditanggalkan mundur mengubah sel bulan tersebut dan total terkait pada pemuatan berikutnya.
   f. Rekonsiliasi berjenjang: total realisasi bulanan pada setiap baris subkegiatan harus sama dengan total realisasi BKU subkegiatan tersebut, dan total seksi harus sama dengan jumlah subkegiatannya. Tidak boleh ada selisih (§7 poin 3).
   g. Pada TA Masa Transisi atau Arsip Read-Only, matriks menampilkan snapshot pagu TA tersebut (§7 poin 7).
   h. Matriks ditampilkan sebagai halaman sendiri, bukan pop-up (§15 poin 7).
   i. Modul ini bersifat advisory dan tidak memengaruhi atau memblokir kuitansi, SPJ, verifikasi, maupun gatekeeper (poin 1).

#### Dokumen 03 §11

## 11. ALUR ANALITIK BURN-RATE & EARLY WARNING DASBOR PA/KPA

1. **Perhitungan Harian Otomatis (WITA):**
   - Server menghitung persentase `Time Elapsed` terhadap jumlah hari kalender TA (365/366 hari).
   - Server menghitung persentase `Budget Burn-Rate` per seksi dari total realisasi BKU yang telah dibukukan dibagi Pagu Sah Terakhir (Pagu Induk sebelum APBD-P, atau Pagu Perubahan setelah APBD-P disahkan).
   - Server mengevaluasi riwayat pembukuan BKU 14 hari terakhir per seksi untuk mendeteksi lonjakan belanja $\ge 40\%$.

2. **Penguncian pada Masa Transisi dan Arsip:**
   - Saat TA berstatus Masa Transisi atau Arsip Read-Only, `Time Elapsed` otomatis bernilai tetap 100% dan klasifikasi zona analitik dibekukan berdasarkan posisi akhir tutup buku.

3. **Penyajian pada Dasbor Eksekutif PA/KPA:**
   - Ticker ringkasan di bagian atas dasbor menampilkan rekap seksi per zona warna.
   - Tabel drill-down per seksi menyematkan indikator visual titik warna dan tooltip persentase analitik.
   - Seksi Zona Merah (Kritis) diangkat ke urutan teratas daftar untuk mempermudah supervisi.

#### Dokumen 04 §2.6

### 2.6 Proyeksi Analitik Burn-Rate & Early Warning Dasbor PA/KPA

Untuk mendukung kebutuhan analitik eksekutif PA/KPA tanpa membebani performa database transaksional, sistem menyediakan entitas agregasi atau *computed projection* harian di tingkat backend:

1. **Atribut Analitik per Seksi:**
   - `id_seksi`: Referensi ke seksi pada TA aktif.
   - `pagu_sah_terakhir`: Pagu Induk Seksi (sebelum APBD-P) atau Pagu Perubahan DPA-P (setelah APBD-P disahkan).
   - `realisasi_bku_terbukukan`: Total nominal kuitansi/SPJ yang telah memiliki `no_bku` dan berstatus `Dibukukan`.
   - `budget_burn_rate_pct`: `(realisasi_bku_terbukukan / pagu_sah_terakhir) * 100%`.
   - `time_elapsed_pct`: Persentase hari terlewati sejak 1 Januari dalam TA bersangkutan. Pada status TA Masa Transisi atau Arsip Read-Only, bernilai statis `100%`.
   - `bku_spike_14d_pct`: Akumulasi kenaikan realisasi BKU dalam jendela 14 hari kalender terakhir (berdasarkan `tanggal_bku`).
   - `zona_analitik`: Enum (`HIJAU`, `KUNING`, `MERAH`, `ORANYE`) berdasarkan ambang batas matematis yang ditetapkan di Dokumen 01 §12.
   - `is_frozen`: Boolean penanda apakah metrik analitik dalam status terkunci/beku (true untuk Masa Transisi dan Arsip).

2. **Aturan Eksekusi Query & Caching:**
   - Evaluasi harian dihitung secara terjadwal atau saat pembukaan dasbor dengan mekanisme caching (TTL 15-30 menit) dalam zona waktu WITA.
   - Perhitungan lonjakan abnormal (Zona Oranye) mengevaluasi agregasi `tanggal_bku` dalam rentang 14 hari terakhir terhadap pagu sah terakhir seksi.
   - Seluruh payload endpoint analitik PA/KPA terisolasi di rute khusus internal PA/KPA, tidak pernah dipaparkan ke publik.

#### Dokumen 03 §6

## 6. PA / KPA (Pengguna Anggaran / Kuasa Pengguna Anggaran)
1. **Peran Resmi Dokumen:** Menjadi otoritas penanggung jawab anggaran instansi yang identitasnya (nama, NIP, pangkat, jabatan) tampil otomatis pada blok tanda tangan resmi kuitansi universal (kiri atas) sesuai snapshot penugasan SK pada TA berjalan.
2. **Kewenangan Akun (Monitoring Eksekutif & Early Warning System):**
   - Mengakses Dashboard Eksekutif lintas seksi secara real-time dengan dukungan analitik cerdas *burn-rate vs time-elapsed*.
   - Memantau total Pagu Induk, progres realisasi kas BKU, sisa SPD bebas, dan serapan anggaran per seksi/subkegiatan.
   - **Widget Ringkasan Eksekutif (Early Warning Ticker):** Memantau kartu ringkasan instan di bagian atas dasbor ("X Seksi Zona Normal, Y Seksi Perlu Perhatian/Kuning/Merah, Z Seksi Terdeteksi Lonjakan/Oranye").
   - **Indikator Visual Titik Warna (Color Dot) & Tooltip:** Pada tabel drill-down per seksi, memantau ikon titik warna (🟢 Hijau, 🟡 Kuning, 🔴 Merah, 🟠 Oranye) beserta tooltip rincian deviasi burn-rate terhadap waktu berjalan. Seksi berstatus Kritis otomatis diprioritaskan di baris teratas.
   - Bersifat *read-only & advisory* (tidak membebani input transaksi atau approval berjenjang, dan tidak memblokir operasional; pengesahan transaksi tetap melalui tanda tangan fisik pada lembar kuitansi).
   - Melihat drill-down anggaran seluruh seksi sampai subkegiatan, mode baca saja; tingkat rekening belanja tidak ditampilkan.
   - Membuka arsip TA masa lalu dengan metrik analitik yang terkunci (Time Elapsed beku 100%, status historis aman dari anomali).
   - Melihat bar navbar instansi (Dokumen 01 §3.3). Laporan yang dapat dilihat: a, b, d, e, f, dan g untuk seluruh seksi, hanya data SPJ Dibukukan; kolom kuitansi tidak tampil pada b dan f (Dokumen 01 §9 poin 3). Laporan c tidak ditampilkan. Pada laporan e (Excel), NIP/NIK dan Nomor Rekening tampil penuh tanpa penyamaran (Dokumen 01 §9 poin 6). PA/KPA juga dapat mengunduh lampiran PDF SPJ seluruh seksi (Dokumen 02 §9).

- Menyusun dan mengunduh laporan kustom untuk seluruh seksi, dengan pilihan kolom sesuai Matriks Kolom yang Diizinkan per Peran (Dokumen 01 §9 poin 12).

- Melihat Heatmap Sebaran Realisasi Bulanan untuk seluruh seksi sampai tingkat subkegiatan, dalam mode baca saja (Dokumen 01 §12 poin 5). Tingkat rekening belanja tidak ditampilkan.

#### Dokumen 04 §2.5

### 2.5 Direktori Rekening Bank (Global & Transaksional Mandiri)
- `bank_accounts_directory`: Koleksi referensi rekening bank yang dihimpun secara otomatis dari pengisian SPJ (*auto-capture*) dan dikelola Admin.
  - Atribut konseptual: `id`, `account_name` (nama pemilik/penerima), `bank_name` (nama bank), `account_number` (nomor rekening), `alias` (nama alias/instansi, opsional), `created_at`, `updated_at`.
  - Bersifat global lintas-seksi untuk memudahkan penggunaan ulang (*reusability*) rekening pihak ketiga/rekanan/pegawai.
  - Tidak memiliki indeks unik kaku yang memblokir penambahan variasi penulisan dari form PPTK. Penggabungan dan standardisasi dikontrol oleh Admin melalui fungsi *merge* dan koreksi.
  - Pembatalan transaksi SPJ tidak menghapus baris pada direktori ini.

#### Dokumen 01 §3.3

### 3.3 Topbar dan Mini Progress Bar
Istilah navbar pada seluruh dokumen berarti topbar. Navigasi menu memakai sidebar untuk semua peran kecuali Pengawas/Auditor. Topbar menampilkan label TA aktif dan peran aktif (tanpa dropdown ganti TA atau peran), mini progress bar realisasi terhadap pagu, dan tombol logout. Mini progress bar disertai angka sesuai cakupan peran:

| Peran | Isi mini progress bar topbar |
|---|---|
| Bendahara, PA/KPA, Verifikator | Pagu, realisasi, sisa SPD bebas, dan serapan seluruh instansi |
| PPTK | Pagu, realisasi, dan sisa SPD bebas seksinya saja |
| Admin | Pagu Induk saja |
| Pengawas/Auditor | Tidak ada mini progress bar dan tidak ada sidebar |

---

## 4. Skenario uji Dokumen 05 untuk langkah ini (apa adanya)
Format Bagian-Nomor.

- **H-50** (DSB-05): Pengawas hanya dapat membuka laporan dan Jejak Audit. Drill-down anggaran, master, akun, dan tombol proses ditolak di server meskipun URL diakses langsung.
- **H-52** (DSB-05): Pengawas tidak melihat countdown, banner merah, maupun bar navbar.
- **L-78** (PUB-01): Halaman publik dapat dibuka tanpa autentikasi dan hanya menampilkan TA aktif sebagai default serta TA historis yang tersedia melalui pemilih TA.
- **L-79** (PUB-02): Persentase realisasi total/seksi dihitung dari BKU yang dibukukan dibagi pagu pada cakupan TA yang sama. Komitmen yang belum dibukukan tidak dihitung. Untuk denominator nol/tidak tersedia, UI menampilkan “Belum tersedia”, bukan persentase buatan.
- **L-80** (PUB-06): Pada portal keterbukaan, pengunjung publik hanya menerima agregat aman (halaman keaslian SPJ dikecualikan sesuai skenario 132–134): persentase realisasi, cacah SPJ total/per status, nama TA/seksi, urutan seksi, dan waktu pembaruan. Tidak ada nominal rupiah, rincian kuitansi/SPJ, baris transaksi, lampiran, data penerima/personel, NIP/NIK, nomor rekening, akun, ataupun jejak audit pada respons jaringan. Uji dilakukan pada response API dan request langsung, bukan hanya tampilan.
- **L-81** (PUB-03): Kategori SPJ publik (Selesai/Dibukukan BKU, Dalam Verifikasi, Perlu Perbaikan, Draf/Persiapan PPTK) saling eksklusif dan total cacah kategori sama dengan total SPJ dalam cakupan filter. Draf persiapan harus dapat dibedakan dari SPJ yang dikembalikan untuk perbaikan.
- **L-82** (PUB-04): Daftar seksi diurutkan berdasarkan persentase realisasi tertinggi ke terendah; tidak ada nominal yang ditampilkan. Seksi tanpa denominator valid ditandai “Belum tersedia”.
- **L-83** (PUB-05): Grafik donut/pie, gauge, bar horizontal, dan ticker hanya menggunakan agregat yang diizinkan, termasuk pada hover/tooltip, accessibility labels, dan state chart. Tidak ada nominal rupiah pada metadata chart.
- **L-84** (PUB-05): Kontrol fullscreen mengaktifkan/menutup mode fullscreen bila didukung browser/perangkat; halaman responsif untuk layar besar. Pintasan F yang didukung tidak mengganggu input teks. F11 boleh mengikuti perilaku browser, tetapi tidak menjadi syarat kelulusan kontrol aplikasi.
- **L-85** (PUB-05): Data di-refresh secara halus pada interval 15–30 menit dan menampilkan waktu pembaruan; refresh tidak membuka akses ke data mentah.
- **L-86** (PUB-01, PUB-06): Semua endpoint/data transaksi privat tetap menolak guest/anonim meskipun dipanggil langsung. Endpoint agregat tidak dapat digunakan untuk mengekstrak nilai nominal melalui response yang tidak diizinkan.
- **N-99** (ANA-01, ANA-04): **Perhitungan Time Elapsed Dinamis:** Pada TA Aktif Penuh, sistem menghitung persentase hari berjalan sejak 1 Januari berbasis waktu WITA secara akurat terhadap total 365/366 hari kalender.
- **N-100** (ANA-03, ANA-04): **Pembekuan Time Elapsed pada Arsip dan Masa Transisi:** Pada TA berstatus Masa Transisi atau Arsip Read-Only, persentase `Time Elapsed` bernilai konstan 100%, dan status zona analitik tetap terkunci pada posisi akhir buku tanpa terpengaruh tanggal tahun berjalan.
- **N-101** (ANA-01): **Basis Realisasi BKU Sah:** Sistem menghitung Burn-Rate seksi murni dari kuitansi/SPJ yang telah memiliki `no_bku` dan berstatus `Dibukukan`. Kuitansi aktif atau SPJ draf/terkunci tidak dihitung ke dalam realisasi.
- **N-102** (ANA-01): **Denominator Dinamis APBD-P:** Sebelum pengesahan APBD-P, Burn-Rate dihitung terhadap Pagu Induk Seksi. Setelah APBD-P disahkan, denominator otomatis berganti menggunakan Pagu Perubahan Seksi (DPA-P).
- **N-103** (ANA-02): **Deteksi Zona Hijau (Normal):** Seksi yang tidak memenuhi kondisi Zona Kuning, Merah, maupun Oranye diklasifikasikan ke dalam Zona Hijau dengan indikator titik warna hijau.
- **N-104** (ANA-02): **Deteksi Zona Kuning (Serapan Lambat):** Pada kondisi time-elapsed $> 75\%$ namun Burn-Rate seksi $< 50\%$, sistem memunculkan badge "Serapan Lambat" (titik kuning) pada seksi terkait.
- **N-105** (ANA-02): **Deteksi Zona Merah (Kritis):** Pada kondisi time-elapsed $> 90\%$ namun Burn-Rate seksi $< 60\%$, sistem memunculkan label "Kritis" (titik merah) dan mengangkat seksi ke baris teratas dasbor.
- **N-106** (ANA-02): **Deteksi Zona Oranye (Lonjakan Belanja Mendadak):** Jika dalam 14 hari kalender terakhir (hari ini dan 13 hari sebelumnya, WITA) terjadi kenaikan realisasi pembukuan BKU $\ge 40\%$ dari pagu sah terakhir seksi, berdasarkan Tanggal BKU, sistem memunculkan label penelaahan "Lonjakan Tidak Wajar" (titik oranye). Kenaikan tepat 40% memicu Zona Oranye; kenaikan di bawah 40% tidak.
- **N-106a** (ANA-02): **Satu Zona per Seksi:** Bila beberapa kondisi zona terpenuhi sekaligus, seksi ditampilkan pada satu zona sesuai prioritas Merah > Oranye > Kuning > Hijau. Jumlah seluruh zona pada ticker ringkasan sama dengan jumlah seksi.
- **N-107** (ANA-05): **Sifat Advisory Tanpa Blokir:** Keberadaan badge peringatan Zona Kuning, Merah, maupun Oranye terbukti tidak memblokir simpan kuitansi, pengajuan SPJ, verifikasi, atau pencatatan BKU oleh pengguna operasional.
- **N-108** (ANA-06): **Isolasi RBAC Dasbor Analitik:** Widget early warning ticker dan indikator analitik burn-rate hanya dapat diakses oleh akun PA/KPA. Modul tersebut terbukti tidak muncul, dan permintaan langsung ditolak di server, pada tampilan Admin, Bendahara, PPTK, Verifikator, Pengawas/Auditor, maupun Portal Keterbukaan Publik.
- **Q-135** (DSB-05): Pengawas/Auditor tidak melihat sidebar dan mini progress bar; layout Pengawas tetap menu atas tanpa bar.
- **S-151** (PUB-07): Portal publik memakai token Tema Treasury yang sama dengan login dan Pro Mode, yaitu latar, permukaan, garis tepi, huruf sans-serif, dan monospace untuk angka. Uji dilakukan dengan memeriksa nilai token pada CSS dan tampilan di kedua mode.
- **S-152** (PUB-07): Pada layar besar dan fullscreen, portal menampilkan kepadatan Pro Mode berupa ticker, donut, gauge, dan bar peringkat dengan huruf yang lebih besar. Pada layar di bawah 768 px, tata letak beralih ke mode standar satu kolom tanpa kehilangan elemen data.
- **S-153** (PUB-07): Setiap status atau zona pada portal memakai ikon dan teks, tidak hanya warna. Kontras teks normal minimal 4,5:1 dan teks besar serta ikon minimal 3:1, diuji dengan alat pemeriksa kontras.
- **S-154** (PUB-07): Seluruh isi portal dapat dijangkau dengan keyboard. Fokus terlihat sebagai cincin amber 2 px, dan transisi tidak berjalan bila pengguna memilih pengurangan gerak.
- **U-164** (ANA-07): Heatmap Sebaran Realisasi Bulanan tampil hanya untuk PA/KPA. Admin, Bendahara, PPTK, Verifikator, Pengawas/Auditor, dan Publik ditolak di server, termasuk melalui URL langsung dan pemanggilan data.
- **U-165** (ANA-07): Baris matriks PA/KPA berhenti di tingkat subkegiatan. Server tidak mengirim baris rekening belanja untuk PA/KPA, termasuk melalui pemanggilan langsung.
- **U-166** (ANA-07): Setiap sel bulan memuat nominal Realisasi BKU bulan tersebut dan persentasenya, sehingga informasi tetap terbaca tanpa warna.
- **U-167** (ANA-07): Persentase diberi label "Porsi Realisasi Bulanan terhadap Pagu Sah Terakhir" dengan pembagi pagu subkegiatan. Persentase tidak menyertakan komitmen kuitansi aktif dan tidak disebut Serapan.
- **U-168** (ANA-07): Total realisasi bulanan pada setiap baris subkegiatan sama dengan total realisasi BKU subkegiatan tersebut, dan total seksi sama dengan jumlah subkegiatannya, tanpa selisih.
- **U-169** (ANA-07): Realisasi bulan ditentukan oleh Tanggal BKU. Jika BKU ditanggalkan mundur ke bulan sebelumnya, sel bulan tersebut dan totalnya berubah pada pemuatan berikutnya.
- **U-170** (ANA-07): Kuitansi Aktif, kuitansi Terkunci, SPJ Draft, dan SPJ Menunggu BKU tidak masuk perhitungan.
- **U-171** (ANA-07): Pada TA Masa Transisi atau Arsip Read-Only, matriks menampilkan snapshot pagu TA tersebut dan angkanya tidak berubah setelah perubahan master.
- **U-172** (ANA-07): Matriks tampil sebagai halaman sendiri, bukan pop-up.

Selesai bila SEMUA skenario yang tercantum di bagian 4 lulus.