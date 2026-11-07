# PAKET LANGKAH 5C1: TEMPLATE, KUITANSI & SPJ

**Sumber kebenaran mutlak:** Dokumen 01 v1.53, Dokumen 02 v1.33, Dokumen 03 v1.58, Dokumen 04 v1.38, Dokumen 05 v1.64.  
**Cakupan paket ini:** Tahap A, yaitu frontend dengan data contoh. Pekerjaan backend Langkah 5 baru dimulai di Tahap B (lihat `SUSUNAN_PENGEMBANGAN_AMANDA_BERTAHAP.md`).

## Perintah kerja
Kerjakan hanya fitur yang tercantum di bagian 1, berurutan dari atas ke bawah, memakai aturan yang tertulis di bagian 2 dan 3. Jangan menambah, mengurangi, atau mengubah aturan bisnis. Bila ada hal yang tidak diatur dokumen, hentikan dan tanyakan, jangan merancang sendiri. Langkah selesai bila seluruh skenario di bagian 4 dapat didemonstrasikan pada antarmuka dengan data contoh.

## 1. Fitur Langkah 5 (urutan kerja)
| Urut | ID | Fitur | Peran | Prioritas | Pekerjaan | Dependensi |
|---|---|---|---|---|---|---|
| 89 | PJK-01 | Pop-up pajak pada SPJ | PPTK | P1 | Frontend | SPJ-04, MST-06 |
| 93 | PJK-02 | Total Pajak, Jumlah dibayarkan & validasi | PPTK, Sistem | P0 | Frontend | PJK-01 |

## 2. Aturan kunci per fitur (ringkasan)
### PJK-01 — Pop-up pajak pada SPJ
- **Peran:** PPTK
- **Aturan:** Muncul setelah isian SPJ disimpan; banyak entri; jenis dari Master aktif; nominal manual; tanpa perhitungan otomatis tarif.
- **Rujukan:** D02 §5; D03 §4 poin 11; D01 §15 poin 6

### PJK-02 — Total Pajak, Jumlah dibayarkan & validasi
- **Peran:** PPTK, Sistem
- **Aturan:** Total Pajak = Σ entri; Jumlah dibayarkan = bruto − Total Pajak; Total Pajak > bruto ditolak di server dengan pesan (bruto, total, batas); = bruto diterima; SPJ tanpa pajak diterima; tidak mengubah bruto/komitmen.
- **Rujukan:** D02 §5; D03 §4 poin 11

## 3. Kutipan bagian dokumen yang dirujuk (apa adanya)
Bagian berikut disalin tanpa perubahan dari dokumen sumber. Bila ringkasan di bagian 2 berbeda dengan kutipan ini, kutipan yang berlaku.

#### Dokumen 02 §5

