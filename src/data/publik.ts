// Lapisan "server" portal keterbukaan (PUB-01..06). Hanya agregat aman keluar dari modul ini:
// persentase, cacah, nama TA/seksi, peringkat, dan waktu pembaruan. Tidak ada nominal rupiah, baris transaksi,
// penerima, NIP/NIK, rekening, akun, maupun audit (D01 §10 poin 2 dan 8; D04 §2.3).
// Komponen portal hanya boleh memanggil fungsi di sini, tidak membaca data sumber.

import * as data from '@/data/sampleData';
import { paguIndukAktif, paguSeksi } from '@/data/anggaran';
import { persen1, realisasiBKU } from '@/data/realisasi';
import { nowWita } from '@/lib/wita';

export interface TAPublik { id: string; label: string; status: string; bawaan: boolean }
export type KodeKategori = 'selesai' | 'verifikasi' | 'perbaikan' | 'draf';
export interface KategoriSPJPublik { kode: KodeKategori; label: string; cacah: number; persen: number | null }
export interface SeksiPublik { id: string; nama: string; persen: number | null; peringkat: number }
export interface RingkasanPublik {
  ta_id: string;
  ta_label: string;
  persen_realisasi: number | null; // null = "Belum tersedia"
  total_spj: number;
  kategori: KategoriSPJPublik[];
  seksi: SeksiPublik[];
  diperbarui: string;
}

const STATUS_TERSEDIA = ['Aktif Penuh', 'Masa Transisi', 'Arsip Read-Only'];

/** Daftar TA untuk pemilih publik: TA Aktif sebagai bawaan; TA historis/arsip dapat dipilih. Draft tidak tersedia. */
export function daftarTAPublik(): TAPublik[] {
  const tersedia = data.tahunAnggaran.filter((t) => STATUS_TERSEDIA.includes(t.status)).sort((a, b) => b.tahun.localeCompare(a.tahun));
  const aktif = tersedia.find((t) => t.status === 'Aktif Penuh') ?? tersedia[0];
  return tersedia.map((t) => ({ id: t.id, label: `TA ${t.tahun}`, status: t.status, bawaan: t.id === aktif?.id }));
}

const LABEL: Record<KodeKategori, string> = {
  selesai: 'Selesai / Dibukukan BKU',
  verifikasi: 'Dalam Verifikasi',
  perbaikan: 'Perlu Perbaikan',
  draf: 'Draf / Persiapan PPTK',
};

// Empat kategori saling eksklusif. Pembeda draf persiapan dan dikembalikan = catatan_revisi yang hanya terisi
// oleh aksi Kembalikan Verifikator (penanda alur eksplisit, bukan tebakan dari isi dokumen).
function kategoriSPJ(status: string, dikembalikan: boolean): KodeKategori {
  if (status === 'Dibukukan') return 'selesai';
  if (status === 'Terkunci' || status === 'Menunggu BKU') return 'verifikasi';
  return dikembalikan ? 'perbaikan' : 'draf';
}

export function ringkasanPublik(ta_id: string): RingkasanPublik | null {
  if (!daftarTAPublik().some((t) => t.id === ta_id)) return null;
  const ta = data.tahunAnggaran.find((t) => t.id === ta_id)!;
  const rows = realisasiBKU(ta_id);
  const total = rows.reduce((a, r) => a + r.bruto, 0);
  const daftarSPJ = data.spj.filter((s) => s.ta_id === ta_id);
  const hitung: Record<KodeKategori, number> = { selesai: 0, verifikasi: 0, perbaikan: 0, draf: 0 };
  for (const s of daftarSPJ) hitung[kategoriSPJ(s.status, !!s.catatan_revisi)]++;
  const kategori = (Object.keys(LABEL) as KodeKategori[]).map((kode) => ({
    kode, label: LABEL[kode], cacah: hitung[kode], persen: persen1(hitung[kode], daftarSPJ.length),
  }));
  const seksi = data.seksiTA.filter((s) => s.ta_id === ta_id).map((s) => ({
    id: s.id, nama: s.nama_snapshot,
    persen: persen1(rows.filter((r) => r.seksi_id === s.id).reduce((a, r) => a + r.bruto, 0), paguSeksi(ta_id, s.id)),
  }));
  seksi.sort((a, b) => (b.persen ?? -1) - (a.persen ?? -1) || a.nama.localeCompare(b.nama));
  return {
    ta_id,
    ta_label: `TA ${ta.tahun}`,
    persen_realisasi: persen1(total, paguIndukAktif(ta_id)),
    total_spj: daftarSPJ.length,
    kategori,
    seksi: seksi.map((s, i) => ({ ...s, peringkat: i + 1 })),
    diperbarui: nowWita(),
  };
}
