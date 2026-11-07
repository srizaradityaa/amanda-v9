# PAKET LANGKAH 6C: VERIFIKASI & BKU

**Sumber kebenaran mutlak:** Dokumen 01 v1.53, Dokumen 02 v1.33, Dokumen 03 v1.58, Dokumen 04 v1.38, Dokumen 05 v1.64.  
**Cakupan paket ini:** Tahap A, yaitu frontend dengan data contoh. Pekerjaan backend Langkah 6 baru dimulai di Tahap B (lihat `SUSUNAN_PENGEMBANGAN_AMANDA_BERTAHAP.md`).

## Perintah kerja
Kerjakan hanya fitur yang tercantum di bagian 1, berurutan dari atas ke bawah, memakai aturan yang tertulis di bagian 2 dan 3. Jangan menambah, mengurangi, atau mengubah aturan bisnis. Bila ada hal yang tidak diatur dokumen, hentikan dan tanyakan, jangan merancang sendiri. Langkah selesai bila seluruh skenario di bagian 4 dapat didemonstrasikan pada antarmuka dengan data contoh.

## 1. Fitur Langkah 6 (urutan kerja)
| Urut | ID | Fitur | Peran | Prioritas | Pekerjaan | Dependensi |
|---|---|---|---|---|---|---|
| 99 | VER-03 | Token & nomor verifikasi | Sistem | P0 | Frontend | VER-01, TPL-04 |
| 100 | TPL-04 | Template Hasil Verifikasi SPJ & format nomor verifikasi per TA | Admin | P1 | Frontend | TPL-01, VER-03 |
| 103 | BKU-04 | Pencabutan BKU berjenjang | Bendahara, Verifikator, PPTK | P0 | Frontend | BKU-01, VER-03, SPJ-03 |
| 106 | VER-04 | Cetak Hasil Verifikasi SPJ (PDF + QR) | PPTK, Verifikator | P1 | Frontend | VER-03, PEN-08 |
| 107 | VER-05 | Halaman keaslian SPJ via token | Publik | P1 | Frontend | VER-03 |

## 2. Aturan kunci per fitur (ringkasan)
### VER-03 — Token & nomor verifikasi
- **Peran:** Sistem
- **Aturan:** Dibuat saat disetujui; token acak (tidak dicetak teks), nomor urut per TA tidak dipakai ulang; Tidak berlaku saat dikembalikan/BKU dicabut; verifikasi ulang → token & nomor baru.
- **Rujukan:** D02 §8 poin 3, 5; D04 §2.2

### TPL-04 — Template Hasil Verifikasi SPJ & format nomor verifikasi per TA
- **Peran:** Admin
- **Aturan:** Admin ubah tata letak, label, teks statis, logo, stempel (bukan data sistem); format nomor: awalan, pemisah, pola tahun, jumlah digit; nomor tercetak tidak berubah.
- **Rujukan:** D02 §2.3, §8 poin 2–3; D04 §2.2

### BKU-04 — Pencabutan BKU berjenjang
- **Peran:** Bendahara, Verifikator, PPTK
- **Aturan:** Urutan: Bendahara cabut (audit, pop-up konfirmasi, tanpa alasan tertulis) → Verifikator kembalikan → Seksi lepas SPJ → Seksi batalkan kuitansi → SPD pulih; nomor BKU dicabut bebas dipakai ulang; token keaslian Tidak berlaku.
- **Rujukan:** D02 §6 poin 2; D03 §5 poin 4; D01 §15 poin 6

### VER-04 — Cetak Hasil Verifikasi SPJ (PDF + QR)
- **Peran:** PPTK, Verifikator
- **Aturan:** PPTK seksinya, Verifikator semua seksi; hanya Menunggu BKU/Dibukukan; data sistem (termasuk pajak, Total Pajak, Jumlah dibayarkan); cetak ulang = nomor/QR sama selama token belum berganti; peran lain ditolak.
- **Rujukan:** D02 §8; D03 §4 poin 13, §5 poin 9