## 5. Relasi SPJ dan verifikasi
- Satu kuitansi berpasangan dengan satu SPJ (1:1); kuitansi dapat dibuat terlebih dahulu.
- Seksi memilih jenis belanja di awal pembuatan SPJ, dan pilihan itu menentukan Form Dinamis yang tampil. Form disusun Admin per jenis belanja. Isian form manual; jangan mengasumsikan auto-kalkulasi yang belum disepakati.
- SPJ memuat rincian teknis belanja (Form Dinamis), pajak, serta unggahan bukti SPJ.
- Pajak diisi manual oleh Seksi sebagai bagian SPJ. Setelah isian SPJ disimpan, sistem menampilkan pop-up pajak. Seksi dapat menambah beberapa entri pajak; setiap entri memilih jenis pajak dari Master Jenis Pajak dan mengisi nominalnya secara manual. Sistem tidak menghitung pajak secara otomatis dari tarif atau master. Satu-satunya perhitungan otomatis terkait pajak adalah Total Pajak, yaitu jumlah seluruh entri pajak, dan Jumlah yang dibayarkan, yaitu nilai bruto dikurangi Total Pajak. Admin mengelola Master Jenis Pajak. Entri pajak tidak mengubah nominal bruto kuitansi. Sistem menolak penyimpanan entri pajak jika Total Pajak melebihi nilai bruto kuitansi terkait; Total Pajak yang sama dengan bruto tetap diterima, sehingga Jumlah yang dibayarkan bernilai nol. Pesan validasi menampilkan nilai bruto, Total Pajak, dan batas bahwa Total Pajak tidak boleh lebih dari nilai bruto kuitansi; entri yang ditolak tidak tersimpan. Penolakan ini hanya berlaku untuk pajak dan tidak berlaku untuk Form Dinamis. SPJ tanpa pajak diperbolehkan. Pajak tidak masuk Excel rekap isian SPJ; pajak dilaporkan pada rekap pajak per jenis pajak, hanya untuk SPJ yang sudah memiliki BKU (Dokumen 01 §9 poin 10).
- Isian Form Dinamis merupakan rincian administratif yang diisi oleh Seksi/PPTK untuk keperluan pertanggungjawaban. Pengisian ini bersifat pencatatan informasional murni dan tidak menambah maupun mengurangi anggaran. Sistem tidak melakukan validasi perhitungan matematis atau kecocokan antara total rincian pada Form Dinamis dengan nominal bruto kuitansi.
- Isian Form Dinamis disimpan sebagai jawaban SPJ sesuai versi form saat SPJ dibuat, dan dapat direkap per jenis belanja (Dokumen 01 §9). Unduhan Excel rekap tersebut berisi satu sheet per jenis belanja, dengan kolom berupa gabungan field dari versi form yang dipakai SPJ di sheet tersebut (Dokumen 01 §9 poin 6). Form dapat memiliki paling banyak satu blok berulang (Dokumen 01 §9 poin 9). Entri blok disimpan sebagai daftar pada SPJ, dan setiap entri menjadi satu baris di Excel.
- **Standar Format & Batas Berkas Unggahan (Terkunci):**
  - **Format Wajib:** Hanya menerima format `.pdf` (`application/pdf`). Berkas gambar mentah dan format dokumen lain ditolak.
  - **Hard Ceiling Berkas Asal:** Maksimum **30 MB** per berkas PDF sebelum optimasi. Berkas di atas batas ini ditolak sebelum kompresi.
  - **Client-First Threshold:** Berkas berukuran `<= 5 MB` diunggah tanpa kompresi. Berkas `> 5 MB` hingga 30 MB otomatis dikompresi lokal di peramban terlebih dahulu.
  - **Target Hasil:** Ukuran berkas final ditargetkan `<= 10 MB` (ideal `<= 5 MB`) dengan keterbacaan dokumen keuangan tetap terjaga.
  - **Server Fallback:** Jika kompresi peramban gagal, kehabisan memori, atau melewati toleransi proses 15 detik, sistem otomatis mengalihkan optimasi ke worker kompresi server. Kegagalan lokal tidak langsung menggagalkan unggahan.
  - **Integritas & Metadata:** Kompresi hanya mengubah representasi fisik berkas PDF, tidak mengubah Form Dinamis, data Excel, atau data transaksi terstruktur. Sistem mencatat nama dan ukuran berkas asli sebagai metadata, beserta ukuran akhir. Yang disimpan hanya berkas final hasil kompresi; berkas asli tidak disimpan. Berkas final dihapus bersama TA saat retensi 12 tahun.
  - **Keterbacaan:** Target kompresi sekitar 150 DPI dan kualitas JPEG gambar minimal 70% sebagai pedoman teknis; teks nominal, tanda tangan, dan stempel harus tetap terbaca jelas.
  - **Uji Pra-Rilis:** Pengujian menggunakan PDF berukuran kecil, menengah, dan mendekati batas 30 MB pada perangkat kelas rendah; berkas hasil harus lolos pemeriksaan visual dan dapat diunduh kembali.
- **Status SPJ:** SPJ berstatus **Terkunci** sejak dikirim ke Verifikator dan tidak dapat diedit selama Terkunci. Setelah disetujui Verifikator, SPJ berstatus Menunggu BKU hingga Bendahara mencatat BKU; sesudah itu SPJ berstatus Dibukukan. SPJ Menunggu BKU dan Dibukukan tetap Terkunci, dan kuitansi terkait tetap Terkunci.
- **Penandatangan SPJ saat Plh./Plt.:** Tanggal pengajuan SPJ ke Verifikator menentukan pejabat penanggung jawab pada dokumen SPJ dan Hasil Verifikasi SPJ. SPJ yang diajukan sebelum delegasi dimulai tetap atas nama pejabat definitif, meskipun diverifikasi saat delegasi Plh./Plt. berjalan, karena penguncian terjadi sejak pengiriman.
- Verifikator dapat mengembalikan SPJ kepada Seksi sebagai Draft dengan catatan revisi wajib. Pengembalian membuka kunci SPJ, tetapi tidak melepas komitmen kuitansi dari SPD. Kuitansi tetap Terkunci selama SPJ masih terkait.
- SPJ berstatus Draft, yaitu yang belum dikirim atau dikembalikan Verifikator, boleh dilepas atau dibatalkan oleh Seksi. Kuitansi terkait kembali Aktif tanpa jejak. SPJ yang sudah dikirim berstatus Terkunci dan hanya dapat dilepas setelah dikembalikan Verifikator menjadi Draft. Jika BKU sudah dicatat, tindakan mengikuti pencabutan berjenjang §6.2.


