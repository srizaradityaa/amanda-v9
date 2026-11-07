# Data Contoh Uji Manual AMANDA (Langkah 3, 4, dan 5A, Tahap A)

Data ini hanya ada di memori (data contoh). Setiap muat ulang halaman, data kembali ke kondisi awal. Tanggal delegasi dan masa akses pengawas dihitung dari hari ini, jadi status "berjalan" dan "sudah lewat" tetap benar saat diuji.

Password semua akun: `amanda123`

## Akun

| Username | Password | Peran | TA yang tersedia |
|---|---|---|---|
| `admin` | amanda123 | Admin Sistem | Semua TA (dasbor Admin) |
| `198501012010011001` | amanda123 | PA/KPA (Hendra Wijaya) | TA 2026 (Aktif Penuh), TA 2025 (Arsip), TA 2027 (Draft) |
| `198203152009012003` | amanda123 | Bendahara (Siti Rahmawati) | TA 2026, TA 2027 |
| `198911112014032007` | amanda123 | Verifikator (Dewi Anggraini) | TA 2026, TA 2027 |
| `198807202012011004` | amanda123 | PPTK Sekretariat (Budi Santoso) | TA 2026, TA 2027 |
| `199002102015042005` | amanda123 | PPTK Seksi Perencanaan (Maya Lestari) | TA 2026 |
| `197505052008011006` | amanda123 | PPTK Seksi Keuangan (Rahmat Hidayat) | TA 2026, TA 2027 |
| `198601252011011008` | amanda123 | PPTK Seksi PBJ (Agus Prasetiyo), status NON-ACTIVE | Login ditolak (masih punya penugasan aktif di TA 2026) |
| `3210014503900001` | amanda123 | Plh. PPTK Seksi Perencanaan (Nina Marlina) | TA 2026, lewat delegasi aktif |
| `rizal.auditor@balangankab.go.id` | amanda123 | Pengawas/Auditor (Inspektorat) | TA 2026, TA 2025 |
| `lestari.auditor@bpkp.go.id` | amanda123 | Pengawas/Auditor (BPKP) | Login ditolak (masa akses sudah berakhir) |

Akun Pengawas masuk memakai alamat email, bukan NIP.

## Data pendukung

- TA 2026: Aktif Penuh (transaksi sudah ada).
- TA 2025: Arsip Read-Only.
- TA 2027: Draft, pagu terisi, checklist lengkap. Penugasan bersifat provisional dan belum ada SK. Belum ada alokasi, sehingga alur Anggaran diuji dari nol di TA ini.
- Personel tanpa akun: Eko Saputra (pernah PPTK Seksi Perencanaan, kini berakhir), Yuni Astuti (dipakai sebagai calon Plh./Plt.), dan personel lain yang belum punya akun.
- Penugasan lama berakhir: Eko Saputra sebagai PPTK Seksi Perencanaan (berakhir 40 hari lalu, SK-004/2026).
- Delegasi berjalan: Nina Marlina sebagai Plh. PPTK Seksi Perencanaan (menggantikan Maya Lestari), 5 hari lalu s.d. 20 hari lagi.
- Delegasi lewat: Yuni Astuti sebagai Plh. Bendahara (berakhir 2 hari lalu). Status masih "Delegasi Aktif" dan akan berakhir otomatis saat aplikasi dimuat.

## Skenario uji Langkah 3

1. **Masuk per peran.** Masuk dengan setiap akun di tabel di atas. Pilih TA dan peran bila diminta.
2. **Penugasan NON-ACTIVE (A-9c).** Masuk sebagai Admin, buka Tahun Anggaran 2026, tab Penugasan. Baris PPTK Seksi PBJ menampilkan peringatan "NON-ACTIVE, penugasan aktif".
3. **Riwayat penugasan (B-9, B-10).** Di tab Penugasan TA 2026, baris Eko Saputra tampil dengan rentang tanggal mulai dan berakhir, berstatus Berakhir. Tombol SK pada baris itu tetap bisa dibuka dan menampilkan SK-004/2026.
4. **Hapus TA Draft (B-6).** Admin membuka TA 2027 lalu hapus. Tombol hapus hanya aktif untuk Draft tanpa transaksi. TA 2027 harus dibuat ulang bila ingin diuji lagi.
5. **Aktivasi TA kedua (B-10a).** Admin mengubah status TA 2027 menjadi Aktif Penuh. Sistem menolak karena TA 2026 sudah Aktif Penuh.
6. **Ubah pagu (B-7).** Di TA 2027 (Draft), pilih Ubah Pagu lalu ubah nilai. Di TA 2026 tombol ini tidak tersedia.
7. **Arsip TA dan buka kembali (B-8, J-66).** Admin mengubah TA 2026 menjadi Arsip, lalu membukanya kembali sebagai read-only dan memeriksa peringatan SPJ yang belum Dibukukan. Untuk TA 2025 (arsip) cek tampilan read-only.
8. **Tetapkan Plh./Plt. (B-10e, B-10f).** Masuk sebagai PPTK Seksi Keuangan atau Admin, buka Tahun Anggaran 2026, tab Penugasan & Delegasi, lalu tombol Tetapkan Delegasi Plh./Plt.. Pilihan peran: Bendahara, PPTK, PA/KPA. Coba menetapkan Yuni Astuti sebagai Plh. Bendahara (sistem menolak bila personel itu PPTK).
9. **Cabut delegasi dini (B-10g).** Di tab Penugasan & Delegasi, klik ikon cabut pada delegasi Nina Marlina, isi alasan. Status berubah menjadi Dicabut.
10. **Delegasi berakhir otomatis (B-10h).** Muat ulang aplikasi dan masuk. Delegasi Yuni Astuti berubah menjadi Berakhir. Audit "Berakhir otomatis" tercatat sekali; memuat ulang lagi tidak menambah entri. Penjadwal 23:59 WITA sungguhan menunggu backend.
11. **Audit delegasi (B-10j).** Buka menu Audit. Setiap entri delegasi memuat keterangan status "Delegasi Aktif" atau "Dicabut"/"Berakhir" serta ID pejabat definitif dan pengganti.
12. **Login Plh. (B-10i).** Masuk sebagai Nina Marlina (`3210014503900001`). Akun ini hanya punya delegasi, tanpa penugasan tetap.
13. **Bendahara sekaligus PPTK (B-10c).** Di TA 2027, coba menugaskan Bendahara Siti Rahmawati sebagai PPTK: sistem menolak bila personel yang sama sudah Bendahara (Bendahara bukan PPTK).
14. **Pengawas dengan masa akses berakhir (H-47).** Masuk dengan `lestari.auditor@bpkp.go.id`. Sistem menolak dengan pesan masa akses berakhir.
15. **Pengawas aktif.** Masuk dengan `rizal.auditor@balangankab.go.id` dan pilih TA 2026 atau 2025.

## Langkah 4 Bagian 1: Anggaran, SPD & Gatekeeper (data contoh)

Data komitmen dan realisasi (kuitansi `kui-1` sampai `kui-4` dan BKU `bku-1`) adalah **data contoh pengganti transaksi Langkah 5**. Data ini hanya dipakai untuk memperagakan rumus Sisa SPD Bebas dan akan diganti begitu kuitansi dan BKU sungguhan dibuat.

Ledger SPD awal untuk TA 2026 (`ldg-ar-1` sampai `ldg-ar-8`) berisi penerbitan SPD 100% pagu. Entri ini juga data contoh pengganti hasil Sahkan Langkah 4.

Akun untuk Bagian 1:

| Username | Peran | Dipakai untuk |
|---|---|---|
| `198203152009012003` | Bendahara (Siti Rahmawati) | Jendela, alokasi subkegiatan, Sahkan, SPD, versi |
| `198807202012011004` | PPTK Sekretariat (Budi Santoso), TA 2027 | Alokasi rekening seksi Sekretariat |
| `197505052008011006` | PPTK Seksi Keuangan (Rahmat Hidayat), TA 2027 | Alokasi rekening seksi Keuangan |

Langkah dasar: masuk sebagai Bendahara, pilih TA 2027, lalu buka menu **Anggaran**. TA 2027 dipakai karena belum punya alokasi, sehingga alur dari nol bisa diuji. TA 2027 punya dua seksi (Sekretariat dan Seksi Keuangan) dan dua subkegiatan yang total pagunya 12.000.000.000.

Skenario (urutan uji, bukan ID dari paket):

