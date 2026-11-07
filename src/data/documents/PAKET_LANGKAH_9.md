# PAKET LANGKAH 9: RETENSI & PENUTUP

**Sumber kebenaran mutlak:** Dokumen 01 v1.53, Dokumen 02 v1.33, Dokumen 03 v1.58, Dokumen 04 v1.38, Dokumen 05 v1.64.  
**Cakupan paket ini:** Tahap A, yaitu frontend dengan data contoh. Pekerjaan backend Langkah 9 baru dimulai di Tahap B (lihat `SUSUNAN_PENGEMBANGAN_AMANDA_BERTAHAP.md`).

## Perintah kerja
Kerjakan hanya fitur yang tercantum di bagian 1, berurutan dari atas ke bawah, memakai aturan yang tertulis di bagian 2 dan 3. Jangan menambah, mengurangi, atau mengubah aturan bisnis. Bila ada hal yang tidak diatur dokumen, hentikan dan tanyakan, jangan merancang sendiri. Langkah selesai bila seluruh skenario di bagian 4 dapat didemonstrasikan pada antarmuka dengan data contoh.

## 1. Fitur Langkah 9 (urutan kerja)
| Urut | ID | Fitur | Peran | Prioritas | Pekerjaan | Dependensi |
|---|---|---|---|---|---|---|
| 131 | TA-08 | Penghapusan TA setelah retensi 12 tahun | Admin | P2 | Frontend | TA-07, AUD-02 |

## 2. Aturan kunci per fitur (ringkasan)
### TA-08 — Penghapusan TA setelah retensi 12 tahun
- **Peran:** Admin
- **Aturan:** Hanya Arsip RO > 12 th sejak tanggal arsip terakhir (WITA); ringkasan jumlah kuitansi/SPJ/BKU/lampiran tanpa nominal; ketik kode TA; hapus total (data, lampiran, audit), tanpa catatan; tidak otomatis; ditolak server untuk selain Admin.
- **Rujukan:** D01 §1.3 poin 6; D03 §2.3; D04 §6, §8
- **Keputusan pemilik yang sudah masuk dokumen:** N-11/N-12: berkas lampiran final dan data dihapus berantai bersama TA.

## 3. Kutipan bagian dokumen yang dirujuk (apa adanya)
Bagian berikut disalin tanpa perubahan dari dokumen sumber. Bila ringkasan di bagian 2 berbeda dengan kutipan ini, kutipan yang berlaku.

#### Dokumen 01 §1.3

### 1.3 Siklus Hidup & Proteksi Tahun Anggaran (TA)
1. **Empat Tahapan Siklus TA:**
   - **Draft / Persiapan:** Penyiapan pagu induk, formasi pejabat, dan pemetaan subkegiatan.
   - **Aktif Penuh:** Masa operasional transaksi, pembuatan kuitansi, SPJ, dan pencairan kas.
   - **Masa Transisi / Tutup Buku:** Penyelesaian verifikasi akhir, pembukuan sisa transaksi, dan rekonsiliasi. Kuitansi dan SPJ baru tidak dapat dibuat pada status ini. Seluruh data kuitansi (nominal, uraian, penerima, dan tanggal) terkunci dan tidak dapat diedit; yang tetap berjalan hanya pembatalan kuitansi Aktif, pengajuan dan verifikasi SPJ, pencatatan BKU, serta pencabutan BKU (rincian di Dokumen 02 §7).
   - **Arsip Read-Only:** Seluruh data terkunci untuk kepentingan audit, pencarian dokumen, dan cetak ulang laporan. Admin dapat membuka kembali TA Arsip secara manual; setiap kali TA diarsipkan kembali, masa retensi 12 tahun dihitung ulang dari tanggal arsip terbaru (poin 6). Pembukaan kembali menjadikan TA berstatus Masa Transisi / Tutup Buku. Admin juga dapat mengembalikan TA Masa Transisi menjadi Aktif Penuh selama tidak ada TA lain berstatus Aktif Penuh (poin 4). Perpindahan mundur selain kedua ini tidak diizinkan.
2. **Proteksi Penghapusan TA:**
   - TA berstatus **Draft** yang belum pernah memiliki transaksi berjalan boleh diedit atau dihapus oleh Admin.
   - Begitu TA pernah memiliki minimal 1 kuitansi, penghapusan TA hanya dapat dilakukan melalui retensi 12 tahun (poin 6). Penanda "sudah ada transaksi" disimpan pada data TA dan tetap berlaku meskipun seluruh kuitansi telah dihapus.
