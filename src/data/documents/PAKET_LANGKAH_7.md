# PAKET LANGKAH 7: PELAPORAN

**Sumber kebenaran mutlak:** Dokumen 01 v1.53, Dokumen 02 v1.33, Dokumen 03 v1.58, Dokumen 04 v1.38, Dokumen 05 v1.64.  
**Cakupan paket ini:** Tahap A, yaitu frontend dengan data contoh. Pekerjaan backend Langkah 7 baru dimulai di Tahap B (lihat `SUSUNAN_PENGEMBANGAN_AMANDA_BERTAHAP.md`).

## Perintah kerja
Kerjakan hanya fitur yang tercantum di bagian 1, berurutan dari atas ke bawah, memakai aturan yang tertulis di bagian 2 dan 3. Jangan menambah, mengurangi, atau mengubah aturan bisnis. Bila ada hal yang tidak diatur dokumen, hentikan dan tanyakan, jangan merancang sendiri. Langkah selesai bila seluruh skenario di bagian 4 dapat didemonstrasikan pada antarmuka dengan data contoh.

## 1. Fitur Langkah 7 (urutan kerja)
| Urut | ID | Fitur | Peran | Prioritas | Pekerjaan | Dependensi |
|---|---|---|---|---|---|---|
| 108 | LAP-01 | Katalog laporan baku: PDF & Excel, basis realisasi | Bendahara, PPTK, Verifikator, PA/KPA, Pengawas | P0 | Frontend | FND-02, BKU-01 |
| 109 | SPJ-08 | Unduh lampiran PDF SPJ | Bendahara, PPTK, Verifikator, PA/KPA | P1 | Frontend | SPJ-07, FND-02 |
| 110 | LAP-02 | Laporan (a) Rekap realisasi per seksi | idem | P1 | Frontend | LAP-01 |
| 111 | LAP-03 | Laporan (b) Buku Kas, (c) Daftar kuitansi & SPJ, (d) Realisasi per seksi & subkegiatan | idem | P1 | Frontend | LAP-01 |
| 112 | LAP-04 | Laporan (e) Rekap isian SPJ per jenis belanja (Excel) | idem | P1 | Frontend | LAP-01, SPJ-04 |
| 113 | LAP-05 | Laporan (f) Rekap pajak per jenis pajak | idem | P1 | Frontend | LAP-01, PJK-02 |
| 114 | LAP-06 | Laporan (g) Rincian Kartu Kendali Kegiatan | idem | P1 | Frontend | LAP-01 |
| 115 | LAP-07 | Penyusunan Laporan Kustom (halaman sendiri) | Bendahara, PPTK, PA/KPA, Verifikator | P1 | Frontend | LAP-01 |

## 2. Aturan kunci per fitur (ringkasan)
### LAP-01 — Katalog laporan baku: PDF & Excel, basis realisasi
- **Peran:** Bendahara, PPTK, Verifikator, PA/KPA, Pengawas
- **Aturan:** Hanya SPJ Dibukukan (BKU tercatat); Admin tidak mendapat laporan (ditolak server); Bendahara/Verifikator seluruh seksi; PPTK seksinya; Pengawas seluruh seksi pada TA yang ditugaskan, baca saja; pencabutan BKU hilang dari unduhan berikutnya.
- **Rujukan:** D01 §9 poin 1–3; D05 §2 baris Laporan
- **Keputusan pemilik yang sudah masuk dokumen:** N-04: laporan Pengawas hanya untuk TA yang ditugaskan. N-07: istilah "Realisasi (%)" dipakai di laporan, bukan "Serapan".

### SPJ-08 — Unduh lampiran PDF SPJ
- **Peran:** Bendahara, PPTK, Verifikator, PA/KPA
- **Aturan:** Bendahara/Verifikator/PA-KPA seluruh seksi; PPTK seksinya; Admin, Pengawas, Publik ditolak termasuk URL langsung; berkas final yang diunduh.
- **Rujukan:** D02 §9; D05 §2