16. **Buka jendela alokasi (ALK-04).** Bendahara, TA 2027, menu Anggaran. Isi tanggal dan jam tutup lalu tekan Atur Jendela. Hasil: status Dibuka dan hitung mundur tampil. Jam tutup yang sudah lewat ditolak dan isian tetap ada. Sebelum jendela dibuka, alokasi tidak bisa disimpan.
17. **Alokasi subkegiatan (ALK-01).** Ubah pagu dua subkegiatan. Hasil: Selisih terhadap Pagu Induk tampil langsung. Total yang belum sama dengan Pagu Induk masih bisa disimpan (dokumen tidak mengatur penolakan di tahap ini), tetapi Selisih tidak 0 dan tampil merah. Pagu negatif atau berisi huruf ditolak dengan pesan dan isian tetap ada.
18. **Alokasi rekening PPTK (ALK-03, ALK-02).** Masuk sebagai PPTK Sekretariat `198807202012011004`. Tambah rekening, isi pagu, lalu Simpan. Hasil: Pagu Seksi tampil dari subkegiatan. Rekening ganda dalam satu subkegiatan atau rekening nonaktif ditolak dengan pesan dan isian tetap ada. Ulangi untuk seksi Keuangan dengan `197505052008011006`.
19. **Pemantau kesiapan dan banner (ALK-05).** Saat seksi belum seimbang, dasbor Bendahara dan banner merah menampilkan seksi yang belum Tuntas. Setelah semua seksi Tuntas, banner hilang.
20. **Sahkan ditolak lalu diterima (ALK-05).** Bendahara menekan Sahkan saat selisih belum 0 atau seksi belum Tuntas: ditolak dengan pesan. Setelah benar, Sahkan menerbitkan SPD 100% pagu dan menambah baris versi.
21. **Versi alokasi (ALK-07).** Setiap Simpan dan Sahkan menambah baris di bagian Versi Alokasi. Baris lama tidak berubah.
22. **SPD dan Sisa SPD Bebas (SPD-01).** Di TA 2026, tabel SPD menampilkan Komitmen (kuitansi Aktif dan Terkunci yang belum BKU) dan Realisasi (BKU Aktif). Sisa SPD Bebas = SPD aktif - komitmen - realisasi. Angkanya dihitung dari data contoh.
23. **Efisiensi ditolak (SPD-02).** Di TA 2026, klik Efisiensi dengan nilai di atas Sisa SPD Bebas. Hasil: ditolak dengan pesan, jendela tetap terbuka, nilai tetap ada. Nilai di bawah sisa diterima dan muncul di Riwayat perubahan SPD. Alasan efisiensi opsional.
24. **Kenaikan SPD (SPD-02).** Klik Naikkan tanpa alasan: ditolak dengan pesan. Kenaikan yang melebihi pagu juga ditolak. Kenaikan yang sah tercatat di Riwayat.
25. **Mini progress per peran (UIX-06).** Topbar menampilkan Pagu, Realisasi, dan Sisa SPD Bebas. Bendahara melihat seluruh instansi, PPTK hanya seksinya. Setelah efisiensi atau kenaikan, angka topbar ikut berubah.
26. **Menu Anggaran hanya untuk Bendahara dan PPTK.** Masuk sebagai Admin atau PA/KPA: menu Anggaran tidak tampil.

## Langkah 4 Bagian 2A: Drill-down anggaran dan Dasbor PPTK

Cara mencoba: masuk sebagai Bendahara `198203152009012003`, pilih TA 2026, lalu buka menu **Rincian Anggaran**. Akun lain yang punya menu ini: PPTK Sekretariat `198807202012011004` (hanya seksinya), Verifikator `198911112014032007`, dan PA/KPA `198501012010011001`. Gunakan TA 2026 karena sudah berisi data.

Hasil yang diharapkan:
- Tingkat pertama adalah daftar seksi. Klik **Buka** untuk melihat subkegiatan, lalu **Buka** lagi untuk rekening belanja. Breadcrumb di atas tabel dapat dipakai untuk kembali.
- PA/KPA berhenti di subkegiatan: tombol Buka tidak tampil pada tingkat subkegiatan.
- PPTK hanya melihat seksinya sendiri.
- Admin dan Pengawas tidak memiliki menu Rincian Anggaran.
- Kartu Pagu Induk tampil di atas daftar untuk Bendahara, Verifikator, dan PA/KPA. Tidak tampil untuk PPTK.

Status (dibangun dan diperiksa lewat kode; belum diuji langsung di antarmuka karena sesi ini tidak memiliki browser):

| ID | Status | Keterangan |
|---|---|---|
| G-37 | Sebagian | Breadcrumb dan tiga tingkat dibangun. Belum diuji di antarmuka. |
| G-38 | Sebagian | Angka tiap tingkat dijumlahkan dari tingkat di bawahnya di lapisan data. Belum diuji di antarmuka. |
| G-39 | Sebagian | Pembatasan seksi PPTK ada di lapisan data. Permintaan lewat URL belum diuji. |
| G-40 | Sebagian | Lapisan data menolak tingkat rekening untuk PA/KPA; tombol Buka disembunyikan. Belum diuji. |
| G-41 | Sebagian | Admin tidak memiliki menu dan ditolak di lapisan data. Belum diuji lewat URL. |
| G-42 | Sebagian | Drill-down membaca nama, kode, dan angka dari data TA (pemetaan dan alokasi TA), tidak dari Master. Data contoh TA 2025 (Arsip Read-Only) sudah berisi alokasi lengkap: subkegiatan, rekening, SPD = pagu, dan total 13,5 M sama dengan Pagu Induk. Akun uji: PA/KPA Hendra Wijaya `198501012010011001` (satu-satunya penugasan TA 2025 selain Pengawas; Bendahara tidak punya penugasan di TA 2025). Langkah: masuk sebagai PA/KPA, pilih TA 2025, buka Rincian Anggaran, dan pastikan angka tampil. Belum diuji di antarmuka. |
| G-43 | Sebagian | Nominal memakai format Rupiah; kode ditampilkan sebagai teks. Belum diuji. |
| G-43a | Sebagian | Rekening disimpan per pasangan subkegiatan dan rekening, sehingga tampil terpisah. Belum diuji dengan data yang memiliki rekening ganda. |
| B-10d | Sebagian | Dasbor PPTK tidak menampilkan Pagu Induk dan tidak punya menu Rincian yang memuat Pagu Induk. Dasbor Pengawas tidak memuat angka anggaran. Belum diuji di antarmuka. |
| N-108 | Terpenuhi karena belum ada | Tidak ada widget early warning atau burn-rate di aplikasi, sehingga tidak ada yang tampil untuk peran lain. Uji ulang di Langkah 8 saat widget dibuat. |
| DRL-04 | Sebagian | Kartu Pagu Induk tersendiri tampil di dasbor Bendahara, Verifikator, dan PA/KPA. PPTK dan Pengawas tidak melihat kartu ini. Admin memiliki kartu TA dengan Pagu Induk sendiri. Belum diuji di antarmuka. |
| C-15a | Sebagian | Admin melihat banner dan countdown hanya baca, dari data, bila sesinya memiliki TA aktif terpilih. Banner Admin di dasbor dihapus agar tidak ganda dengan banner global di App. Belum diuji di antarmuka. |
| DSB-03 | Sebagian | Dasbor PPTK menampilkan banner dan countdown dinamis, status gatekeeper yang dihitung, ringkasan seksi, kuitansi Aktif, dan SPJ Draft dengan catatan revisi. Belum diuji di antarmuka. |

## Langkah 4 Bagian 2B: APBD-P, Sahkan ulang, dan dasbor Bendahara (data contoh)

Cara mencoba APBD-P: masuk sebagai Admin, buka **Tahun Anggaran**, lalu tekan **Aktifkan APBD-P** pada TA 2026 (Aktif Penuh, sudah disahkan). Isi Pagu Induk perubahan dan tekan Aktifkan. Pengisian yang galat tetap ada di kolom.

Cara mencoba Sahkan ulang: masuk sebagai Bendahara `198203152009012003` untuk TA 2026. Buka **Jendela** dan atur waktu tutup agar PPTK bisa mengisi (jendela tertutup otomatis setelah APBD-P). Sesuaikan pagu lewat panel Alokasi, lalu tekan **Sahkan ulang** setelah semua seksi Seimbang. Pagu rekening di bawah realisasi dan komitmen ditolak dengan pesan galat.

Status (dibangun dan diperiksa lewat kode; belum diuji langsung di antarmuka):