### VER-05 — Halaman keaslian SPJ via token
- **Peran:** Publik
- **Aturan:** Tanpa login; hanya status Berlaku/Tidak berlaku, nama TA, nama seksi, tanggal verifikasi; respons seragam untuk token tak dikenal/tak berlaku; tanpa daftar/pencarian token; tanpa nominal/identitas.
- **Rujukan:** D02 §8 poin 4; D03 §9 poin 10; D04 §2.3; D01 §10 poin 10

## 3. Kutipan bagian dokumen yang dirujuk (apa adanya)
Bagian berikut disalin tanpa perubahan dari dokumen sumber. Bila ringkasan di bagian 2 berbeda dengan kutipan ini, kutipan yang berlaku.

#### Dokumen 02 §8

## 8. Cetak hasil verifikasi SPJ dan verifikasi keaslian (barcode)
1. Setelah SPJ disetujui Verifikator (berstatus Menunggu BKU atau Dibukukan), PPTK pada seksi SPJ tersebut, dan Verifikator untuk seluruh seksi, dapat mencetak "Hasil Verifikasi SPJ" dalam format PDF.
2. Cetakan memakai template terpisah yang diatur Admin melalui Visual Live Editor seperti template kuitansi (§2.3). Data berikut diisi dari sistem, bukan dari editor: TA, seksi, identitas SPJ, nomor verifikasi, tanggal verifikasi, nama dan NIP Verifikator, sub kegiatan, kode rekening belanja, uraian, nilai bruto, nama penerima, bank dan nomor rekening penerima, serta setiap entri pajak beserta nominal yang diisi manual. Jumlah yang dibayarkan dan Total Pajak dihitung sistem sesuai §5 dan dicetak. Admin dapat mengubah tata letak, label, teks statis, logo, dan gambar stempel, tetapi tidak dapat mengubah data sistem dari editor.
3. Setiap cetakan memuat dua pengenal yang terpisah. (a) Barcode (QR) berisi tautan verifikasi keaslian dengan token acak yang dibuat sistem saat SPJ disetujui. Token tidak dicetak sebagai teks, bukan nomor urut, dan tidak memuat nomor kuitansi. (b) Nomor verifikasi tercetak sebagai teks di samping barcode. Sistem membuat nomor secara otomatis bersamaan dengan token, dengan urutan yang terus bertambah dalam TA dan tidak pernah dipakai ulang. Nomor tidak sama dengan token, serta tidak memuat nomor kuitansi, nominal, atau nama. Admin mengatur format nomor per TA (awalan, pemisah, pola tahun, dan jumlah digit urut). Nomor yang sudah tercetak tidak berubah ketika format diganti. Nomor verifikasi tidak dipakai sebagai pengganti token pada tautan.
4. Halaman verifikasi keaslian dapat dibuka tanpa login. Halaman hanya menampilkan status keaslian (Berlaku atau Tidak berlaku), nama TA, nama seksi, dan tanggal verifikasi. Halaman tidak menampilkan nominal, nama penerima, NIP/NIK, nomor rekening, lampiran, rincian kuitansi/SPJ, atau jejak audit. Ketentuan ini berlaku pada respons server, bukan hanya pada tampilan.
5. Status keaslian mengikuti status SPJ. Jika Verifikator mengembalikan SPJ menjadi Draft, halaman menampilkan Tidak berlaku untuk cetakan sebelumnya. Pencabutan BKU saja tidak mengubah status keaslian: selama SPJ belum dikembalikan menjadi Draft, belum dilepas dari kuitansi, dan kuitansinya belum dibatalkan, SPJ tetap sah (Berlaku) karena masih dapat diteruskan ke pencatatan BKU, misalnya untuk memperbaiki No. BKU yang salah. Setelah SPJ kembali disetujui, token dan nomor verifikasi baru dibuat, dan token serta nomor lama tidak berlaku.
6. Pencetakan ulang diperbolehkan selama SPJ berstatus Menunggu BKU atau Dibukukan. Cetakan untuk SPJ berstatus Draft atau Terkunci ditolak. Selama token belum berganti, cetakan ulang memuat nomor verifikasi dan barcode yang sama.
7. Nama dan NIP pejabat pada Hasil Verifikasi SPJ diambil dari snapshot penugasan sesuai Dokumen 01 §6 poin 11. Cetak ulang selalu memakai snapshot tersebut dan tidak berubah setelah delegasi Plh./Plt. berakhir.