### LAP-02 — Laporan (a) Rekap realisasi per seksi
- **Peran:** idem
- **Aturan:** Pagu, realisasi BKU, Realisasi (%) = Realisasi BKU ÷ Pagu, status; tanpa komitmen & sisa SPD bebas.
- **Rujukan:** D01 §9 poin 2a
- **Keputusan pemilik yang sudah masuk dokumen:** N-07: kolom "serapan" diganti "Realisasi (%)" = Realisasi BKU ÷ Pagu.

### LAP-03 — Laporan (b) Buku Kas, (c) Daftar kuitansi & SPJ, (d) Realisasi per seksi & subkegiatan
- **Peran:** idem
- **Aturan:** (b) kolom kuitansi tidak untuk PA/KPA; (c) tidak ditampilkan ke PA/KPA (ditolak server); (d) per seksi & subkegiatan.
- **Rujukan:** D01 §9 poin 2b–2d, 3
- **Keputusan pemilik yang sudah masuk dokumen:** N-07: laporan (d) menjadi "Laporan realisasi per seksi dan subkegiatan" dengan kolom "Realisasi (%)".

### LAP-04 — Laporan (e) Rekap isian SPJ per jenis belanja (Excel)
- **Peran:** idem
- **Aturan:** Satu sheet per jenis belanja; kolom = gabungan field versi form; satu baris per SPJ/entri blok; opsional kosong tampil kosong; tanpa pajak, tanpa kolom BKU/kode/bruto; NIP & No. Rekening penuh tanpa masking; filter aktif membatasi unduhan.
- **Rujukan:** D01 §9 poin 2e, 4, 6–9; D05 §2

### LAP-05 — Laporan (f) Rekap pajak per jenis pajak
- **Peran:** idem
- **Aturan:** Hanya SPJ ber-BKU; satu baris per entri pajak; satu sheet per jenis pajak; tanpa subtotal; filter jenis pajak/seksi/TA/periode; PA/KPA tanpa kolom Tanggal Kuitansi; Admin ditolak.
- **Rujukan:** D01 §9 poin 2f, 10; D05 §2

### LAP-06 — Laporan (g) Rincian Kartu Kendali Kegiatan
- **Peran:** idem
- **Aturan:** Satu blok per pasangan subkegiatan+rekening yang punya realisasi BKU; kolom No, Tanggal, No. Bukti, Uraian, Realisasi, Sisa Anggaran (tanpa komitmen); baris TOTAL; blok ke bawah; header PDF diulang; filter tidak mereset sisa anggaran.
- **Rujukan:** D01 §9 poin 2g

### LAP-07 — Penyusunan Laporan Kustom (halaman sendiri)
- **Peran:** Bendahara, PPTK, PA/KPA, Verifikator
- **Aturan:** Matriks kolom per peran divalidasi server (tolak seluruh permintaan bila kolom terlarang); PA/KPA tanpa uraian, penerima, NIP/NIK, no. rekening, rekening belanja; tanpa Status SPJ; pratinjau ≤ 10 baris; unduh .xlsx/.pdf; tanpa audit; NIP/NIK & no. rekening penuh.
- **Rujukan:** D01 §9 poin 12

## 3. Kutipan bagian dokumen yang dirujuk (apa adanya)
Bagian berikut disalin tanpa perubahan dari dokumen sumber. Bila ringkasan di bagian 2 berbeda dengan kutipan ini, kutipan yang berlaku.

#### Dokumen 01 §9