| ID | Status | Keterangan |
|---|---|---|
| TA-09 | Sebagian | Admin mengaktifkan APBD-P lewat modal, memasukkan Pagu Induk perubahan, dan jendela tutup. Lapisan data menolak bila TA belum Aktif Penuh atau alokasi belum disahkan. |
| SPD-04 | Sebagian | Panel Penyesuaian APBD-P di halaman Bendahara menampilkan pagu murni, pagu saat ini, dan realisasi + komitmen per rekening. Penyesuaian pagu tetap lewat panel alokasi yang sudah ada. |
| ALK-06 | Sebagian | Tombol Sahkan berubah menjadi Sahkan ulang bila APBD-P aktif. Galat ditampilkan dan isian tidak dikosongkan. |
| DSB-02 | Sebagian | Dasbor Bendahara memuat ringkasan pagu alokasi, realisasi BKU, sisa SPD bebas, serapan, dan countdown jendela dalam satu baris ticker. Kepadatan Pro Mode (baris 32 px, ticker) diterapkan pada dasbor Bendahara, PA/KPA, dan Verifikator untuk layar 768 px ke atas. Di bawah 768 px tampil mode standar (baris 48 px). Tidak ada tombol ganti mode. Cakupan data tidak berubah. Belum diuji di browser. |
| UIX-09 | Sebagian | Banner dan countdown tampil untuk semua peran kecuali Pengawas (dari App). Countdown hilang bila semua seksi Seimbang. |
| SPD-03 | Sebagian | Pergeseran berjalan di lapisan data dan diuji dengan skrip: penolakan peran, bilangan bulat, sumber sama tujuan, dan sisa SPD; nomor `Pergeseran/001/2026` lalu `002`; total pagu subkegiatan tetap. Pada pergeseran antar-subkegiatan, pagu subkegiatan sumber turun dan tujuan naik sebesar nilai yang sama, sesuai instruksi pengguna (dokumen tidak mengatur hal ini). Panel Geser Anggaran dipasang di halaman Bendahara; belum diuji di browser. |
| D-18 | Sebagian | SPD terbit hanya saat Sahkan. Belum diuji di antarmuka. |
| D-21 | Sebagian | Hanya Bendahara yang melihat panel pergeseran. Belum diuji di antarmuka. |
| D-22 | Sebagian | Nilai dibatasi sisa SPD bebas sumber, ditolak di lapisan data. Belum diuji di antarmuka. |
| D-22a | Sebagian | Tujuan harus pasangan subkegiatan-rekening yang sudah dialokasikan pada TA yang sama, ditolak di lapisan data. Belum diuji di antarmuka. |
| D-23 | Sebagian | Nomor referensi `Pergeseran/NNN/tahun` dibuat otomatis per TA dan dicatat di ledger. Belum diuji di antarmuka. |
| D-23e | Sebagian | Jejak audit mencatat aktor, nomor referensi, rekening sumber (-), rekening tujuan (+), dan nilai. Belum diuji di antarmuka. |
| E-24 | Sebagian | Data contoh TA 2026 memuat versi pagu murni (13 baris) dan tidak tertimpa APBD-P (diuji dengan skrip). Panel APBD-P menampilkan pagu murni, pagu saat ini, dan realisasi + komitmen. Kolom perubahan/pergeseran dan pagu akhir berjenjang belum ada di panel. Belum diuji di browser. |
| E-25 | Sebagian | Diuji dengan skrip: pagu rekening di bawah realisasi + komitmen (Rp 5.000.000) ditolak saat simpan. Belum diuji di browser. |
| E-26 | Belum | Kuitansi belum menyimpan snapshot versi anggaran saat terbit, sehingga transaksi lama belum dapat menunjuk versi murni. Tidak diuji. |
| E-26a | Sebagian | Diuji dengan skrip: Sahkan ulang ditolak saat selisih Rp 1.000.000.000, lalu berhasil setelah subkegiatan dan rekening seimbang. Versi perubahan tercatat. Penahanan kuitansi bergantung pada C-17b yang belum dipasang. |
| C-15 | Sebagian | Kuitansi dan SPJ baru tertahan lewat banner. Tombol Buat Kuitansi belum dinonaktifkan. |
| C-15a | Sebagian | Lihat bagian Bagian 2A. |
| C-15b | Belum | Belum diverifikasi. |
| C-17 | Belum | Pembukaan transaksi setelah gerbang belum diverifikasi. |
| C-17b | Belum | Tombol Buat Kuitansi belum dipasang (dikerjakan pada tahap berikutnya). |
| H-52 | Sebagian | Banner dan countdown disembunyikan untuk Pengawas. Belum diuji di antarmuka. |
| H-53 | Sebagian | Mini progress bar di topbar sudah sesuai per peran dalam kode: Bendahara, PA/KPA, Verifikator seluruh instansi; PPTK seksinya; Admin Pagu Induk saja; Pengawas tanpa bar. Belum diuji di antarmuka. |
| C-12 | Sebagian | Kolom Pagu Seksi di Pemantau Kesiapan dihitung otomatis dari subkegiatan, bukan isian. Belum diuji di antarmuka. |
| C-13 | Sebagian | Alokasi rekening PPTK lewat fungsi validasi di lapisan data. Total rekening terhadap pagu subkegiatan baru ditegakkan saat Sahkan (gerbang). Penolakan saat simpan rekening belum ada; dokumen tidak mengaturnya dengan jelas. Perlu konfirmasi. |
| D-d | Sebagian | Banner Admin kini tampil pada TA Aktif Penuh walau sesi belum memilih TA. Tanpa tombol pengaturan jendela. Belum diuji di antarmuka. |

Catatan: DRL-03 dan G-42 (TA 2025) belum diuji di antarmuka, sehingga status tetap Sebagian.

Catatan Langkah 4 Bagian 2B (lanjutan): TA 2026 memiliki versi pagu murni (13 baris: 5 pagu subkegiatan dan 8 rekening). Pengujian sesi ini dilakukan lewat pemeriksaan kode, typecheck, dan build. Belum ada pengujian di browser, sehingga tidak ada status Terbukti lewat UI.

## Perbaikan uji manual (5 perbaikan)

27. **Ganti Pejabat (PEN-03, B-9).** Masuk sebagai Admin, buka Tahun Anggaran 2026, tab Penugasan. Pada baris penugasan aktif (Bendahara, PPTK, PA/KPA, Verifikator) yang belum berakhir, klik ikon UserPlus "Ganti Pejabat". Pilih personel pengganti dan tanggal efektif. Hasil: penugasan lama berakhir H-1 dari tanggal efektif, penugasan baru dibuat, riwayat lama tetap tampil berstatus Berakhir, dan jejak Audit mencatat pergantian. Tombol ini tidak tampil pada TA Arsip Read-Only. Bendahara tidak boleh diganti oleh personel yang sudah PPTK (D-23b).
28. **Isian Rupiah dengan titik pemisah ribuan.** Semua kolom nominal (alokasi subkegiatan, alokasi rekening PPTK, efisiensi, kenaikan, pergeseran, Pagu Induk saat Buat TA, Ubah Pagu, dan pagu perubahan APBD-P) kini menampilkan titik pemisah ribuan saat diketik (mis. 1.250.000.000). Nilai yang disimpan tetap bilangan bulat tanpa titik. Hanya angka diterima; menempel nilai bertitik dibersihkan otomatis.
29. **Umpan balik Simpan "Tersimpan".** Setiap penyimpanan yang berhasil menampilkan notifikasi "Tersimpan" singkat yang hilang sendiri di pojok kanan bawah. Berlaku pada simpan alokasi subkegiatan, simpan alokasi rekening PPTK, atur jendela, Sahkan, efisiensi, kenaikan, pergeseran, Aktifkan APBD-P, Ubah Pagu, dan Buat TA. Aksi yang galat tidak memunculkan notifikasi. Galat tetap ditampilkan seperti biasa dan isian tidak dikosongkan.
30. **Saring pilihan rekening PPTK.** Saat menambah rekening di alokasi PPTK, rekening yang sudah dipakai di subkegiatan yang sama tidak tampil di daftar pilihan. Rekening nonaktif juga tidak tampil. Baris draf lain di subkegiatan yang sama ikut dihitung, sehingga rekening yang belum tersimpan pun tidak muncul ganda. Penolakan pasangan ganda (C-13b) tetap ditegakkan di lapisan data.
31. **Mini progress bar: Pagu dari seluruh alokasi rekening.** Pagu di topbar kini dihitung dari seluruh alokasi rekening (tidak hanya yang sudah disahkan), sehingga angka Pagu tidak 0 setelah PPTK mengisi pagu namun sebelum Bendahara menekan Sahkan. Realisasi dan Sisa SPD Bebas tetap dihitung hanya dari rekening yang sudah disahkan (memiliki SPD). Cakupan per peran tidak berubah.

## Langkah 5A: Template, Kuitansi & SPJ (Tahap A, frontend dengan data contoh)

Cara mencoba: masuk sebagai Admin (`admin` / `amanda123`). Menu di panel Admin: **Form Dinamis** dan **Template Kuitansi**.

Data contoh Form Dinamis sudah tersedia:
- **Belanja Perjalanan Dinas** (v1): 8 field utama (Uraian, Seksi, Nomor SPT, Tanggal SPT, Daerah Tujuan, Tanggal Berangkat `[SYS_START_DATE]`, Tanggal Kembali `[SYS_END_DATE]`, Uang Harian) + blok berulang "Pelaku" dengan 3 field (NIP/NIK `[SYS_PERSONNEL_ID]`, Nama `[SYS_PERSONNEL_NAME]`, Golongan Pangkat).
- **Belanja Barang Habis Pakai** (v1): 2 field (Uraian, Jumlah Item), tanpa blok berulang.
- **Belanja Jasa Konsultan** (v1): 4 field (Uraian, Nama Konsultan, NIP/NIK Konsultan `[SYS_PERSONNEL_ID]`, Nama Kontak `[SYS_PERSONNEL_NAME]`), tanpa blok berulang.

Direktori Transaksional SPJ (untuk auto-fill pratinjau):
- NIP `198807202012011004` → Budi Santoso, S.T.
- NIP `3210014503900001` → Nina Marlina
- NIP `6701234590123456` → Ahmad Narasumber, S.E.

Mock data bentrok (terisolasi, hanya di pratinjau, I-64e):
- NIP `198807202012011004` terjadwal 2026-11-10 s.d. 2026-11-12
- NIP `3210014503900001` terjadwal 2026-11-15 s.d. 2026-11-15

Skenario uji:

32. **Daftar form (TPL-02).** Admin membuka menu **Form Dinamis**. Tiga jenis belanja tampil di panel kiri: Belanja Perjalanan Dinas, Belanja Barang Habis Pakai, Belanja Jasa Konsultan. Klik salah satu untuk melihat field di tabel. Kolom menampilkan label, tipe, wajib/opsional, dan tag sistem.
33. **Buat form baru (TPL-02).** Isi "Jenis belanja baru" (mis. "Belanja Honoratorium") di panel kiri, klik tombol +. Tambah field dengan tombol "Field" di kanan atas: isi label, pilih tipe, centang wajib/opsional, pilih tag sistem bila perlu. Klik "Simpan Versi Baru". Toast "Tersimpan" muncul. Form baru tampil di daftar kiri.
34. **Edit form = versi baru (TPL-02, I-64).** Buka form yang sudah ada, ubah/tambah/hapus field, lalu "Simpan Versi Baru". Versi bertambah (mis. v1 → v2). Form lama tetap ada di data; `repo.formTerbaru()` mengembalikan versi terbaru.
35. **Maksimal satu blok berulang (I-58).** Saat mengedit form, klik "Blok Berulang" untuk menambah blok. Tombol hilang setelah blok dibuat — tidak bisa menambah blok kedua. Beri nama blok dan tambah field ke dalamnya. Hapus blok dengan tombol "Hapus blok" untuk membuat ulang.
36. **Tag sistem berpasangan (BNT-02, M-89).** Saat menambah field, pilih tag sistem dari dropdown. Pasang `[SYS_PERSONNEL_ID]` tanpa `[SYS_PERSONNEL_NAME]` di konteks yang sama (field utama atau blok), lalu simpan: sistem menolak dengan pesan "harus dipasangkan". Tag dapat dipasang di field utama atau di field dalam blok berulang. `[SYS_START_DATE]` dan `[SYS_END_DATE]` dapat berdiri sendiri.
37. **Template kuitansi (TPL-01).** Admin membuka menu **Template Kuitansi**. Panel kiri "Konfigurasi Editor" menampilkan isian nama instansi, judul dokumen, dan tempat penerima. Preview cetak tampil di panel kanan dengan contoh data. Klik "Simpan Template" → toast "Tersimpan".
38. **Unggah .doc/.docx (TPL-01).** Di panel kiri Template Kuitansi, bagian "Alternatif: unggah template .doc/.docx", klik "Pilih file .doc / .docx". Pilih file .doc atau .docx: nama file tampil dengan ikon dokumen. Coba unggah file .pdf atau .txt: ditolak dengan pesan format tidak didukung. Hapus berkas dengan ikon X. Simpan template untuk menyimpan nama berkas.
39. **Pratinjau Langsung (TPL-03, I-64a).** Buka menu **Form Dinamis**, pilih form "Belanja Perjalanan Dinas", lalu klik tab "Pratinjau Langsung" di kanan atas. Pratinjau tampil di halaman yang sama (bukan pop-up). Beralih ke tab "Konfigurasi Editor" dan kembali: draf isian tetap ada (state React tidak direset).
40. **Field wajib di pratinjau (I-64b).** Di tab Pratinjau Langsung, kosongkan field wajib (ditandai *), lalu tekan "Simulasi Ajukan". Sistem menampilkan peringatan "Wajib diisi: ..." dan simulasi ditolak. Isi field opsional dikosongkan tetap diterima.
41. **Tombol "+ Tambah" blok berulang (I-64c).** Di pratinjau form "Belanja Perjalanan Dinas" (yang punya blok "Pelaku"), tekan "+ Tambah". Entri baru muncul dengan field yang sama (NIP/NIK, Nama, Golongan Pangkat). Hapus entri (kecuali entri terakhir) dengan ikon tempat sampah di pojok kanan setiap entri.
42. **Auto-fill NIP/NIK (I-64d).** Di pratinjau blok "Pelaku", masukkan NIP `198807202012011004` pada field NIP/NIK. Nama "Budi Santoso, S.T." terisi otomatis di field Nama. Masukkan NIP yang tidak terdaftar (mis. `9999999999999999`): nama tetap kosong, diisi manual. Tidak ada entri Jejak Audit yang ditambahkan (periksa menu Jejak Audit sebelum dan sesudah).
43. **Cek bentrok mock (I-64e).** Di pratinjau "Belanja Perjalanan Dinas", isi Tanggal Berangkat `2026-11-10` dan Tanggal Kembali `2026-11-12` di field utama. Tambah dua entri blok: entri 1 dengan NIP `198807202012011004`, entri 2 dengan NIP yang sama. Tekan "Simulasi Ajukan". Sistem menampilkan bentrok: "Bentrok jadwal: NIP/NIK 198807202012011004 pada 2026-11-10–2026-11-12". Mock data terisolasi — tidak membaca SPJ asli.
44. **Pratinjau hanya memori (I-64f).** Setelah pratinjau, muat ulang halaman. Semua isian pratinjau hilang. Tidak ada kuitansi, SPJ, BKU, atau entri Jejak Audit yang tersimpan (periksa menu Jejak Audit dan data contoh tidak berubah).
45. **Akses hanya Admin (I-64g).** Menu "Form Dinamis" dan "Template Kuitansi" hanya tampil untuk Admin. Masuk sebagai Bendahara, PPTK, Verifikator, PA/KPA, atau Pengawas: menu tidak tampil di navigasi.

### Status Langkah 5A (dibangun dan diperiksa lewat kode; belum diuji di browser)

| ID | Status | Keterangan |
|---|---|---|
| TPL-02 | Terbukti di kode | `FormBuilderPage.tsx`: daftar jenis belanja, tambah field (modal), urutan (naik/turun), wajib/opsional, tipe, tag sistem, blok berulang (maks 1), simpan versi baru. `repo.simpanVersiForm`: validasi tag (`validasiTagSistem`), minimum 1 field, nama blok wajib. |
| TPL-01 | Terbukti di kode | `TemplateKuitansiPage.tsx`: konfigurasi editor (nama instansi, judul, tempat), preview cetak F4, unggah .doc/.docx (validasi ekstensi + MIME), hapus berkas, simpan. `repo.simpanTemplateKuitansi`: validasi nama instansi + judul. |
| BNT-02 | Terbukti di kode | `formDinamis.ts` `validasiTagSistem`: cek duplikat tag per konteks, cek pasangan ID/nama. `repo.simpanVersiForm` memanggil validasi sebelum menyimpan. Tag dapat di field utama atau blok. |
| TPL-03 | Terbukti di kode | `FormPreviewTab.tsx`: tab berdampingan "Konfigurasi Editor" / "Pratinjau Langsung" di `FormBuilderPage`, field wajib/opsional, blok berulang "+ Tambah", hapus entri, auto-fill NIP/NIK dari `repo.direktoriTransaksional()`, mock bentrok (`MOCK_SPJ_BENTROK`), simulasi ajukan, hanya memori (useState). |

### Skenario Dokumen 05 bagian 4

| Skenario | Status | Keterangan |
|---|---|---|
| H-55 | Terbukti di kode | Field wajib ditolak kosong di `simulasiAjukan`. Tidak ada validasi matematis terhadap bruto. |
| I-58 | Terbukti di kode | Tombol "Blok Berulang" hilang setelah blok dibuat; tidak bisa tambah blok kedua. |
| I-64 | Terbukti di kode | `simpanVersiForm` membuat versi baru; form lama tetap di `data.formDinamis`. |
| I-64a | Terbukti di kode | Tab di `FormBuilderPage` state `tab`; beralih tidak reset `draft`. |
| I-64b | Terbukti di kode | `simulasiAjukan` mengumpulkan field wajib kosong; tampilkan peringatan. |
| I-64c | Terbukti di kode | Tombol "+ Tambah" menambah entri; ikon tempat sampah hapus entri (kecuali terakhir). |
| I-64d | Terbukti di kode | `set()` mencari `repo.direktoriTransaksional()` saat tag `[SYS_PERSONNEL_ID]`; tidak menambah audit. |
| I-64e | Terbukti di kode | `MOCK_SPJ_BENTROK` terisolasi; `rentangOverlap` cek inklusif. Tidak membaca `data.spj`. |
| I-64f | Terbukti di kode | Semua state `useState` di `FormPreviewTab`; tidak ada persistensi. |
| I-64g | Terbukti di kode | `buildNav` di `App.tsx`: menu Form Dinamis & Template Kuitansi hanya di `role === 'admin'`. |
| M-89 | Terbukti di kode | `validasiTagSistem` menolak ID tanpa nama (atau sebaliknya) dalam konteks yang sama. |

## Langkah 5B: Kuitansi & SPJ (Tahap A, frontend dengan data contoh)

Cara mencoba: masuk sebagai PPTK seksi yang memiliki kuitansi contoh (mis. seksi "Seksi Pengadaan" pada TA 2026). Menu **Kuitansi** dan **SPJ** ada di panel PPTK.

Data contoh TA 2026 (Aktif Penuh):
- kui-1: Aktif, Honorarium kegiatan rapat koordinasi, Rp 5.000.000, belum ada SPJ.
- kui-2: Terkunci, Pembelian ATK habis pakai triwulan I, SPJ spj-2 berstatus Draft (dapat dilepas).
- kui-3: Terkunci, Pengadaan kertas fotokopi, SPJ spj-3 Menunggu BKU.
- kui-4: Terkunci, Jasa konsultan perencanaan, SPJ spj-4 Dibukukan.

Data contoh TA 2024 (Masa Transisi):
- kui-mt-1: Aktif. Hanya dapat dibatalkan, tidak dapat diedit atau dibuat baru.

Direktori Transaksional SPJ (BNT-04):
- NIP `198807202012011004` → Budi Santoso, S.T.
- NIP `3210014503900001` → Nina Marlina
- NIP `6701234590123456` → Ahmad Narasumber, S.E.

Skenario uji:

46. **Buat kuitansi (KUI-01).** Di menu Kuitansi, tekan "Buat Kuitansi". Pilih subkegiatan dan rekening (hanya yang sudah disahkan), isi bruto, uraian, penerima, dan tanggal. Melebihi Sisa SPD Bebas ditolak dengan pesan nominal. Tidak ada nomor kuitansi yang dibuat. Toast "Tersimpan" muncul.
47. **Ubah dan batal kuitansi Aktif (KUI-02).** Pada kui-1, tombol ubah dan batal tersedia. Ubah nominal lalu simpan. Batal menghapus kuitansi tanpa jejak (F-33a).
48. **Kuitansi Terkunci (KUI-02, F-30a).** Kuitansi kui-2, kui-3, dan kui-4 menampilkan ikon gembok dan tidak dapat diubah atau dibatalkan. Untuk membuka kunci, SPJ harus dilepas (kui-2 bisa dilepas).
49. **Masa Transisi (B-10c).** Masuk ke TA 2024 bila tersedia. Tombol "Buat Kuitansi" nonaktif. Kuitansi kui-mt-1 hanya bisa dibatalkan.
50. **Cetak F4 (KUI-03, F-27 s.d. F-29).** Tekan ikon cetak pada kuitansi. Header memuat kotak TA, instansi, dan kode subkegiatan serta kode rekening dalam satu baris. Badan memuat terbilang, UNTUK PEMBAYARAN, dan Sub Keg. (nama). Tidak ada No. BKU, Kegiatan, rekening bank, pelaksana, atau kotak verifikasi. Empat blok TTD 2x2 dan blok Penerima dengan tempat dan tanggal.
51. **Buat SPJ 1:1 (SPJ-01, F-30).** Pilih kuitansi Aktif yang belum punya SPJ dan jenis belanja. Kuitansi langsung Terkunci. Kuitansi yang sudah punya SPJ tidak muncul lagi di pilihan. Tombol "Buat SPJ" nonaktif bila gatekeeper tertutup (C-17b).
52. **Isi Form Dinamis SPJ (SPJ-04, H-57, I-59 s.d. I-61).** Buka SPJ Draft (mis. spj-2 atau SPJ baru jenis "Belanja Perjalanan Dinas"). Isi field. Blok "Pelaku" minimal satu entri, tambah dengan "+ Tambah". Field wajib kosong menolak pengajuan.
53. **Auto-fill NIP/NIK (BNT-04, M-90).** Pada blok Pelaku, masukkan NIP `198807202012011004`. Nama terisi otomatis. NIP baru: nama diisi manual, lalu tersimpan ke Direktori saat Simpan Draft atau Ajukan. Penghapusan SPJ tidak menghapus entri direktori.
54. **Ajukan dan bentrok jadwal (SPJ-02, M-96, D01 §11).** Dua SPJ dalam TA yang sama dengan NIP yang sama dan rentang tanggal beririsan: pengajuan kedua ditolak dengan pesan "Bentrok jadwal" dan SPJ tetap Draft. Draft lain dan SPJ yang dikembalikan untuk perbaikan tidak menjadi penghalang. Pembanding hanya SPJ Terkunci, Menunggu BKU, atau Dibukukan.
54a. **Tanggal tugas wajib (D01 §11, butir 4 keputusan pemilik).** Pada blok berulang yang memiliki tag tanggal, entri dengan NIP wajib memiliki tanggal mulai dan tanggal selesai. Jika kosong, pengajuan ditolak dengan pesan "Tanggal tugas pada blok untuk NIP/NIK ... wajib diisi". Tanggal selesai sebelum tanggal mulai ditolak. Ini menyimpang dari default dokumen (selesai kosong sama dengan mulai) untuk baris blok.
54b. **Simpan Draft pada Masa Transisi ditolak (keputusan pemilik).** Pada TA Masa Transisi, server menolak simpan jawaban SPJ dengan pesan "Jawaban SPJ hanya dapat diubah pada TA Aktif Penuh".
54c. **Lepas SPJ Draft pada Masa Transisi diizinkan (keputusan pemilik).** Pada TA Masa Transisi, SPJ Draft dapat dilepas; kuitansi terkait kembali Aktif (hanya dibatalkan, tidak diedit).
55. **Kembalikan dan setujui (SPJ-02, F-31).** Verifikator dapat mengembalikan SPJ Terkunci dengan catatan wajib. SPJ kembali Draft, kuitansi tetap Terkunci. Setujui mengubah SPJ menjadi Menunggu BKU.
56. **Lepas dan batalkan SPJ Draft (SPJ-03, F-30c).** Tombol lepas dan batal pada SPJ Draft. Kuitansi terkait kembali Aktif tanpa jejak. SPJ Terkunci tidak dapat dilepas.
57. **Filter daftar (R-145).** Daftar kuitansi memfilter periode, rekening, dan pencarian. Daftar SPJ memfilter status dan jenis belanja.

### Status Langkah 5B (dibangun dan diperiksa lewat kode; belum diuji di browser)

| ID | Status | Keterangan |
|---|---|---|
| KUI-01 | Terbukti di kode | `repo.buatKuitansi` dan `ubahKuitansi`: TA Aktif Penuh, gatekeeper, PPTK seksi pemilik, bruto bilangan bulat, Sisa SPD Bebas. `KuitansiPage.tsx` `KuitansiFormModal`. Tidak ada penomoran. |
| KUI-02 | Terbukti di kode | `_kunciKuitansi` saat SPJ dibuat; `_bukaKunciKuitansi` saat SPJ dilepas. `batalkanKuitansi` hanya Aktif. `simpanJawabanSPJ`, `ajukanSPJ`, `lepasSPJ`, `buatSPJ` memakai izin status TA (`canCreateSPJ` / `canAksiSPJ`). |
| KUI-03 | Terbukti di kode | `CetakKuitansiModal` (KuitansiPage.tsx). Grep: tidak ada teks BKU, Kegiatan, Bank, Pelaksana, atau Verifikasi pada area cetak. |
| SPJ-01 | Terbukti di kode | `repo.buatSPJ`: 1:1 (F-30), PPTK pemilik, gatekeeper (C-17b), jenis belanja menentukan form. |
| SPJ-02 | Terbukti di kode | `ajukanSPJ` (Terkunci, `_cekWajib`, bentrok `_identitasJadwal`), `kembalikanSPJ` (catatan wajib), `setujuiSPJ`. |
| SPJ-03 | Terbukti di kode | `lepasSPJ` hanya Draft, `purgeAuditForSPJ`, `_bukaKunciKuitansi`. `batalkanSPJ` memanggil `lepasSPJ`. |
| SPJ-04 | Terbukti di kode | `FormDinamisEditor`: blok berulang, "+ Tambah", hapus entri (min. satu), `_cekWajib`. `getFormByVersion` (I-64). |
| BNT-04 | Terbukti di kode | `lookupDirektori` saat NIP diketik; `catatDirektori` saat Simpan Draft dan Ajukan; direktori tidak dihapus saat SPJ dilepas. |

## Langkah 5C1: Pajak SPJ (Tahap A, frontend dengan data contoh)

Cara mencoba: masuk sebagai PPTK seksi pemilik, buka SPJ Draft (mis. spj-2 dengan kui-2). spj-3 dan spj-4 sudah Terkunci atau Dibukukan dan tidak dapat diubah pajaknya.

| ID | Status | Bukti (kode) |
|---|---|---|
| PJK-01 | Terbukti di kode | `repo.simpanEntriPajakSPJ` (`repo.ts`); pop-up `PajakSPJModal.tsx`; dibuka dari `EditSPJModal` (`SPJPage.tsx`) setelah Simpan Draft dan lewat tombol "Kelola Pajak" pada tab Detail untuk SPJ Draft. |
| PJK-02 | Terbukti di kode | `repo.simpanEntriPajakSPJ` menolak bila Total Pajak > bruto kuitansi; `repo.ringkasanPajakSPJ` menghitung Total Pajak dan Jumlah dibayarkan; ditampilkan di pop-up dan tab Detail. |

Skenario Dokumen 05 (K-71 s.d. K-74b):

| ID | Status | Keterangan |
|---|---|---|
| K-71 | Terbukti di kode | Nominal diisi manual. Tidak ada perhitungan tarif. Satu-satunya perhitungan: Total Pajak dan Jumlah dibayarkan. Bruto kuitansi tidak berubah. |
| K-72 | Terbukti di kode | Pop-up muncul setelah Simpan Draft. Tombol "Tambah Entri Pajak" dan hapus per entri. |
| K-73 | Terbukti di kode | Pilihan jenis pajak hanya Master Jenis Pajak berstatus Aktif. Server menolak jenis nonaktif atau tidak ada (`simpanEntriPajakSPJ`). |
| K-74 | Terbukti di kode | Entri disimpan pada SPJ. Bruto kuitansi dan komitmen tidak diubah. SPJ tanpa entri pajak tetap bisa diterima. |
| K-74a | Terbukti di kode | Penolakan di `repo.simpanEntriPajakSPJ` bila Total Pajak > bruto. Pesan memuat bruto, Total Pajak, dan batas. Entri tidak tersimpan. Belum diuji di peramban. |
| K-74b | Terbukti di kode | Total Pajak sama dengan bruto diterima; Jumlah dibayarkan nol. Jumlah dibayarkan = bruto dikurangi Total Pajak. |

Tafsiran (belum diatur dokumen secara eksplisit):
- "Simpan Pajak" mengganti seluruh daftar entri pajak SPJ, bukan menambah.
- Nominal entri harus bilangan bulat lebih dari nol.
- Ajukan ke Verifikator tidak membuka pop-up pajak. Pajak yang sudah tersimpan tetap ikut.
- Data contoh spj-4 (Dibukukan) memakai pjk-23 yang tidak ada di master; diganti ke pjk-2 agar total tetap Rp 2.250.000 dan tidak melebihi bruto Rp 15.000.000.

Belum diuji di peramban. Skenario 58 s.d. 61 perlu dijalankan manual: buka SPJ Draft, simpan draft, isi entri pajak dengan total melebihi bruto kuitansi (harus ditolak dengan pesan bruto dan batas), lalu isi total tepat sama dengan bruto (diterima, Jumlah dibayarkan nol).

### Langkah 5C2a: Rekening Penerima SPJ (REK-01, REK-02)