#### Dokumen 04 §2.2

### 2.2 Snapshot/operasional TA
| Entitas | Data utama | Prinsip |
|---|---|---|
| Tahun Anggaran | Tahun, pagu induk, status siklus, mode APBD-P, tanggal arsip terakhir | Workspace terisolasi; penghapusan setelah memiliki transaksi hanya melalui retensi 12 tahun sejak tanggal arsip terakhir; paling banyak satu berstatus Aktif Penuh pada satu waktu |
| Seksi TA | Referensi versi SOTK, nama snapshot, periode/status | Perubahan master global tidak mengubah snapshot TA |
| Pemetaan Subkegiatan TA | TA, seksi TA, subkegiatan | Satu subkegiatan hanya untuk satu seksi per TA; satu seksi dapat banyak subkegiatan |
| Penugasan TA | Peran, personel, seksi opsional, TMT, akhir, provisional | Menyimpan riwayat; PA/KPA, Bendahara, Verifikator instansi, PPTK per seksi; satu personel sah memegang peran PPTK di lebih dari satu seksi pada TA yang sama |
| Penugasan Delegasi (Plh./Plt.) | TA, personel pengganti, peran yang digantikan (Bendahara, PPTK, atau PA/KPA), seksi jika PPTK, tanggal mulai, tanggal berakhir, status (Delegasi Aktif, Berakhir, atau Dicabut), alasan pencabutan dini, ID pejabat definitif | Entitas terpisah dari Penugasan TA definitif dan tidak mengakhiri atau memindahkannya; rentang tanggal inklusif; berakhir otomatis 23:59 WITA pada tanggal berakhir; pencabutan dini wajib beralasan; selama Delegasi Aktif hak transaksi definitif nonaktif; penunjukan ditolak bila personel memegang peran yang bertentangan (Dokumen 01 §6 poin 8) |
| Penugasan Pengawas TA | TA, akun Pengawas, tanggal mulai, tanggal akhir | Tanpa seksi; cakupan seluruh seksi pada TA yang ditugaskan; berakhir pada tanggal akhir akses |
| Register SK | Penugasan, nomor/tanggal SK, berkas, status provisional | SK lama tetap dapat dibuka setelah penugasan berakhir |
| Versi Alokasi Anggaran | TA, fase (murni/perubahan/pergeseran), tanggal efektif, aktor | Append-only/berhistori secara konseptual; perubahan tidak menimpa jejak lama |
| Alokasi Subkegiatan | TA, subkegiatan, pagu | Dikelola Bendahara sesuai DPA |
| Alokasi Rekening | TA, subkegiatan, rekening, pagu | Dikelola PPTK/Seksi; total sama dengan pagu subkegiatan; perubahan pagu per fase dicatat di Versi Alokasi Anggaran; pasangan subkegiatan + rekening membedakan baris alokasi, unik per TA, subkegiatan, dan rekening; kunci internal berupa ID, kode gabungan (misal 5.1.02.02.6.2.01.01) hanya untuk tampilan dan pencarian |
| Ledger SPD | TA, rekening/alokasi, nilai SPD, perubahan, referensi (pergeseran memakai nomor otomatis `Pergeseran/{nomor urut 3 digit}/{tahun TA}`, Dokumen 01 §5.1 poin 5) | SPD otomatis 100% pagu yang disahkan; efisiensi/pergeseran berjejak |
| Kuitansi | TA, seksi, subkegiatan, rekening, penerima, bruto, uraian, tanggal kuitansi, status (Aktif atau Terkunci) | Satu kuitansi Aktif atau Terkunci mengikat komitmen SPD; kuitansi Terkunci sejak SPJ Draft dibuat dan tidak dapat diubah selama SPJ masih terkait; pada Masa Transisi seluruh data kuitansi Aktif tidak dapat diedit dan hanya pembatalan yang diizinkan; tidak ada status Dibatalkan, kuitansi yang dibatalkan langsung dihapus |
| Form Dinamis | Jenis belanja, versi, field (tipe, urutan, wajib/opsional, system tag), blok berulang (maksimal satu per form, berisi field) | Dibuat Admin per jenis belanja; setiap perubahan membentuk versi baru; SPJ menyimpan versi yang berlaku saat dibuat. Untuk perjalanan dinas mendukung tag `[SYS_PERSONNEL_ID]`, `[SYS_PERSONNEL_NAME]`, `[SYS_START_DATE]`, `[SYS_END_DATE]`; tag ID/nama berpasangan dalam konteks field/baris yang sama |
| SPJ | Kuitansi, jenis belanja (pilihan awal Seksi, menentukan form), versi form, jawaban (field tunggal dan entri blok berulang), daftar pajak (jenis pajak dari master dan nominal manual, banyak entri), lampiran PDF beserta nama asli, ukuran asal, ukuran final, dan status optimasi, status (Draft, Terkunci, Menunggu BKU, Dibukukan) | Relasi 1:1 dengan kuitansi; form snapshot saat dibuat; Total Pajak tidak boleh melebihi bruto kuitansi terkait (penyimpanan entri pajak ditolak); isian rincian bersifat informasional murni tanpa validasi matematis terhadap nominal bruto kuitansi; SPJ Terkunci sejak dikirim ke Verifikator; kuitansi terkait ikut Terkunci sejak SPJ Draft dibuat |
| Token Verifikasi SPJ | SPJ, token acak untuk barcode, nomor verifikasi (teks cetak, dibuat otomatis, urut dan tidak dipakai ulang per TA, tidak sama dengan token), waktu verifikasi, status (Berlaku atau Tidak berlaku) | Dibuat saat Verifikator menyetujui SPJ, bersama token dan nomor verifikasi; menjadi Tidak berlaku saat SPJ dikembalikan menjadi Draft (pencabutan BKU saja tidak mengubah status); token dan nomor verifikasi baru dibuat saat verifikasi ulang; halaman keaslian publik tidak menampilkan nominal atau identitas |
| Format Nomor Verifikasi | Per TA: awalan, pemisah, pola tahun, jumlah digit urut | Diatur Admin; perubahan format tidak mengubah nomor yang sudah tercetak |
| Direktori Transaksional SPJ | Kunci identitas NIP/NIK yang dimasukkan, nama pasangan, referensi sumber/pembaruan seperlunya | Terpisah dari Master Personel; mencakup pegawai organik, honorer, narasumber, dan pihak luar tanpa kategori wajib; dipakai untuk lookup dan auto-fill; tetap dipertahankan saat SPJ dibatalkan/dihapus; Admin dapat mengoreksi dan merge duplikat dengan menjaga referensi SPJ historis |
| Rentang Penugasan SPJ | TA, SPJ, identitas NIP/NIK, tanggal mulai efektif, tanggal selesai efektif | Diperoleh dari field bertag pada Form Dinamis/snapshot jawaban; bukan komitmen terpisah. Validasi overlap hanya pada pengajuan ke Verifikator, dalam TA yang sama, terhadap status SPJ Terkunci/Menunggu BKU/Dibukukan |
| BKU | Kuitansi/SPJ terkait, nomor BKU (input manual), tanggal BKU, status | Menandai realisasi pengeluaran kas belanja (tidak mencatat penerimaan kas/SP2D); satu BKU per kuitansi; nomor diinput manual oleh Bendahara & unik per TA; penanggalan bebas tanpa batasan kronologis; koreksi No. BKU/tanggal tanpa pembatalan jika nominal tidak berubah; nomor BKU yang dicabut bebas digunakan kembali; pencabutan BKU |
| Audit Event | Waktu, aktor (ID akun, snapshot nama, NIP/NIK, peran saat aksi), entitas, aksi, nilai sebelum/sesudah, alasan | Merekam perubahan signifikan, pencabutan dan koreksi BKU, serta perubahan status akun. Peristiwa yang juga dicatat: pengesahan ("Sahkan"), perubahan alokasi setelah pengesahan atau APBD-P, verifikasi SPJ disetujui atau dikembalikan, dan pencatatan BKU. Login dan logout tidak dicatat. Pembatalan kuitansi atau SPJ Draft tidak dicatat; entri yang terkait kuitansi atau SPJ tersebut ikut terhapus otomatis oleh sistem dan tidak dapat dihapus manual. Penghapusan TA setelah retensi tidak dicatat, dan seluruh entri audit TA tersebut ikut terhapus. Aktor selalu personel nyata; Admin dapat membaca seluruh entri termasuk nominal. Pada aksi Delegasi Plh./Plt., entri memuat `definitive_officer_id` (ID pejabat definitif), `delegate_officer_id` (ID pejabat penerima delegasi), dan keterangan status Delegasi Aktif. Penetapan, tanggal berlaku, pencabutan dini, dan pengakhiran otomatis wajib tercatat; pengakhiran otomatis diberi penanda otomatis. |