3. **Salin Struktur Terbatas dari TA Sebelumnya:**
   - Saat membuat TA baru, Admin dapat memilih opsi *Salin Struktur*.
   - **Yang Disalin:** Daftar seksi aktif pada akhir TA sebelumnya dan pemetaan subkegiatannya.
   - **Yang Dilarang Disalin:** Nominal pagu anggaran, nomor/tanggal/berkas SK pejabat, dan histori transaksi/mutasi tahun sebelumnya.
4. **Batas Satu TA Aktif Penuh:** Pada satu waktu paling banyak satu TA berstatus Aktif Penuh. Status Draft dan Arsip Read-Only tidak dibatasi jumlahnya. Status Masa Transisi / Tutup Buku tidak dihitung sebagai Aktif Penuh. Sistem menolak aktivasi TA kedua selama masih ada satu TA Aktif Penuh.
5. **Kendali Admin atas Status TA:** Seluruh perpindahan status TA (Draft, Aktif Penuh, Masa Transisi / Tutup Buku, Arsip Read-Only) dilakukan Admin secara manual. Sistem tidak mengubah status TA berdasarkan tanggal atau waktu. Pengaktifan TA hanya diizinkan jika checklist kesiapan lengkap, dan checklist itu ditampilkan kepada Admin sebelum pengaktifan. Checklist dihitung otomatis oleh sistem dari kondisi data, tidak dicentang manual, dan tidak ada pengecualian atau pelewatan oleh Admin.
6. **Retensi dan Penghapusan TA:** Masa retensi TA berstatus Arsip Read-Only adalah 12 tahun sejak tanggal arsip terakhir (WITA). Penghapusan hanya dapat dilakukan Admin secara manual terhadap TA Arsip Read-Only yang telah melewati 12 tahun. Sistem tidak menghapus berdasarkan tanggal. Sebelum konfirmasi, sistem menampilkan ringkasan jumlah kuitansi, SPJ, BKU, dan lampiran yang akan dihapus, tanpa nominal. Admin mengonfirmasi dengan mengetik kode TA. Penghapusan bersifat total: seluruh data TA, lampiran, dan jejak audit yang terkait dihapus permanen dari database aktif dan penyimpanan berkas, tanpa catatan penghapusan. Salinan cadangan platform tidak dapat dihapus dari aplikasi dan mengikuti kebijakan retensi cadangan platform.

---

#### Dokumen 03 §2.3

### 2.3 Perubahan selama TA
- Mencatat mutasi SOTK atau pejabat dengan tanggal efektif dan audit trail; penugasan lama berakhir sehari sebelum penugasan pengganti.
- Menetapkan penugasan Delegasi Aktif (Plh./Plt.) dengan tanggal mulai dan tanggal berakhir, serta mencabutnya lebih awal dengan alasan tertulis. Sistem menolak penunjukan jika personel memegang peran yang bertentangan pada TA tersebut (Dokumen 01 §6 poin 8).
- Mengaktifkan fase APBD-P dan menetapkan Pagu Induk perubahan. Pembagian ulang dilakukan melalui alur Bendahara lalu PPTK/Seksi, bukan dengan menghapus histori.
- Menetapkan status TA ke Masa Transisi/Tutup Buku lalu Arsip Read-Only pada akhir siklus. Seluruh perpindahan status dilakukan Admin secara manual; sistem tidak memindahkan status berdasarkan tanggal. Sebelum menetapkan Arsip Read-Only, sistem menampilkan SPJ atau BKU yang belum selesai sebagai peringatan; keputusan tetap di tangan Admin.
- Admin tidak membagi pagu ke subkegiatan/rekening, tidak mengelola efisiensi SPD atau pergeseran, dan tidak membuat kuitansi, SPJ, verifikasi, atau BKU.
- Membuka kembali TA Arsip Read-Only secara manual bila diperlukan; TA menjadi Masa Transisi / Tutup Buku, dan Admin dapat mengembalikannya ke Aktif Penuh selama tidak ada TA lain yang Aktif Penuh. Perpindahan mundur lain tidak diizinkan. Setiap kali TA diarsipkan kembali, masa retensi dihitung ulang dari tanggal arsip terbaru.
- Setelah TA Arsip Read-Only melewati 12 tahun sejak tanggal arsip terakhir (WITA), Admin dapat menghapus TA secara manual. Sistem menampilkan ringkasan jumlah kuitansi, SPJ, BKU, dan lampiran tanpa nominal, lalu Admin mengetik kode TA untuk konfirmasi. Penghapusan total menghapus seluruh data TA, lampiran, dan jejak audit terkait, tanpa catatan penghapusan. Salinan cadangan platform mengikuti kebijakan platform.

#### Dokumen 04 §6