- **Pengisian Rincian Rekening Bank Penerima (Split View Workspace):**
  - Pada formulir rincian penerima SPJ, antarmuka ditampilkan dalam mode layar terbagi (*Split View*):
    - **Panel Sisi Kiri (Direktori Rekening Bank):** Menyediakan daftar rekening yang telah terdaftar dengan kotak pencarian terpadu (*omni-search*). Pencarian dapat dilakukan secara fleksibel melalui Nama Penerima, Alias/Instansi, atau Nomor Rekening. Menekan tombol *"Pilih / Gunakan"* langsung mengisi rincian ke form sisi kanan secara otomatis.
    - **Panel Sisi Kanan (Form Rincian SPJ):** Tempat PPTK melengkapi data penerima pembayaran. Jika data belum tersedia di direktori kiri, PPTK mengetik manual data baru tanpa validasi angka/format unik yang membatasi.
  - **Auto-Capture Rekening Baru:** Saat rincian atau draf SPJ disimpan, data rekening baru otomatis tersimpan ke Direktori Rekening Bank sistem untuk pemakaian berulang di masa mendatang.
  - **Snapshot Permanen pada SPJ:** Data rekening yang dipilih/diinput pada SPJ disalin sebagai snapshot permanen dokumen transaksi. Pembersihan data atau penggabungan duplikat oleh Admin di direktori tidak mengubah data SPJ yang sudah berstatus Terkunci, Menunggu BKU, atau Dibukukan.
  - **Dampak Pembatalan SPJ Draft:** Pembatalan SPJ Draft menghapus dokumen SPJ secara bersih, namun data rekening baru yang sempat ter-capture ke Direktori Rekening Bank tetap tersimpan di direktori.

#### Dokumen 03 §4

## 4. PPTK / Seksi
1. Melihat seksi dan subkegiatan yang ditetapkan untuknya pada TA.
2. Setelah alokasi Bendahara tersedia, membagi pagu subkegiatan ke rekening belanja hingga total rekening sama persis dengan pagu subkegiatan. Satu rekening belanja dapat dialokasikan di lebih dari satu subkegiatan milik seksinya; setiap pasangan dialokasikan terpisah dan pasangan yang sama tidak boleh ganda.
3. Menyelesaikan alokasi sesuai tenggat. Jika satu seksi belum seimbang, pembuatan kuitansi ditahan untuk semua seksi.
4. Setelah gatekeeper terbuka, membuat kuitansi dengan memilih subkegiatan dan rekening, mengisi nominal bruto, uraian, penerima dan tanggal kuitansi.
5. Kuitansi mengikat saldo SPD sebagai komitmen. SPJ merupakan alur terpisah setelah kuitansi, sesuai aturan SPJ yang disepakati. Kuitansi Aktif dapat diedit atau dibatalkan sampai SPJ Draft dibuat pada status TA Aktif Penuh; pada Masa Transisi kuitansi Aktif hanya dapat dibatalkan, tidak diedit. Sejak SPJ Draft dibuat, kuitansi Terkunci. SPJ Draft dapat dilepas atau dibatalkan, dan kuitansinya kembali Aktif.
6. Seksi tidak boleh melakukan pergeseran anggaran.
7. Tidak melihat Pagu Induk instansi. Jejak Audit yang terlihat hanya entri milik seksinya sendiri.
8. Melihat drill-down anggaran hanya untuk seksinya: seksi → subkegiatan → rekening belanja.
9. Mengunduh laporan seksinya dalam PDF atau Excel (Dokumen 01 §9).
10. Mengisi Form Dinamis SPJ sesuai jenis belanja yang dipilih di awal SPJ. Jika form memiliki blok berulang, PPTK menambah entri sesuai jumlah item atau orang yang dicakup SPJ (Dokumen 01 §9 poin 9).

11. Mengisi pajak pada SPJ setelah isian SPJ disimpan: memilih jenis pajak dari Master Jenis Pajak, mengisi nominal secara manual, dan dapat menambah beberapa entri. Sistem tidak menghitung pajak secara otomatis dari tarif atau master. Satu-satunya perhitungan otomatis terkait pajak adalah Total Pajak, yaitu jumlah seluruh entri pajak, dan Jumlah yang dibayarkan, yaitu nilai bruto dikurangi Total Pajak. Sistem menolak penyimpanan jika Total Pajak melebihi nilai bruto kuitansi dan menampilkan pesan validasi yang menjelaskan batas tersebut (Dokumen 02 §5).
12. Mengunduh lampiran PDF SPJ seksinya (Dokumen 02 §9).
13. Mencetak Hasil Verifikasi SPJ dengan barcode untuk SPJ seksinya setelah SPJ disetujui Verifikator (Dokumen 02 §8).
14. Selama menjadi Plh./Plt. PPTK, menjalankan kewenangan PPTK untuk seksinya. Tidak memverifikasi SPJ yang ia ajukan atau kelola sendiri (Dokumen 01 §6 poin 9).

