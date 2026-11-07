# BACKLOG PENYEMPURNAAN AMANDA

Berkas ini bukan sumber aturan bisnis. Aturan bisnis hanya dari Dokumen 01–05. Isinya daftar pekerjaan yang sengaja ditunda, supaya tidak terlupa.

## A. Penyempurnaan tampilan (dikerjakan setelah Langkah 9 selesai dan fungsi sudah diuji)

Prinsip: tidak mengubah aturan bisnis; hanya cara menampilkan dan memasukkan data. Aksi singkat (maksimal sekitar empat isian) di pop-up; form besar dan tabel banyak baris di halaman atau tab sendiri (Dokumen 01 §15 poin 6 dan 7).

| No | Pekerjaan | Asal temuan |
|---|---|---|
| 1 | Halaman Anggaran Bendahara dan PPTK dipecah menjadi tab (misal: Ringkasan, Alokasi Subkegiatan, Kesiapan Seksi, SPD dan Efisiensi, Pergeseran, Versi). Satu tab fokus pada satu pekerjaan. | Uji manual Blok A sesi 1 |
| 2 | Efisiensi dan kenaikan SPD: satu isian "SPD baru" per rekening menggantikan tombol turun/naik. Lebih rendah dicatat sebagai efisiensi (alasan opsional); lebih tinggi sebagai kenaikan (alasan wajib, maksimal pagu rekening). Tampilkan batas bawah (komitmen + realisasi) dan batas atas (pagu rekening). Penegakan di lapisan data tidak berubah. | Uji manual no. 13 |
| 3 | Pergeseran: tiga isian yang saling menghitung (nilai dipindah, pagu sumber setelah, pagu tujuan setelah), tampilkan batas maksimum (Sisa SPD Bebas sumber), tombol nonaktif bila melampaui batas. Tujuan hanya pasangan yang sudah dialokasikan. | Uji manual no. 14–16 |
| 4 | Pro Mode lengkap sesuai Dokumen 03 §1: ticker ringkasan horizontal di atas dasbor, tabel rapat sekitar 32 px, angka rata kanan, titik warna zona analitik (zona analitik bersama dasbor PA/KPA di Langkah 8). | Uji manual no. 20 dan laporan bolt |
| 5 | Periksa tinggi baris tabel Master dan Penugasan (48 px) setelah perubahan Pro Mode; sesuaikan bila terlalu renggang. | Uji manual no. 24 |
| 6 | Poles visual umum (kesan modern, jarak, warna) dengan tetap memakai token Treasury Dokumen 03 §1. | Uji manual Blok A sesi 1 |

## B. Pengingat fungsi yang dipindah ke langkah berikutnya

| Pekerjaan | Dikerjakan di | Keterangan |
|---|---|---|
| E-26: transaksi lama menunjuk snapshot anggaran saat terbit | Langkah 5 (kuitansi) | Kuitansi harus menyimpan versi anggaran saat dibuat |
| C-17b, C-15, C-15b, C-17: tombol "+ Buat Kuitansi" aktif hanya bila seluruh seksi Seimbang DAN Sahkan | Langkah 5 | Status gatekeeper sudah dihitung di Langkah 4 |
| B-6: TA Draft yang pernah memiliki kuitansi (termasuk yang sudah dihapus) tidak dapat dihapus | Langkah 5 | |
| B-10c: Masa Transisi menolak kuitansi dan SPJ baru | Langkah 5 | |
| B-10f: hak transaksi pejabat definitif nonaktif selama delegasi Plh./Plt. | Langkah 5 | |
| F-33d, F-33e: nama dan NIP penandatangan pada kuitansi dan hasil verifikasi, serta cetak ulang memakai snapshot | Langkah 5 dan 6 | |
| R-145: filter seksi, periode, jenis belanja pada Kuitansi, SPJ, BKU | Langkah 5 dan 6 | |
| N-108: isolasi widget early warning dan burn-rate (hanya PA/KPA) | Langkah 8 | Saat ini terpenuhi karena widgetnya belum ada |
| Penyimpanan permanen berkas SK dan lampiran SPJ (isi berkas hilang saat muat ulang pada Tahap A); kompresi PDF sungguhan (client dan server, SPJ-06 dan SPJ-07) | Tahap B (backend) | Frontend hanya menyimpan nama dan ukuran; batas 5 MB berkas SK adalah batas operasional sementara |
| Penjadwal pengakhiran delegasi pukul 23:59 WITA | Tahap B (backend) | Frontend memakai evaluasi saat aplikasi dimuat dan saat login |
| Penegakan hak akses di server (G-39 s.d. G-41, H-50, R-146, dan sejenisnya) | Tahap B (backend) | |

## C. Catatan tafsiran yang perlu dikonfirmasi pemilik bila relevan

- Pergeseran saat ini hanya diizinkan pada TA Aktif Penuh dan rekening yang alokasinya sudah disahkan. Dokumen tidak menyebut pembatasan ini (D02 §7 tidak memuat pergeseran; D-22a hanya mensyaratkan "sudah dialokasikan").
- Tafsiran "peringatan arsip menghitung SPJ yang belum Dibukukan" (Dokumen 03 §3: "SPJ atau BKU yang belum selesai").
- Setelah auto logout, isian yang belum disimpan hilang (dokumen menyatakan tanpa peringatan).

| Langkah 6 | Cetak PDF memakai dialog cetak peramban; PDF server dan penyimpanan permanen logo/stempel/token menunggu Tahap B. Pengecekan serentak M-97 dan penegakan peran di server menunggu backend. | Tahap B |
| Langkah 7 | PDF laporan memakai cetak peramban dan Excel dibuat di sisi klien; berkas final dari server, penyimpanan lampiran SPJ permanen, dan penegakan hak unduh di server menunggu backend. Pengecekan ukuran sheet sangat besar belum diuji. | Tahap B |
| Langkah 8 | Portal publik membaca data in-memory sesi; refresh dan data publik nyata menunggu API anonim dan pembatasan laju di backend. Tampilan visual dan hasil pada layar besar belum diuji. | Tahap B |
| Langkah 9 | Penghapusan TA hanya pada data in-memory sesi. Penghapusan berkas di penyimpanan nyata, penegakan peran di server, dan kebijakan cadangan platform menunggu backend. | Tahap B |
| Kuitansi | Keterangan Plh./Plt. di bawah nama penandatangan kuitansi belum tampil (data belum menyimpan keterangan). Logo kuitansi hanya di memori sesi. Contoh kwitansi memuat kotak Diverifikasi, tidak dicetak karena D01 §2.2 melarang; dokumen perlu dikonfirmasi bila pemilik ingin menampilkannya. | Perbaikan berikutnya / Tahap B |