## 6. Dokumen, snapshot, dan histori
- Perubahan Master SOTK tidak memindahkan transaksi lama.
- Penugasan pejabat memiliki tanggal efektif; pejabat lama berakhir H-1 tanggal mulai pengganti. Penugasan Delegasi Plh./Plt. tidak memakai aturan H-1 ini karena tidak menggantikan penugasan definitif.
- Snapshot identitas pejabat, versi form SPJ, versi anggaran, dan data kuitansi perlu tersedia untuk cetak/peninjauan historis.
- Penghapusan TA hanya diperbolehkan jika TA belum pernah memiliki kuitansi, atau melalui retensi 12 tahun setelah TA Arsip Read-Only (D01 §1.3 poin 6); penanda "sudah ada transaksi" disimpan pada data TA dan tetap berlaku meskipun seluruh kuitansi telah dibatalkan.
- Pembatalan kuitansi Aktif diperbolehkan sesuai Dokumen 02 §4 dan §7 dan tidak meninggalkan jejak. Entri Audit Event yang terkait kuitansi atau SPJ tersebut ikut terhapus otomatis.
- Pencabutan BKU memakai urutan pencabutan berjenjang (Dokumen 02 §6) dan dicatat di Audit Event. Koreksi No. BKU atau tanggal BKU dicatat dengan nilai lama dan nilai baru.
- **Identitas Aktor Audit:** Setiap Audit Event menyimpan ID akun pelaku, snapshot nama lengkap, NIP/NIK, dan peran/jabatan pada saat aksi. Snapshot tidak berubah walau data personel kemudian diubah. Efek otomatis sistem (misalnya penutupan unit pada H-1) dicatat atas nama pengguna pemicunya dengan penanda otomatis.

- **Aktor Pengawas/Auditor:** Snapshot berisi nama lengkap, instansi asal, nomor surat tugas, dan peran Pengawas, sebagai pengganti NIP/NIK.

- Rekap pajak per jenis pajak membaca entri pajak pada SPJ yang sudah memiliki BKU (Dokumen 01 §9 poin 10). Entri pajak tidak mengubah nominal bruto kuitansi maupun komitmen SPD, dan tidak masuk rekap isian SPJ per jenis belanja.
- **Snapshot Penandatangan Dokumen:** Nama dan NIP pejabat pada dokumen cetak disimpan sebagai snapshot saat dokumen dibuat (kuitansi saat disimpan; SPJ dan Hasil Verifikasi SPJ saat diajukan ke Verifikator), termasuk keterangan Plh./Plt. bila berlaku. Cetak ulang tidak mengubah snapshot, dan snapshot tidak dihitung ulang setelah delegasi berakhir.


### 6.1 Snapshot Data Rekening Bank pada SPJ
- Ketika rincian SPJ disimpan, data penerima (`recipient_name`, `bank_name`, `account_number`, `alias`) disimpan sebagai bagian dari dokumen/payload SPJ (`spj_recipients` / snapshot transaksi).
- Snapshot ini bersifat *immutable* (tidak terpengaruh) terhadap operasi pembaruan (*update*), koreksi nama, atau penggabungan (*merge*) yang dilakukan Admin di tabel `bank_accounts_directory`.

## 4. Skenario uji Dokumen 05 untuk langkah ini (apa adanya)
Format Bagian-Nomor.

- **B-6** (TA-08): TA Draft tanpa transaksi dapat dihapus; TA yang pernah memiliki kuitansi, termasuk yang kuitansinya sudah dihapus, tidak dapat dihapus kecuali melalui retensi 12 tahun (skenario 66–70).
- **J-67** (TA-08): Tombol hapus TA hanya aktif untuk TA Arsip Read-Only yang telah melewati 12 tahun sejak tanggal arsip terakhir. TA Aktif Penuh, TA Masa Transisi, Draft yang pernah memiliki kuitansi, dan Arsip yang belum 12 tahun ditolak di server. Sistem tidak menghapus otomatis berdasarkan tanggal.
- **J-68** (TA-08): Sebelum konfirmasi, sistem menampilkan ringkasan jumlah kuitansi, SPJ, BKU, dan lampiran yang akan dihapus, tanpa nominal. Penghapusan berjalan hanya jika kode TA yang diketik sama persis.
- **J-69** (TA-08): Setelah penghapusan TA, seluruh data TA (kuitansi, SPJ, BKU, lampiran, isian form, alokasi, penugasan, snapshot, dan entri audit terkait) tidak dapat ditemukan di database aktif maupun penyimpanan berkas, dan tidak ada catatan penghapusan.
- **J-70** (TA-08): Penghapusan TA ditolak di server untuk seluruh peran selain Admin, termasuk melalui URL atau pemanggilan langsung.

Selesai bila SEMUA skenario yang tercantum di bagian 4 lulus.