## 9. KATALOG LAPORAN
1. **Format:** Setiap laporan tersedia dalam PDF untuk cetak dan arsip, serta Excel untuk diolah lebih lanjut, sesuai hak peran.
2. **Daftar laporan:**
   a. Rekap realisasi per seksi: pagu, realisasi BKU, Realisasi (%) (Realisasi BKU ÷ Pagu), dan status per seksi.
   b. Buku Kas (BKU): nomor BKU (input manual Bendahara, unik per TA), tanggal BKU, nominal, dan kuitansi terkait (kolom ini tidak ditampilkan untuk PA/KPA). BKU AMANDA murni mencatat pembukuan realisasi pengeluaran belanja per kuitansi/SPJ dan tidak mencatat transaksi penerimaan kas, SP2D, atau saldo Uang Persediaan (UP/GU/TU). Sistem membebaskan penanggalan tanpa batasan kronologis antar-tanggal kuitansi, SPJ, dan BKU.
   c. Daftar kuitansi dan SPJ: nomor, tanggal, seksi, status kuitansi (Aktif atau Terkunci), dan status SPJ. Hanya kuitansi dan SPJ yang sudah Dibukukan (BKU tercatat). Laporan ini tidak ditampilkan kepada PA/KPA.
   d. Laporan realisasi per seksi dan subkegiatan: kolom Realisasi (%) (Realisasi BKU ÷ Pagu) per seksi dan per subkegiatan.
   e. Rekap isian SPJ per jenis belanja: per SPJ, isian Form Dinamis dalam format Excel. Isian mengikuti versi form saat SPJ dibuat (Dokumen 04 §2.2). Susunan kolomnya diatur pada poin 6. Pajak tidak termasuk dalam laporan ini. Laporan ini berlaku untuk semua peran yang berhak.
   f. Rekap pajak per jenis pajak: entri pajak pada SPJ yang sudah memiliki BKU, dikelompokkan per jenis pajak. Diatur pada poin 10.
   g. Rincian Kartu Kendali Kegiatan (realisasi per subkegiatan dan rekening belanja): laporan baru yang terpisah dari laporan (d). Tampil dalam PDF dan Excel dengan susunan berikut:
      1) Kepala: logo dan nama instansi, judul "Rincian Kartu Kendali Kegiatan", dan keterangan "per [tanggal akhir periode laporan]".
      2) Blok identitas: kode dan nama subkegiatan, kode dan nama rekening belanja, serta pagu akhir pasangan subkegiatan dan rekening pada TA tersebut (Dokumen 04 §2.2). Unit organisasi, program, kegiatan, dan aktivitas tidak ditampilkan.
      3) Satu blok per pasangan subkegiatan dan rekening belanja yang sudah memiliki realisasi BKU. Pasangan atau rekening tanpa realisasi tidak membentuk blok.
      4) Kolom tabel: No; Tanggal (tanggal BKU); No. Bukti (nomor BKU); Uraian (uraian kuitansi yang dibukukan); Realisasi (nominal bruto BKU); Sisa Anggaran (pagu akhir dikurangi akumulasi realisasi BKU sampai baris tersebut, tanpa komitmen). Kolom LS, UP/GU/TU, dan kolom Form Dinamis tidak ada.
      5) Urutan baris menurut tanggal BKU naik, lalu nomor BKU. Setiap blok diakhiri baris TOTAL yang memuat total realisasi dan sisa anggaran akhir.
      6) Blok disusun ke bawah, satu blok setelah blok lain, tidak berdampingan. Dalam PDF, blok boleh berlanjut ke halaman berikutnya dengan header kolom diulang. Dalam Excel, setiap blok memakai baris judul sendiri dan dipisahkan satu baris kosong dalam satu sheet.
      7) Filter tersedia untuk seksi, subkegiatan, dan periode tanggal BKU. Filter hanya membatasi baris yang tampil dan diunduh; sisa anggaran selalu dihitung dari awal TA, tidak dimulai ulang dari tanggal awal periode filter.
      8) Cakupan per peran mengikuti laporan (a) pada poin 3. Hanya data SPJ Dibukukan yang masuk laporan.
   h. Unduhan lampiran PDF SPJ diatur pada Dokumen 02 §9 dan bukan bagian dari katalog ini.