#### Dokumen 02 §2.3

### 2.3 Editor template
Admin mengelola tata letak dan teks melalui Visual Live Editor tanpa coding, dengan preview cetak. Opsi unggah template `.doc`/`.docx` merupakan alternatif. Editor mengatur template, bukan menggantikan data transaksi; data seperti TA, uraian, nominal, subkegiatan, pejabat dan tanggal diisi dari transaksi/Workspace TA sesuai sumbernya. Editor juga mengatur template Hasil Verifikasi SPJ (§8).

#### Dokumen 02 §6

## 6. BKU, koreksi, dan pencabutan berjenjang
BKU menandai penyelesaian pembukuan oleh Bendahara dan mengubah komitmen menjadi realisasi kas.

1. **Koreksi tanpa pencabutan:** Bendahara dapat mengoreksi No. BKU atau tanggal BKU tanpa mencabut BKU, selama nominal tidak berubah. Sistem mengecek keunikan No. BKU. Setiap koreksi tercatat di Jejak Audit dengan nilai lama dan nilai baru.
2. **Pencabutan berjenjang:** Untuk mencabut BKU yang salah, urutan yang terkunci adalah:
   1. Bendahara mencabut BKU; pencabutan tercatat di Jejak Audit.
   2. Verifikator mengembalikan SPJ menjadi Draft dengan catatan.
   3. Seksi melepas SPJ dari kuitansi.
   4. Seksi membatalkan kuitansi.
   5. Sistem memulihkan komitmen/saldo SPD terkait.