Data contoh: direktori rekening bank berisi empat rekening (`rbk-1` s.d. `rbk-4`). SPJ `spj-3` dan `spj-4` sudah memuat satu rekening penerima snapshot masing-masing. Uji dengan PPTK pemilik seksi SPJ Draft (mis. `198807202012011004` untuk SPJ `spj-2`, TA 2026).

Skenario (urutan uji):
1. **O-109.** Buka SPJ Draft, pilih tab Rekening Penerima. Layar lebar menampilkan dua kolom: Direktori Rekening Bank di kiri dan Rincian Penerima di kanan. Layar sempit menampilkan keduanya bertumpuk.
2. **O-110.** Ketik sebagian nama penerima, alias, atau nomor rekening di kotak pencarian kiri. Daftar menyaring sesuai kata kunci.
3. **O-111.** Tekan Pilih pada salah satu hasil. Baris baru di kanan terisi nama penerima, nama bank, nomor rekening, dan alias.
4. **O-112.** Isi rekening baru secara manual di kanan tanpa validasi format. Baris yang hanya sebagian terisi ditolak dengan pesan "belum lengkap" dan isian tetap ada.
5. **O-113.** Tekan Simpan Rekening: muncul "Tersimpan". Rekening baru tampil di pencarian kiri. Mengetik ulang rekening yang sama dengan huruf besar/kecil berbeda tidak menambah entri kedua.
6. Lepas atau batalkan SPJ Draft yang sudah memuat rekening. SPJ hilang, tetapi rekening tetap ada di direktori.

Catatan: merge dan koreksi direktori oleh Admin (REK-05) belum dibuat.

### Pengingat dari langkah sebelumnya

| ID | Status | Bukti (kode) |
|---|---|---|
| E-26 | Terbukti di kode | `_versiAlokasiTerbaru` dipanggil di `buatKuitansi` (`versi_alokasi_snapshot_id`). |
| C-17b | Terbukti di kode | `repo.buatSPJ` menolak bila `gerbangStatus` tertutup. |
| C-15, C-15b, C-17 | Terbukti di kode (gerbang) | `repo.buatKuitansi` memanggil `gerbangStatus`; UI menonaktifkan tombol. Tidak diuji skenario pergantian seksi. |
| B-6 | Terbukti di kode | `hapusTA` menolak TA dengan `pernah_transaksi` true. Flag tetap true walau kuitansi dibatalkan. |
| B-10c | Terbukti di kode | `canCreateKuitansi`, `canEditKuitansi`, `canBatalkanKuitansi`, `canCreateSPJ`, `canAksiSPJ`; dipakai di kuitansi dan SPJ. |
| B-10f | Terbukti di kode | `_isDefinitifAktifForSeksi` dipanggil di `buatKuitansi`. |
| F-33a | Terbukti di kode | `batalkanKuitansi` dan `lepasSPJ` memanggil `purgeAuditForKuitansi` / `purgeAuditForSPJ`. |
| F-33d/e | Terbukti di kode | `_snapshotPenandatangan` dipanggil di `buatKuitansi`. |
| R-145 | Terbukti di kode | `filterPeriode`, `filterRekening` di `KuitansiPage.tsx`; `filterStatus`, `filterJenis` di `SPJPage.tsx`. |
| I-64 | Terbukti di kode | `EditSPJModal` memakai `getFormByVersion(spj.jenis_belanja, spj.versi_form)`. |

### Catatan

- Keputusan pemilik: simpan draft SPJ ditolak pada Masa Transisi; lepas SPJ Draft diizinkan pada Masa Transisi; tanggal tugas pada blok wajib diisi (selesai tidak boleh kosong untuk baris blok).
- Belum diuji di peramban. Skenario 46 s.d. 57 perlu dijalankan manual.


### Langkah 5C2b: Direktori Rekening Bank untuk Admin (REK-05, REK-03)

Cara mencoba: masuk sebagai Admin (`admin` / `amanda123`), buka menu **Direktori Rekening**. Direktori berisi empat rekening contoh (`rbk-1` s.d. `rbk-4`) ditambah rekening yang ter-capture dari SPJ.

58. **Lihat dan cari (REK-05).** Daftar menampilkan seluruh rekening global lintas seksi. Cari berdasarkan nama, alias, bank, atau nomor rekening.
59. **Koreksi ejaan (REK-05).** Klik ikon pensil, ubah ejaan nama atau bank, simpan. Toast "Tersimpan" tampil dan baris di daftar berubah. Buka SPJ `spj-3` atau `spj-4` (PPTK, tab Rekening Penerima): rekening pada SPJ itu **tidak berubah** (O-114).
60. **Gabungkan duplikat (REK-05).** Di bagian "Gabungkan entri duplikat", pilih entri yang dipertahankan dan entri yang digabung, lalu konfirmasi. Entri kedua hilang dari direktori. SPJ lama tetap memegang snapshot aslinya.
61. **Hak akses.** Peran selain Admin tidak memiliki menu ini, dan fungsi koreksi dan gabung di lapisan data menolak peran selain Admin.
62. **Isian tidak hilang saat pindah tab (REK-02).** Sebagai PPTK, buka SPJ Draft, isi baris di tab Rekening Penerima tanpa menekan "Simpan Rekening", pindah ke tab Form Dinamis lalu kembali: isian masih ada. Tekan "Simpan Draft" tanpa menekan "Simpan Rekening": rekening ikut tersimpan dan rekening baru masuk direktori.
63. **Aksi Admin tercatat.** Koreksi dan penggabungan muncul di Jejak Audit sebagai aksi administratif.

Belum diuji di peramban.

### Unggah berkas SK (PEN-02) dan lampiran PDF SPJ (SPJ-06)

Catatan penting Tahap A: berkas yang dipilih hanya dipegang di memori peramban selama sesi. Nama dan ukuran tersimpan di data, tetapi **isi berkas hilang saat halaman dimuat ulang**. Penyimpanan permanen menunggu backend (Tahap B). Batas 5 MB untuk berkas SK adalah batas operasional yang ditetapkan sementara (dokumen tidak menyebut ukuran).

64. **Tambah SK dengan berkas (PEN-02).** Admin, Tahun Anggaran, buka TA, tab Penugasan, ikon dokumen pada satu penugasan. Isi nomor dan tanggal SK, pilih berkas PDF, JPG, atau PNG, klik "Tambah SK". Toast "Tersimpan" tampil dan SK muncul di daftar dengan nama berkas dan tombol "Buka SK".
65. **Format dan ukuran ditolak.** Pilih berkas .docx atau berkas lebih dari 5 MB: pesan galat tampil dan SK tidak tersimpan.
66. **SK provisional dilengkapi kemudian (B-10).** Tambah SK dengan "SK Provisional" dan tanpa berkas: baris SK tampil "Berkas belum diunggah". Klik ikon pensil, isi nomor final, pilih berkas, hilangkan centang provisional, simpan. Status penugasan berubah menjadi Final.
67. **SK lama tetap dapat dibuka (B-10).** Setelah penugasan berakhir (mis. lewat Ganti Pejabat), buka lagi modal Register SK penugasan lama: nomor, tanggal, dan nama berkas tetap tampil. Pada `SK-004/2026` (data contoh), nama berkas tampil dan keterangan "Berkas hanya terbuka pada sesi unggah" muncul karena isi berkas contoh tidak ada.
68. **Hak akses SK.** Fungsi lengkapi SK di lapisan data menolak peran selain Admin.
69. **Lampiran PDF SPJ (SPJ-06).** PPTK, SPJ Draft (mis. spj-2), buka tab Detail. Pilih PDF 5 MB atau kurang: status "Menyiapkan dokumen..." lalu "Mengunggah dokumen..." lalu "Berhasil", dicatat dikirim langsung tanpa kompresi. Tombol buka berfungsi pada sesi itu.
70. **PDF di atas 5 MB sampai 30 MB.** Berhasil dicatat dengan keterangan bahwa kompresi dilakukan setelah backend tersedia (kompresi sungguhan belum ada pada Tahap A).
71. **Lebih dari 30 MB ditolak.** Pesan: "Ukuran file melebihi batas maksimal 30 MB. Harap sesuaikan setelan scanner Anda."
72. **Bukan PDF ditolak.** Pilih berkas .jpg atau .docx: ditolak dengan pesan harus PDF.
73. **SPJ terkunci.** Pada SPJ Terkunci atau Dibukukan, tombol ganti dan hapus lampiran tidak tersedia, dan fungsi data menolak perubahan.

Belum diuji di peramban.

### Tambahan: unduh SK dan pelengkap pengajuan SPJ (SPJ-05, BNT-03)

74. **Unduh SK (PEN-02).** Admin, penugasan, kolom SK menampilkan nomor SK dan tautan "Unduh" untuk SK yang berkasnya masih dipegang pada sesi (diunggah pada sesi ini). Pada modal Register SK tersedia "Buka SK" dan "Unduh". Setelah halaman dimuat ulang, isi berkas tidak ada lagi sampai backend (Tahap B).
75. **Snapshot pejabat saat pengajuan (SPJ-05, F-33d).** Ajukan SPJ saat tidak ada delegasi, lalu tetapkan delegasi Plh. PPTK: pejabat pada SPJ yang sudah diajukan tetap pejabat definitif (data `penandatangan_pengajuan` pada SPJ).
76. **Pesan bentrok (M-98).** Pengajuan yang bentrok menampilkan NIP/NIK, rentang tanggal irisan, nomor SPJ dan nama seksi pembanding saja, tanpa isi atau nominal.

Belum diuji di peramban.