3. **Cakupan per peran:** Bendahara dan Verifikator melihat seluruh seksi. PPTK hanya melihat seksinya. Pengawas/Auditor melihat seluruh seksi pada TA yang ditugaskan dalam mode baca saja. Admin tidak mendapat laporan apa pun. Akses PA/KPA: laporan (a), (b), (d), (e), (f), dan (g) untuk seluruh seksi, hanya data SPJ Dibukukan. Laporan (c) tidak ditampilkan kepada PA/KPA. Laporan (b) dan (f) tampil tanpa kolom kuitansi untuk PA/KPA. Laporan (f) mengikuti cakupan laporan (e). Laporan (g) mengikuti cakupan laporan (a). Seluruh laporan berbasis realisasi: hanya SPJ berstatus Dibukukan (BKU tercatat) yang masuk laporan. Komitmen kuitansi yang belum dibukukan dan SPJ berstatus Menunggu BKU tidak dilaporkan.
4. **Pengisian form:** Seksi memilih jenis belanja di awal pembuatan SPJ, dan pilihan itu menentukan Form Dinamis yang tampil. Daftar jenis belanja berasal dari Form Dinamis yang dikelola Admin, bukan daftar tetap di aplikasi. Jenis belanja bukan field di dalam form dan tidak diisi ulang. Seluruh field Form Dinamis diisi manual oleh Seksi. Nilai tidak diwarisi dari rekening belanja dan tidak dihitung otomatis. Laporan (e) menampilkan jawaban tersebut seperti tanggapan Google Form di spreadsheet: satu baris per SPJ, satu kolom per field; jika form memiliki blok berulang, satu baris per entri blok (poin 9). Pengelompokan per jenis belanja mengikuti jenis belanja yang dipilih di awal SPJ. Tampilan dan unduhan diatur pada poin 7 dan 8.
5. **Jejak:** Setiap unduhan atau cetakan laporan oleh Pengawas/Auditor tercatat di Jejak Audit (§8 poin 8).
6. **Susunan kolom laporan e (Excel):** Setiap jenis belanja menjadi satu sheet di file Excel. Kolom sheet adalah gabungan field dari semua versi form yang dipakai SPJ di sheet tersebut, diurutkan mengikuti versi terbaru; field yang tidak ada pada versi form SPJ tertentu tampil kosong. Jenis belanja tidak menjadi kolom, karena sudah menjadi nama sheet. Contoh untuk jenis belanja perjalanan dinas luar daerah: Nama, NIP, Uraian, Seksi, Nama Rekening Penerima, Nomor Rekening, Nama Bank, Upload SPJ, Nomor Surat Perintah Tugas, Tanggal Surat Perintah Tugas, Golongan Pangkat, Daerah Tujuan, Tanggal Berangkat, Tanggal Kembali, Lama Hari, Uang Harian Per Hari, Total Uang Harian, Uang Transport, Total Biaya Lainnya, Nama Hotel, Tanggal Check In, Tanggal Check Out, Jumlah Malam, Rate/Malam, Total Biaya Penginapan, Dari, Tujuan, lalu kelompok field Penerbangan 1 (Tanggal Penerbangan, Nama Maskapai, Kode Penerbangan, Nomor Tiket, Kode Booking, Asal Keberangkatan, Tujuan Keberangkatan, Harga Tiket), kelompok field Penerbangan 2 dengan kolom yang sama, Total Biaya Tiket, dan Total Yang Dibayarkan.
   - Field yang namanya berulang diberi penanda urut (Penerbangan 1 dan Penerbangan 2) agar kolom dapat dibedakan.
   - Laporan (e) tidak menambahkan kolom BKU, kode subkegiatan, kode rekening, atau kuitansi setelah kolom form.
   - Visibilitas kolom NIP dan Nomor Rekening: Tidak ada penyamaran (masking). Kolom NIP dan Nomor Rekening ditampilkan penuh dan terbuka di seluruh unduhan laporan Excel bagi semua peran yang berhak mengunduh (Bendahara, PPTK untuk seksinya, Verifikator, PA/KPA, dan Pengawas/Auditor). Ketentuan ini tidak berlaku untuk Laporan Kustom; kolom NIP/NIK dan Nomor Rekening pada Laporan Kustom tetap mengikuti Matriks Kolom poin 12 d.
7. **Tampilan dan unduhan:** Laporan (e) tampil di dalam AMANDA sebagai tabel yang dapat difilter, misalnya per jenis belanja, seksi, TA, dan periode. Unduhan Excel hanya memuat baris dan kolom sesuai filter yang sedang aktif. Kolom Excel mengikuti field Form Dinamis dari jenis belanja yang difilter. Setiap jenis belanja memiliki form dan susunan kolomnya sendiri, sehingga perjalanan dinas luar daerah dan belanja habis pakai tidak berbagi kolom. Jika filter mencakup lebih dari satu jenis belanja, Excel berisi satu sheet per jenis belanja yang terpilih, dengan nama sheet sesuai jenis belanja. Sheet tidak digabung karena field tiap jenis belanja berbeda.
8. **Wajib atau opsional:** Admin menandai setiap field Form Dinamis sebagai wajib atau opsional, seperti pengaturan wajib pada Google Form. Field wajib harus terisi sebelum SPJ dapat diajukan. Field opsional yang dikosongkan tersimpan kosong dan tampil kosong di laporan maupun Excel; pengisian dengan tanda strip atau teks pengganti tidak diperlukan.