3. **Pembatalan tanpa jejak mutlak:** Pembatalan kuitansi atau SPJ Draft benar-benar dihapus tuntas dari sistem tanpa meninggalkan jejak. Seluruh entri Jejak Audit yang terkait kuitansi atau SPJ tersebut, termasuk riwayat pencatatan, koreksi, dan pencabutan BKU, ikut terhapus bersih secara otomatis oleh sistem bersama data kuitansi atau SPJ. Tidak ada rekaman pembatalan yang tersisa di audit trail.

#### Dokumen 03 §5

## 5. Verifikator
1. Memeriksa SPJ yang diajukan Seksi.
2. Menyetujui untuk diteruskan ke proses pembukuan atau mengembalikan ke Seksi sebagai Draft dengan catatan revisi wajib.
3. Pengembalian membuka kunci SPJ menjadi Draft, tetapi tidak melepaskan kuitansi atau komitmen SPD.
4. Mengikuti urutan pencabutan berjenjang ketika BKU dicabut dan transaksi harus dikembalikan.
5. Melihat Pagu Induk pada kartu TA dan seluruh Jejak Audit TA, dalam mode baca saja.
6. Melihat drill-down anggaran seluruh seksi sampai rekening belanja, dalam mode baca saja.
7. Mengunduh laporan seluruh seksi dalam mode baca saja (Dokumen 01 §9).
8. Mengunduh lampiran PDF SPJ seluruh seksi (Dokumen 02 §9).
9. Mencetak Hasil Verifikasi SPJ dengan barcode dan nomor verifikasi untuk SPJ seluruh seksi setelah SPJ disetujui (Dokumen 02 §8).
10. Tidak memverifikasi SPJ yang ia ajukan atau kelola sendiri, baik sebagai pejabat definitif maupun Plh./Plt. PPTK (Dokumen 01 §6 poin 9).

- Menyusun dan mengunduh laporan kustom untuk seluruh seksi, dengan pilihan kolom sesuai Matriks Kolom yang Diizinkan per Peran (Dokumen 01 §9 poin 12). Kolom kuitansi, NIP/NIK, Nomor Rekening, dan kolom rekening belanja tersedia, dan NIP/NIK serta Nomor Rekening ditampilkan penuh tanpa penyamaran (Dokumen 01 §9 poin 12d dan Dokumen 05 skenario 158).

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