## Langkah 6 — Verifikasi, BKU, token, cetak, keaslian (skenario 77–94)
Akun: Verifikator `198911112014032007` (Dewi), Bendahara `198203152009012003`, PPTK Pengadaan `198601252011011008` (akun berstatus NON-ACTIVE pada data contoh; ubah di Master Personel bila perlu), Admin `admin`. Kata sandi `amanda123`.

77. **VER-01 antrean.** Verifikator → menu Verifikasi SPJ. Filter bawaan "Terkunci". Data contoh tidak punya SPJ Terkunci; buat dari PPTK: Draft `spj-2` (Pengadaan) → isi form → Ajukan.
78. **Setujui.** Periksa SPJ → Setujui → pop-up konfirmasi → status Menunggu BKU, toast memuat nomor verifikasi (mis. VER/2026/0003).
79. **Kembalikan.** Kembalikan tanpa catatan ditolak; dengan catatan → Draft, kuitansi tetap Terkunci, komitmen SPD tidak berubah.
80. **VER-02.** Admin menetapkan Dewi sebagai Plh. PPTK seksi Pengadaan. Masuk sebagai Verifikator (pilih jabatan), coba setujui/kembalikan SPJ seksi itu → ditolak dengan pesan "tidak dapat memverifikasi SPJ yang Anda ajukan atau kelola sendiri".
81. **DSB-04.** Dasbor Verifikator: kartu Pagu Induk, ticker, tabel antrean Terkunci. PPTK tidak melihat Pagu Induk.
82. **BKU-01.** Bendahara → BKU → "SPJ Menunggu BKU" (`spj-3`) → Catat BKU. No. `BKU-001` ditolak (dipakai). `BKU-002` dengan tanggal mundur diterima; SPJ → Dibukukan. Catat BKU kedua untuk kuitansi sama tidak tersedia.
83. **BKU-02.** Halaman BKU tidak memuat penerimaan kas, SP2D, saldo awal, atau saldo kas.
84. **BKU-03.** Koreksi No./tanggal; No. duplikat ditolak; Jejak Audit menampilkan nilai lama dan baru.
85. **BKU-05.** Cari No. BKU/uraian; filter seksi, status, rentang tanggal; Reset. Verifikator melihat daftar yang sama tanpa tombol aksi.
86. **BKU-04.** Bendahara → Cabut → pop-up konfirmasi (Batal tidak mengubah data). Setelah dicabut: SPJ Menunggu BKU, nomor bebas dipakai ulang, audit "pencabutan_bku" tanpa alasan. Verifikator mengembalikan SPJ → PPTK Lepas SPJ → PPTK batalkan kuitansi; SPD pulih dan seluruh jejak SPJ/BKU terhapus.
87. **VER-03.** Setiap persetujuan membuat nomor urut baru per TA (tidak dipakai ulang); verifikasi ulang menghasilkan token dan nomor baru, yang lama Tidak berlaku.
88. **TPL-04.** Admin → Template Verifikasi: ubah label/teks/logo/stempel, lihat pratinjau; ubah format nomor (awalan, pemisah, pola tahun, digit). Nomor yang sudah ada tidak berubah. Peran lain tidak punya menu ini dan repo menolak.
89. **VER-04.** PPTK (seksinya) dan Verifikator (semua seksi) → Cetak Hasil Verifikasi pada SPJ Menunggu BKU/Dibukukan; memuat QR, nomor verifikasi, pajak, Total Pajak, Jumlah dibayarkan. Draft/Terkunci, Admin, Bendahara, PA/KPA, Pengawas ditolak. Tombol "Cetak / Simpan PDF" memakai dialog cetak peramban.
90. **VER-05.** Buka `#/keaslian/K7QW3M9XD2HFTP4R8ZNB6VYC` (token contoh `spj-4`) tanpa login → Berlaku, TA 2026, nama seksi, tanggal verifikasi. Token acak atau yang tidak berlaku → "Tidak berlaku" dengan tampilan sama.
91. **Q-133.** Setelah BKU dicabut token tetap Berlaku; setelah SPJ dikembalikan menjadi Draft token Tidak berlaku.
92. **Masa Transisi.** TA 2024: Verifikator/Bendahara tetap dapat setujui, kembalikan, catat, koreksi, dan cabut BKU.
93. **Catatan Tahap A.** Logo/stempel dan lampiran hanya di memori sesi; PDF memakai cetak peramban; token disimpan di data contoh dan hilang saat muat ulang.
94. **QR.** Pembuat QR ditulis sendiri (`src/lib/qr.ts`), diuji terbaca pada beberapa ukuran.

## Langkah 7 — Laporan, laporan kustom, unduh lampiran (skenario 95–118)
Menu **Laporan** dan **Laporan Kustom** ada pada Bendahara, PPTK, Verifikator, PA/KPA; Pengawas hanya **Laporan**; Admin tidak melihat keduanya. Data contoh: SPJ Dibukukan `spj-4` (BKU-001). Untuk data lebih banyak, catat BKU untuk `spj-3` (Bendahara → BKU → Catat BKU).

95. **Katalog.** Bendahara membuka Laporan: tersedia (a) sampai (g). Setiap laporan tampil sebagai tabel yang dapat difilter, dengan tombol Unduh Excel dan Cetak/PDF.
96. **Basis realisasi.** Hanya SPJ Dibukukan yang tampil. Kuitansi Aktif/Terkunci, SPJ Draft, dan SPJ Menunggu BKU tidak muncul (Q-125, T-160).
97. **Pencabutan BKU.** Cabut BKU di menu BKU, buka ulang laporan dan unduh ulang: transaksi hilang dari semua laporan (Q-127, T-162).
98. **(a) Rekap per seksi.** Kolom Seksi, Pagu, Realisasi BKU, Realisasi (%), Status. Tidak ada komitmen dan sisa SPD bebas (Q-126). Istilah "Realisasi (%)", bukan "Serapan".
99. **(b) Buku Kas.** Kolom No. BKU, Tanggal BKU, Nominal, Kuitansi Terkait. PA/KPA tidak melihat kolom kuitansi (Q-125).
100. **(c) Daftar kuitansi dan SPJ.** PA/KPA: tombol tidak tersedia dan pemanggilan langsung ditolak (I-65).
101. **(d) Per seksi dan subkegiatan.** Dua tabel dengan kolom Realisasi (%).
102. **(e) Rekap isian SPJ.** Satu sheet per jenis belanja pada Excel, kolom gabungan field versi form (versi terbaru lebih dulu), field yang tidak ada pada versi tertentu kosong, label berulang diberi nomor urut. Form dengan blok berulang: satu baris per entri, nilai di luar blok diulang. Tanpa kolom pajak, BKU, kode, bruto. NIP/NIK dan No. Rekening penuh tanpa masking (H-54, H-56, I-62, I-63, K-75, Q-140).
103. **Filter jenis belanja (e).** Centang satu jenis → satu sheet; centang dua → dua sheet.
104. **(f) Rekap pajak.** Satu sheet per jenis pajak, satu baris per entri pajak, tanpa subtotal. Filter jenis pajak, seksi, periode. PA/KPA tanpa kolom Tanggal Kuitansi (K-76, K-77).
105. **(g) Kartu Kendali.** Satu blok per pasangan subkegiatan+rekening yang punya realisasi BKU, disusun ke bawah. Kolom No, Tanggal, No. Bukti, Uraian, Realisasi, Sisa Anggaran, baris TOTAL, header diulang pada tiap halaman cetak. Pasangan tanpa realisasi tidak muncul (Q-136, Q-137, Q-138, Q-141).
106. **Filter periode (g).** Isi "Dari" 2026-04-01: baris sebelum tanggal itu hilang, tetapi Sisa Anggaran tetap dihitung dari awal TA.
107. **Cakupan peran.** PPTK hanya data seksinya; memilih seksi lain ditolak. Bendahara, Verifikator, PA/KPA seluruh seksi. Pengawas seluruh seksi hanya pada TA yang ditugaskan.
108. **Jejak Pengawas.** Pengawas yang mengunduh Excel atau mencetak laporan menimbulkan entri Jejak Audit. Peran lain tidak (T-163).
109. **Admin.** Menu laporan tidak ada; pemanggilan langsung ditolak (Q-124).
110. **Laporan Kustom.** Halaman sendiri, bukan pop-up. Bendahara dan Verifikator melihat semua kolom; PA/KPA tanpa Kode/Nama Rekening Belanja, Uraian, Nama Penerima, NIP/NIK dan No. Rekening (T-155, T-157, T-158).
111. **Penolakan kolom.** Permintaan yang memuat kolom terlarang atau Status SPJ ditolak seluruhnya di lapisan data (T-157, T-159).
112. **Pratinjau.** Maksimal 10 baris dengan keterangan jumlah total; unduhan memuat semua baris sesuai filter (T-161). NIP/NIK dan No. Rekening penuh.
113. **PPTK kustom.** Hanya seksinya (T-156).
114. **Lampiran SPJ (SPJ-08).** Panel "Lampiran PDF SPJ" pada halaman Laporan. Bendahara, Verifikator, PA/KPA seluruh seksi; PPTK seksinya (Q-128, Q-129). Admin dan Pengawas tidak melihat panel dan pemanggilan langsung ditolak.
115. **Berkas.** Tombol Unduh membuka berkas yang diunggah pada sesi ini; setelah muat ulang hanya nama dan ukuran tersisa (penyimpanan permanen menunggu backend).
116. **Excel.** Berkas dibuat oleh penulis .xlsx mandiri (`src/lib/xlsx.ts`), diuji terbaca di Excel/openpyxl; NIP/NIK dan No. Rekening tersimpan sebagai teks sehingga angka nol di depan tidak hilang.
117. **PDF.** Memakai dialog cetak peramban (pilih Simpan sebagai PDF). PDF dari server menunggu backend.
118. **Belum diuji di peramban.**