9. **Blok berulang pada Form Dinamis:**
   a. Admin dapat menambahkan paling banyak **satu blok berulang** per form. Admin memberi nama blok, misalnya "Pelaku", lalu memasukkan field ke dalam blok tersebut. Field di luar blok diisi sekali per SPJ.
   b. Form tanpa blok berulang menghasilkan satu baris per SPJ.
   c. Pada SPJ, Seksi/PPTK mengisi entri pertama blok berulang, lalu menekan "+ Tambah" untuk menambah entri berikutnya. Form dengan blok berulang minimal memiliki satu entri.
   d. Field wajib di dalam blok wajib diisi pada setiap entri. Field opsional yang kosong tetap kosong.
   e. Di laporan dan Excel, setiap entri blok menjadi satu baris. Nilai field di luar blok diulang pada setiap baris SPJ tersebut.
   f. Field biasa yang namanya berulang, seperti Penerbangan 1 dan Penerbangan 2 pada contoh perjalanan dinas di poin 6, bukan blok berulang. Keduanya adalah field tunggal yang dipasang Admin di dalam form.
   g. Struktur blok mengikuti versi form saat SPJ dibuat (Dokumen 04 §2.2).

10. **Rekap pajak per jenis pajak (laporan f):**
   a. Laporan hanya memuat entri pajak pada SPJ yang sudah memiliki BKU (terealisasi), satu baris per entri pajak. SPJ yang belum dibukukan tidak muncul di laporan.
   b. Kolom: Jenis Pajak, Nominal Pajak, Seksi, Jenis Belanja, Kode Subkegiatan, Kode Rekening Belanja, No. BKU, dan Tanggal Kuitansi (kolom Tanggal Kuitansi tidak ditampilkan untuk PA/KPA).
   c. Tampilan di AMANDA dikelompokkan per jenis pajak. Unduhan Excel berisi satu sheet per jenis pajak, sama seperti aturan sheet per jenis belanja (poin 7).
   d. Laporan dapat difilter menurut jenis pajak, seksi, TA, dan periode. Unduhan Excel hanya memuat baris sesuai filter aktif.
   e. Excel tidak memuat subtotal atau total otomatis.
   f. Pajak tidak masuk laporan rekap isian SPJ (laporan e). Nominal pajak tidak mengubah nominal bruto kuitansi.

11. **Mode Pratinjau Interaktif Form Dinamis (Admin):**
   a. Pratinjau dibuka sebagai tab "Pratinjau Langsung" di dalam halaman Visual Live Editor, berdampingan dengan tab "Konfigurasi Editor". Admin dapat beralih seketika antara kedua tab tanpa kehilangan draf. Pratinjau tidak dibuka sebagai pop-up (§15 poin 7 dan Dokumen 05 poin 148).
   b. Pratinjau menguji draf form yang belum disimpan. Tampilannya mengikuti tampilan pengisian PPTK, termasuk field wajib, blok berulang dengan tombol "+ Tambah", dan tag sistem.
   c. Auto-fill NIP/NIK pada tag `[SYS_PERSONNEL_ID]` dan `[SYS_PERSONNEL_NAME]` membaca Direktori Transaksional SPJ secara read-only. Pembacaan ini tidak mengubah direktori dan tidak menambah entri Jejak Audit. Jika NIP/NIK tidak ditemukan, nama diisi manual sesuai §11 poin 2.
   d. Cek bentrok jadwal di pratinjau disimulasikan sepenuhnya dengan data contoh (mock data) yang terisolasi. Pratinjau tidak menjalankan validasi bentrok terhadap SPJ asli dan tidak menampilkan status atau tanggal SPJ operasional kepada Admin.
   e. Seluruh isian dalam pratinjau, termasuk ketikan, entri blok berulang, dan hasil simulasi, hanya berada di memori sisi klien sebagai draf editor. Tidak ada data pratinjau yang disimpan ke server, sehingga tidak diperlukan pembersihan berkala. Pratinjau tidak menghasilkan kuitansi, SPJ, BKU, maupun entri Jejak Audit.
   f. Uji batas maksimal satu blok berulang tetap dilakukan di logika Form Builder (Dokumen 05 poin 58), bukan di pratinjau. Pratinjau berfokus pada kenyamanan pengisian dan responsivitas field bagi PPTK.
   g. Pratinjau hanya dapat diakses Admin. Peran lain tidak memiliki akses ke Visual Live Editor maupun tab pratinjau ini.
   h. Tampilan pratinjau mengikuti Tema Visual Treasury & Market Terminal (§1 Dokumen 03): latar slate/charcoal #0B1120, permukaan #111827, garis tepi #1F2937, tidak memakai layar hitam pekat, dan memenuhi kontras WCAG AA.