## 4. Skenario uji Dokumen 05 untuk langkah ini (apa adanya)
Format Bagian-Nomor.

- **F-33** (BKU-04): Pencabutan BKU hanya berjalan melalui urutan pencabutan berjenjang; nomor BKU yang telah dicabut berstatus bebas kembali dan dapat dicatat pada transaksi kuitansi/SPJ lain di TA yang sama; SPD pulih setelah kuitansi dibatalkan sesuai alur.
- **F-33c** (BKU-04): Pencabutan BKU tercatat di Jejak Audit tanpa alasan tertulis.
- **Q-130** (VER-04): Cetak Hasil Verifikasi hanya tersedia untuk SPJ berstatus Menunggu BKU atau Dibukukan; SPJ Draft dan Terkunci ditolak.
- **Q-131** (VER-03, VER-04): PDF Hasil Verifikasi memuat barcode dan nomor verifikasi yang tercetak sebagai teks. Token tidak tercetak sebagai teks, dan nomor verifikasi tidak sama dengan token. Template dapat diubah melalui Visual Live Editor tanpa mengubah data sistem.
- **Q-131a** (VER-03): Saat SPJ disetujui kembali setelah dikembalikan, nomor verifikasi dan token baru dibuat; nomor dan token lama menampilkan Tidak berlaku. Pencetakan ulang selama token belum berganti memuat nomor verifikasi dan barcode yang sama.
- **Q-131b** (VER-04): Verifikator dapat mencetak Hasil Verifikasi untuk SPJ seluruh seksi; PPTK hanya untuk seksinya. Pencetakan oleh Admin, Bendahara, PA/KPA, Pengawas/Auditor, atau Publik ditolak di server, termasuk melalui URL langsung.
- **Q-131c** (TPL-04, VER-04): Admin dapat mengubah tata letak, label, teks statis, logo, dan gambar stempel Hasil Verifikasi SPJ melalui Visual Live Editor dengan preview cetak. Cetakan hanya memuat data sesuai Dokumen 02 §8 poin 2; data sistem tidak dapat diubah dari editor, dan Jumlah yang dibayarkan dan Total Pajak tercetak sebagai hasil perhitungan sistem sesuai 131e.
- **Q-131d** (TPL-04, VER-03): Nomor verifikasi dibuat otomatis saat SPJ disetujui, berurutan dalam TA, dan tidak dipakai ulang. Admin mengatur format nomor per TA; nomor yang sudah tercetak tidak berubah ketika format diganti. Peran selain Admin tidak dapat mengubah format, termasuk melalui URL langsung.
- **Q-131e** (VER-04): Total Pajak dihitung sistem sebagai jumlah seluruh entri pajak SPJ, dan Jumlah yang dibayarkan sebagai nilai bruto dikurangi Total Pajak. Tidak ada perhitungan otomatis lain pada lembar verifikasi.
- **Q-132** (VER-05): Halaman keaslian tanpa login hanya menampilkan status, nama TA, nama seksi, dan tanggal verifikasi. Respons server tidak memuat nominal, nama penerima, NIP/NIK, rekening, lampiran, atau jejak audit.
- **Q-133** (VER-03, VER-04, VER-05, BKU-04): Setelah SPJ dikembalikan menjadi Draft, cetakan lama menampilkan Tidak berlaku pada halaman keaslian. Pencabutan BKU saja tidak mengubah status: selama SPJ belum dikembalikan dan kuitansi belum dibatalkan, cetakan lama tetap menampilkan Berlaku dan SPJ dapat diteruskan ke input BKU ulang.
- **Q-134** (VER-05): Token keaslian yang tidak dikenal atau sudah tidak berlaku menghasilkan respons seragam tanpa membocorkan data.
- **R-149** (BKU-04): Setiap konfirmasi aksi yang tidak dapat dibatalkan, termasuk pencabutan BKU, memakai pop-up konfirmasi. Menutup pop-up tanpa konfirmasi tidak mengubah data.

Selesai bila SEMUA skenario yang tercantum di bagian 4 lulus.