## Langkah 8 — Portal Publik, Analitik, Heatmap

119. **Portal publik.** Dari halaman login pilih "Portal Publik". TA Aktif tampil sebagai bawaan; TA Draft tidak muncul. Muncul ticker, donut status SPJ (Dibukukan, Dalam Verifikasi, Perlu Perbaikan, Draf), gauge realisasi, dan peringkat seksi. Tidak ada nominal rupiah, nama orang, atau rekening di halaman maupun atribut aksesibilitas.
120. **Kategori.** Dibukukan masuk "Selesai"; Terkunci dan Menunggu BKU masuk "Dalam Verifikasi"; Draft yang memiliki catatan revisi masuk "Perlu Perbaikan"; Draft tanpa catatan masuk "Draf".
121. **Layar penuh.** Tombol atau tombol F (tidak aktif saat mengetik di kolom isian atau menekan Ctrl/Alt/Meta). Refresh data otomatis tiap 20 menit dengan waktu "diperbarui".
122. **TA lampau.** Pilih TA Masa Transisi atau Arsip untuk melihat angka akhir TA tersebut. Persen tanpa data menampilkan "Belum tersedia".
123. **Dasbor PA/KPA.** Ticker "X Normal, Y Perlu Perhatian, Z Lonjakan" dan Time Elapsed. Tabel seksi memuat Burn-rate dan Zona (titik warna, ikon, dan teks); zona Kritis di urutan atas; arahkan kursor ke zona untuk deviasi.
124. **Aturan zona.** Kritis: Time Elapsed >90% dan burn-rate <60%. Lonjakan: BKU 14 hari terakhir ≥40% pagu seksi. Serapan Lambat: Time Elapsed >75% dan burn-rate <50%. Selebihnya Normal.
125. **TA beku.** Pada Masa Transisi/Arsip, Time Elapsed 100% dan jendela 14 hari berakhir 31 Desember.
126. **Heatmap.** Menu "Heatmap Realisasi" khusus PA/KPA, halaman sendiri. Baris seksi lalu subkegiatan (tanpa rekening), 12 bulan menurut Tanggal BKU, kolom "Di luar TA" bila ada, indikator rekonsiliasi. Peran lain tidak melihat menu dan pemanggilan langsung ditolak.
127. **Pengawas.** Dasbor menunjukkan penugasan dan akhir akses; Laporan dan Jejak Audit di menu atas. Tidak ada analitik.
128. **Catatan tafsir.** Menunggu BKU dihitung "Dalam Verifikasi"; Time Elapsed menghitung 1 Januari sebagai hari ke-1; zona hanya penanda dan tidak memengaruhi alur SPJ/BKU.
129. **Belum diuji di peramban.**

## Langkah 9 — Penghapusan TA setelah Retensi 12 Tahun (TA-08)

130. **Tombol.** Admin > Tahun Anggaran: "Hapus (Retensi)" hanya muncul pada TA Arsip Read-Only yang sudah genap 12 tahun sejak tanggal arsip terakhir (WITA). Data contoh tidak memiliki TA seperti itu; untuk mencoba, ubah `tanggal_arsip_terakhir` TA Arsip di `sampleData.ts` menjadi tanggal lebih dari 12 tahun lalu.
131. **Penolakan.** TA Aktif Penuh, Masa Transisi, Draft yang pernah punya kuitansi, dan Arsip kurang dari 12 tahun ditolak pada pemanggilan langsung. Peran selain Admin ditolak walau retensi sudah lewat. Tidak ada penghapusan otomatis berdasarkan tanggal.
132. **Konfirmasi.** Modal menampilkan jumlah kuitansi, SPJ, BKU, dan lampiran tanpa nominal. Penghapusan hanya berjalan bila kode TA (misalnya 2026) diketik sama persis.
133. **Hapus total.** Seluruh data TA (alokasi, penugasan, kuitansi, SPJ, BKU, lampiran, token dan nomor verifikasi, format nomor) beserta entri audit TA tersebut hilang, tanpa catatan penghapusan.
134. **Uji logika.** Dijalankan lewat skrip: batas tepat 12 tahun (kurang 1 hari ditolak, tepat 12 tahun lolos), 5 peran non-Admin ditolak, kode salah ditolak, tidak ada sisa data ber-`ta_id` pada data layer.
135. **Belum diuji di peramban.** Penghapusan berkas di penyimpanan nyata dan cadangan platform menunggu Tahap B.

## Perbaikan dari uji Admin (v8)

136. **Tag sistem.** Pada Form Dinamis, pilihan tag tampil sebagai "NIP/NIK ...", "Nama ...", "Tanggal mulai/selesai tugas", bukan kode [SYS_...]. Kode tetap tersimpan di data.
137. **Nama mengikuti NIP/NIK.** Bila NIP/NIK diubah dan tidak lagi dikenal, nama yang sebelumnya terisi otomatis dikosongkan. Nama yang diketik manual tidak dihapus. Berlaku di Pratinjau Form dan di SPJ (field utama dan blok berulang).
138. **Peringatan.** Pada Pratinjau, penolakan (wajib diisi dan bentrok jadwal) tampil sebagai kotak peringatan besar berbingkai merah.
139. **SK.** SK final wajib memuat nomor, tanggal, dan berkas. SK Provisional boleh kosong semuanya dan dilengkapi kemudian; baris tampil "Nomor SK belum ada".
140. **Penugasan & Delegasi satu daftar.** Tab "Penugasan & Delegasi" memuat penugasan definitif dan delegasi Plh./Plt. dalam satu tabel dengan kolom Jenis. Yang masih berjalan di atas; yang berakhir atau dicabut dikelompokkan di bagian "Riwayat (berakhir atau dicabut)". Tombol Tetapkan Delegasi Plh./Plt. dan ikon cabut dini ada di tab yang sama. Tab "Delegasi" terpisah dihapus.
141. **Peran delegasi.** Pilihan Plh./Plt. hanya Bendahara, PPTK, dan PA/KPA (D01 §6 poin 7). Verifikator tidak termasuk.

## Kuitansi mengikuti contoh pemilik (v9)

142. **Tata letak.** Cetak kuitansi (PPTK) dan pratinjau Template Kuitansi (Admin) memakai satu komponen `LembarKuitansi`. Susunan: kotak TAHUN ANGGARAN kiri atas, logo di tengah, tabel kanan atas "Kode Sub Kegiatan : ..." dan "Kode Rekening : ...", judul KWITANSI berspasi, lalu SUDAH TERIMA DARI, UANG SEJUMLAH, TERBILANG (/// ... ///), UNTUK PEMBAYARAN, Sub Keg. tebal. Tanda tangan 2x2: PPTK (Setuju dibayar oleh) dan Penerima (Yang Menerima) di atas; Pengguna Anggaran (Setuju dibayar) dan Bendahara Pengeluaran (Lunas dibayar oleh) di bawah. Nama bergaris bawah dan NIP di bawahnya.
143. **Tanpa kotak verifikasi.** Keputusan pemilik: mengikuti Dokumen 01 §2.2, kotak Diverifikasi/Tanggal/Nomor/Paraf tidak dicetak walau ada di contoh.
144. **Template.** Admin mengatur judul, tempat, teks "Sudah terima dari", dan logo (PNG/JPG, maks 2 MB, hanya selama sesi pada Tahap A). Perubahan langsung tampil di pratinjau.
145. **Cetak.** Tombol Cetak hanya mencetak lembar kuitansi (bukan seluruh aplikasi), ukuran F4.
146. **Catatan.** Keterangan "Plh./Plt." di bawah nama penandatangan (D01 §2.1) belum tampil karena data kuitansi belum menyimpan keterangan itu; dicatat untuk perbaikan berikutnya.

## Lembar Hasil Verifikasi: tampilan baru (v10)

147. **Tampilan.** Lembar Hasil Verifikasi (Cetak Hasil Verifikasi dan pratinjau Template Verifikasi) murni hitam putih tanpa blok isian warna, hanya garis, huruf tebal, dan miring, agar ringan dicetak dan jelas saat difotokopi. Susunan: kepala surat dengan logo dan garis ganda, judul, kotak "TERVERIFIKASI" dengan nomor verifikasi, kalimat pembuka, kotak rincian (TA/Seksi, Sub Kegiatan, Kode Rekening, Uraian, Uang Sebanyak, Terbilang), panel kiri (tanggal verifikasi, QR, nomor verifikasi, stempel, nama dan NIP Verifikator), panel kanan (Diterima Oleh: nama, bank, no. rekening; Jumlah yang diminta; potongan pajak per jenis; Jumlah Potongan; Jumlah yang Dibayarkan dengan garis ganda), jenis belanja, dan catatan keaslian.
148. **Data.** Semua data sistem dari D01 §8 poin 2 tetap tampil. Token tidak dicetak sebagai teks; nomor verifikasi tercetak di samping QR (D01 §8 poin 3).
149. **Teks bawaan.** Judul, kalimat pembuka, label, dan catatan penutup bawaan diubah mengikuti contoh Anda; Admin dapat mengubah semuanya di Template Verifikasi. Logo dan stempel dicetak hitam putih.
150. **Belum diuji di peramban.** Periksa hasil cetak (Simpan sebagai PDF) pada ukuran F4/A4: muat satu halaman; tidak ada blok isian sehingga opsi Background graphics tidak diperlukan.