12. **Penyusunan Laporan Kustom (On-the-Fly Report Builder):**
   a. Menu "Penyusunan Laporan Kustom" tersedia di panel laporan untuk Bendahara, PPTK, PA/KPA, dan Verifikator. Admin dan Pengawas/Auditor tidak memiliki akses. Pengawas/Auditor tetap memakai Katalog Laporan baku secara baca saja (poin 2 dan 3).
   b. Parameter laporan: Tahun Anggaran mengikuti Workspace TA aktif; cakupan seksi mengikuti peran (PPTK hanya seksinya; Bendahara, PA/KPA, dan Verifikator seluruh seksi); rentang tanggal BKU.
   c. Data bersumber hanya dari SPJ Dibukukan dengan BKU tercatat. Kuitansi Aktif, kuitansi Terkunci, SPJ Draft, dan SPJ Menunggu BKU tidak ikut. Kolom Status SPJ tidak tersedia, karena statusnya selalu Dibukukan.
   d. Pilihan kolom diatur melalui Matriks Kolom yang Diizinkan per Peran berikut. Kolom yang tidak diizinkan tidak ditampilkan pada antarmuka peran tersebut.

| Kolom | Bendahara | PPTK (seksi sendiri) | Verifikator | PA/KPA |
|---|---|---|---|---|
| Tanggal BKU, No. BKU | Ya | Ya | Ya | Ya |
| Kode dan Nama Subkegiatan | Ya | Ya | Ya | Ya |
| Kode dan Nama Rekening Belanja | Ya | Ya | Ya | Tidak |
| Uraian Kuitansi | Ya | Ya | Ya | Tidak |
| Nama Penerima | Ya | Ya | Ya | Tidak |
| Nilai Bruto | Ya | Ya | Ya | Ya |
| Total Pajak | Ya | Ya | Ya | Ya |
| Jumlah Dibayarkan | Ya | Ya | Ya | Ya |
| NIP/NIK dan Nomor Rekening | Ya | Ya | Ya | Tidak |

   e. Server memvalidasi daftar kolom pada setiap pratinjau dan unduhan. Jika daftar memuat kolom yang tidak diizinkan untuk peran tersebut, server menolak seluruh permintaan, termasuk permintaan melalui pemanggilan langsung.
   f. Pratinjau menampilkan paling banyak 10 baris pertama dengan kolom yang dipilih. Unduhan tersedia dalam format Excel (.xlsx) atau PDF (.pdf), dengan baris dan kolom sesuai filter aktif.
   g. Kolom NIP/NIK dan Nomor Rekening ditampilkan penuh tanpa penyamaran (masking) bagi peran yang berhak, sesuai poin 6.
   h. Unduhan laporan kustom oleh Bendahara, PPTK, PA/KPA, atau Verifikator tidak menghasilkan entri Jejak Audit, sesuai aturan poin 5.
   i. Halaman penyusunan laporan kustom berupa halaman sendiri, bukan pop-up (§15 poin 7).


---

#### Dokumen 02 §9