- Menyusun dan mengunduh laporan kustom untuk seksinya sendiri, dengan pilihan kolom sesuai Matriks Kolom yang Diizinkan per Peran (Dokumen 01 §9 poin 12).

#### Dokumen 01 §15

## 15. PENCARIAN, FILTER, DAN POP-UP (ATURAN UMUM ANTARMUKA)

1. **Daftar yang memakai pencarian dan filter:** Kuitansi, SPJ, BKU, Jejak Audit, Subkegiatan, Rekening Belanja, Personel, Akun, Akun Pengawas/Auditor, Direktori Rekening Bank, dan Direktori Transaksional SPJ. Daftar ini tumbuh seiring data TA dan master.
2. **Daftar tanpa pencarian:** Master SOTK dan Jenis Pajak. Datanya kecil dan jarang berubah sehingga cukup ditampilkan penuh.
3. **Pencarian:** satu kotak yang menyaring hasil langsung saat diketik. Pencarian mencocokkan kode, nama, nomor BKU, dan uraian sesuai daftar. Pencarian hanya bersifat membaca dan tidak mengubah data.
4. **Filter per daftar:** hanya field yang dipakai untuk memilah. Kuitansi dan SPJ: status, seksi, periode, dan jenis belanja. BKU: seksi, periode, dan status. Subkegiatan dan Rekening Belanja: status. Personel dan Akun: status akun dan peran. Filter dapat dikombinasikan dan dihapus sekaligus dengan satu tombol reset.
5. **Batas cakupan data:** pencarian dan filter hanya bekerja dalam cakupan data peran pengguna, sesuai Dokumen 05. Hasil di luar cakupan tidak pernah ditampilkan, termasuk melalui pencarian langsung.
6. **Pop-up untuk aksi singkat:** aksi yang muat tanpa scroll dalam sekitar empat field, dan semua konfirmasi yang tidak dapat dibatalkan, dibuka dalam pop-up. Contoh: tambah atau ubah unit kerja, tambah entri pajak, nonaktifkan akun dengan alasan, reset password, dan pencabutan BKU dengan konfirmasi.
7. **Halaman sendiri untuk isian panjang:** buat kuitansi, buat atau lengkapi SPJ, Form Dinamis, Visual Live Editor, dasbor, dan seluruh laporan. Aturan praktisnya: jika form muat di layar tanpa scroll, gunakan pop-up; jika tidak, gunakan halaman.
8. **Jejak audit tidak berubah:** aksi yang dilakukan melalui pop-up tetap dicatat sesuai aturan jejak audit yang berlaku untuk aksi tersebut, tanpa jalur tercatat yang berbeda.

## 4. Skenario uji Dokumen 05 untuk langkah ini (apa adanya)
Format Bagian-Nomor.

- **K-71** (PJK-01, PJK-02): Pajak SPJ diisi manual oleh Seksi. Sistem tidak menghitung pajak secara otomatis dari tarif atau master. Satu-satunya perhitungan otomatis terkait pajak adalah Total Pajak, yaitu jumlah seluruh entri pajak, dan Jumlah yang dibayarkan, yaitu nilai bruto dikurangi Total Pajak, dan tidak mengubah nominal kuitansi berdasarkan pajak.
- **K-72** (PJK-01): Setelah isian SPJ disimpan, sistem menampilkan pop-up pajak. Seksi dapat menambah beberapa entri pajak; setiap entri memilih jenis pajak dan mengisi nominalnya.
- **K-73** (PJK-01): Pilihan jenis pajak hanya berisi Master Jenis Pajak berstatus aktif. Admin mengelola master tersebut; peran lain ditolak di server.
- **K-74** (PJK-02): Entri pajak tersimpan pada SPJ dan tidak mengubah nominal bruto kuitansi maupun komitmen SPD. SPJ tanpa pajak diterima.
- **K-74a** (PJK-02): Entri pajak yang membuat Total Pajak melebihi nilai bruto kuitansi ditolak saat disimpan. Pesan validasi menampilkan nilai bruto, Total Pajak, dan batas bahwa Total Pajak tidak boleh lebih dari nilai bruto kuitansi; entri tidak tersimpan dan Total Pajak tidak berubah. Penolakan dilakukan di server, termasuk pada permintaan langsung tanpa melalui formulir.
- **K-74b** (PJK-02): Entri pajak dengan Total Pajak sama dengan atau kurang dari nilai bruto diterima, dan Jumlah yang dibayarkan dihitung sebagai nilai bruto dikurangi Total Pajak sesuai 131e.

Selesai bila SEMUA skenario yang tercantum di bagian 4 lulus.