## 9. Unduh lampiran PDF SPJ
1. Lampiran PDF SPJ dapat diunduh oleh: Bendahara, Verifikator, dan PA/KPA untuk seluruh seksi; PPTK untuk seksinya sendiri.
2. Admin, Pengawas/Auditor, dan Publik tidak dapat mengunduh lampiran, termasuk melalui URL langsung.
3. Berkas yang diunduh adalah berkas final yang tersimpan pada SPJ. Berkas asli tidak disimpan sistem; hanya nama dan ukuran aslinya yang tercatat sebagai metadata.

## 4. Skenario uji Dokumen 05 untuk langkah ini (apa adanya)
Format Bagian-Nomor.

- **H-54** (LAP-04): Laporan rekap isian SPJ per jenis belanja dapat diunduh dalam Excel dengan satu sheet per jenis belanja, kolom berupa gabungan field dari versi form yang dipakai SPJ di sheet tersebut, field yang tidak ada pada versi SPJ tertentu tampil kosong (Dokumen 01 §9 poin 6). Kolom NIP dan Nomor Rekening ditampilkan penuh dan terbuka tanpa penyamaran (masking) bagi semua peran yang berhak mengunduh, termasuk PA/KPA. PPTK hanya memperoleh data seksinya; Admin ditolak.
- **H-55** (LAP-04): Field Form Dinamis bertanda wajib tidak dapat diajukan dalam keadaan kosong. Field opsional yang kosong tampil kosong di laporan dan Excel, tanpa tanda strip. Sistem tidak menolak pengajuan SPJ berdasarkan selisih nilai rincian Form Dinamis terhadap nominal bruto kuitansi (pencatatan rincian bersifat informasional murni).
- **H-56** (LAP-04): Filter jenis belanja pada laporan rekap isian SPJ menghasilkan unduhan Excel yang hanya memuat baris dan kolom hasil filter aktif. Jika filter memuat lebih dari satu jenis belanja, setiap jenis belanja menjadi sheet tersendiri yang hanya memuat kolom dan baris jenis belanja tersebut.
- **I-62** (LAP-04): Form tanpa blok berulang menghasilkan satu baris per SPJ di laporan dan Excel.
- **I-63** (LAP-04): Form dengan blok berulang menghasilkan satu baris per entri; nilai field di luar blok diulang pada setiap baris SPJ tersebut.
- **I-65** (LAP-03): PA/KPA dapat melihat laporan a, b, d, e, f, dan g untuk seluruh seksi, hanya data SPJ Dibukukan; kolom kuitansi tidak tampil pada b dan f. Laporan c ditolak di server, termasuk melalui URL langsung.
- **K-75** (LAP-05): Rekap isian SPJ per jenis belanja (skenario 54–56) tidak memuat kolom pajak.
- **K-76** (LAP-05): Rekap pajak per jenis pajak dapat diunduh dalam Excel dengan satu sheet per jenis pajak. Setiap baris adalah satu entri pajak dari SPJ yang sudah memiliki BKU, dan unduhan hanya memuat baris sesuai filter aktif (jenis pajak, seksi, TA, dan periode). Excel tidak memuat subtotal otomatis.
- **K-77** (LAP-05): Rekap pajak per jenis pajak hanya dapat dilihat Bendahara dan Verifikator (seluruh seksi), PPTK (seksinya sendiri), Pengawas (TA yang ditugaskan, baca saja), dan PA/KPA (seluruh seksi, tanpa kolom Tanggal Kuitansi, hanya SPJ Dibukukan). Admin ditolak di server, termasuk melalui URL langsung.
- **Q-124** (LAP-01): Admin tidak melihat menu laporan dan ditolak di server saat URL laporan dipanggil langsung.
- **Q-125** (LAP-01, LAP-03): PA/KPA hanya melihat data SPJ yang sudah Dibukukan (BKU tercatat). Kolom kuitansi tidak muncul pada laporan b dan f untuk PA/KPA.
- **Q-126** (LAP-02): Laporan rekap realisasi per seksi tidak menampilkan komitmen kuitansi aktif maupun sisa SPD bebas.
- **Q-127** (LAP-01): Pencabutan BKU menghapus transaksi tersebut dari seluruh laporan pada pengunduhan berikutnya.
- **Q-128** (SPJ-08): PPTK hanya dapat mengunduh lampiran SPJ seksinya; lampiran seksi lain ditolak di server.
- **Q-129** (SPJ-08): Bendahara, Verifikator, dan PA/KPA dapat mengunduh lampiran SPJ seluruh seksi; Admin, Pengawas/Auditor, dan Publik ditolak, termasuk melalui URL langsung.
- **Q-136** (LAP-06): Rincian Kartu Kendali Kegiatan memuat satu blok per pasangan subkegiatan dan rekening belanja yang sudah memiliki realisasi BKU. Setiap blok memuat pagu akhir pasangan, baris BKU dengan realisasi dan sisa anggaran berjalan (pagu akhir dikurangi akumulasi realisasi BKU, tanpa komitmen), serta baris TOTAL.
- **Q-137** (LAP-06): Rekening belanja atau pasangan subkegiatan tanpa realisasi BKU tidak membentuk blok dan tidak tampil di Rincian Kartu Kendali Kegiatan.
- **Q-138** (LAP-06): Blok kartu kendali tampil ke bawah, satu blok setelah blok lain, pada PDF dan Excel, bukan dalam kolom samping. Pada PDF, header kolom diulang di halaman lanjutan.
- **Q-139** (LAP-06): Rincian Kartu Kendali Kegiatan dapat dilihat sesuai cakupan laporan a. Admin dan Publik ditolak, termasuk melalui URL langsung.
- **Q-140** (LAP-04): Laporan rekap isian SPJ (e) berisi isian Form Dinamis per SPJ dalam Excel; kolom BKU, kode subkegiatan, kode rekening, dan nominal bruto kuitansi tidak muncul.
- **Q-141** (LAP-06): Rincian Kartu Kendali Kegiatan tidak memuat kolom LS, UP/GU/TU, unit organisasi, program, kegiatan, atau aktivitas. Filter periode tanggal BKU membatasi baris yang tampil, sedangkan sisa anggaran tetap dihitung dari awal TA.
- **T-155** (LAP-07): Menu Penyusunan Laporan Kustom tampil untuk Bendahara, PPTK, PA/KPA, dan Verifikator, dan berupa halaman sendiri, bukan pop-up. Admin, Pengawas/Auditor, dan Publik ditolak di server, termasuk melalui URL langsung.
- **T-156** (LAP-07): PPTK hanya dapat memilih cakupan seksinya sendiri. Permintaan dengan seksi lain ditolak di server.
- **T-157** (LAP-07): PA/KPA tidak dapat memilih kolom Uraian Kuitansi, Nama Penerima, NIP/NIK, Nomor Rekening, Kode Rekening Belanja, atau Nama Rekening Belanja. Pratinjau atau unduhan yang memuat salah satu kolom tersebut ditolak seluruhnya di server, termasuk melalui pemanggilan langsung.
- **T-158** (LAP-07): Bendahara dan Verifikator dapat memilih seluruh kolom pada matriks, termasuk NIP/NIK dan Nomor Rekening, yang ditampilkan penuh tanpa penyamaran.
- **T-159** (LAP-07): Kolom Status SPJ tidak tersedia pada antarmuka dan ditolak server jika dikirim.
- **T-160** (LAP-07): Pratinjau dan unduhan hanya memuat SPJ Dibukukan dengan BKU tercatat. Kuitansi Aktif, kuitansi Terkunci, SPJ Draft, dan SPJ Menunggu BKU tidak muncul.
- **T-161** (LAP-07): Pratinjau menampilkan paling banyak 10 baris pertama. Unduhan Excel dan PDF memuat baris dan kolom yang sama dengan filter aktif.
- **T-162** (LAP-07): Pencabutan BKU menghapus transaksi tersebut dari hasil pratinjau dan unduhan berikutnya.
- **T-163** (LAP-07): Unduhan laporan kustom oleh Bendahara, PPTK, PA/KPA, atau Verifikator tidak menghasilkan entri Jejak Audit.

Selesai bila SEMUA skenario yang tercantum di bagian 4 lulus.