// Analitik Burn-Rate, zona peringatan dini, dan Heatmap (ANA-01..07). Khusus PA/KPA; peran lain ditolak di sini.
// Bersifat advisory: tidak ada fungsi operasional yang memanggil modul ini, sehingga tidak ada yang diblokir (ANA-05).

import * as data from '@/data/sampleData';
import type { AktorAnggaran } from '@/data/anggaran';
import { paguSeksi, paguSubkegiatan } from '@/data/anggaran';
import { persen1, realisasiBKU } from '@/data/realisasi';
import { selisihHari, tambahHari, todayWita } from '@/lib/wita';

export type Zona = 'MERAH' | 'ORANYE' | 'KUNING' | 'HIJAU';
export const LABEL_ZONA: Record<Zona, string> = {
  MERAH: 'Kritis', ORANYE: 'Lonjakan Tidak Wajar', KUNING: 'Serapan Lambat', HIJAU: 'Normal',
};
export type HasilA<T> = { ok: true; data: T } | { ok: false; error: string };

export interface AnalitikSeksi {
  seksi_id: string;
  nama: string;
  pagu_sah_terakhir: number;
  realisasi_bku: number;
  burn_rate_pct: number | null;
  time_elapsed_pct: number;
  bku_spike_14d_pct: number | null;
  zona: Zona;
  label: string;
  deviasi: string; // teks tooltip
  is_frozen: boolean;
}
export interface RingkasanZona { normal: number; perhatian: number; lonjakan: number; total: number }
export interface AnalitikTA {
  ta_label: string;
  time_elapsed_pct: number;
  is_frozen: boolean;
  tanggal_acuan: string;
  ringkasan: RingkasanZona;
  seksi: AnalitikSeksi[];
}

function hanyaPaKpa(aktor: AktorAnggaran): string | null {
  return aktor.peran === 'pa_kpa' ? null : 'Analitik hanya dapat diakses PA/KPA.';
}

/** Time Elapsed (%) = hari terlewati sejak 1 Januari ÷ jumlah hari TA (365/366) × 100. */
export function timeElapsedPct(tahun: number, hariIni: string): number {
  const awal = `${tahun}-01-01`;
  const akhir = `${tahun}-12-31`;
  const total = selisihHari(akhir, awal) + 1;
  if (hariIni < awal) return 0;
  if (hariIni > akhir) return 100;
  return Math.round(((selisihHari(hariIni, awal) + 1) / total) * 10000) / 100;
}

export function analitikSeksi(ta_id: string, aktor: AktorAnggaran, hariIniOverride?: string): HasilA<AnalitikTA> {
  const tolak = hanyaPaKpa(aktor);
  if (tolak) return { ok: false, error: tolak };
  const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
  if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
  const beku = ta.status === 'Masa Transisi' || ta.status === 'Arsip Read-Only';
  const tahun = Number(ta.tahun);
  // Pada TA beku: Time Elapsed 100% dan jendela lonjakan diacu ke akhir tutup buku (31 Desember TA).
  const acuan = beku ? `${tahun}-12-31` : (hariIniOverride ?? todayWita());
  const te = beku ? 100 : timeElapsedPct(tahun, acuan);
  const awalJendela = tambahHari(acuan, -13);
  const rows = realisasiBKU(ta_id);

  const seksi: AnalitikSeksi[] = data.seksiTA.filter((s) => s.ta_id === ta_id).map((s) => {
    const pagu = paguSeksi(ta_id, s.id);
    const milik = rows.filter((r) => r.seksi_id === s.id);
    const real = milik.reduce((a, r) => a + r.bruto, 0);
    const burn = pagu > 0 ? (real / pagu) * 100 : null;
    const lonjakanNominal = milik.filter((r) => r.tanggal_bku >= awalJendela && r.tanggal_bku <= acuan).reduce((a, r) => a + r.bruto, 0);
    const spike = pagu > 0 ? (lonjakanNominal / pagu) * 100 : null;
    let zona: Zona = 'HIJAU';
    if (burn !== null && te > 90 && burn < 60) zona = 'MERAH';
    else if (spike !== null && spike >= 40) zona = 'ORANYE';
    else if (burn !== null && te > 75 && burn < 50) zona = 'KUNING';
    const burnTeks = burn === null ? 'Belum tersedia' : `${burn.toFixed(1)}%`;
    const dev = burn === null ? '' : ` (deviasi ${(burn - te).toFixed(1)} poin)`;
    return {
      seksi_id: s.id, nama: s.nama_snapshot, pagu_sah_terakhir: pagu, realisasi_bku: real,
      burn_rate_pct: burn === null ? null : Math.round(burn * 100) / 100,
      time_elapsed_pct: te,
      bku_spike_14d_pct: spike === null ? null : Math.round(spike * 100) / 100,
      zona, label: LABEL_ZONA[zona],
      deviasi: `Burn-Rate ${burnTeks} vs Time Elapsed ${te.toFixed(1)}%${dev}${spike !== null ? ` • BKU 14 hari ${spike.toFixed(1)}% dari pagu` : ''}`,
      is_frozen: beku,
    };
  });
  // Kritis diangkat ke baris teratas; urutan lain dipertahankan.
  seksi.sort((a, b) => Number(b.zona === 'MERAH') - Number(a.zona === 'MERAH'));
  const ringkasan: RingkasanZona = {
    normal: seksi.filter((x) => x.zona === 'HIJAU').length,
    perhatian: seksi.filter((x) => x.zona === 'KUNING' || x.zona === 'MERAH').length,
    lonjakan: seksi.filter((x) => x.zona === 'ORANYE').length,
    total: seksi.length,
  };
  return { ok: true, data: { ta_label: `TA ${ta.tahun}`, time_elapsed_pct: te, is_frozen: beku, tanggal_acuan: acuan, ringkasan, seksi } };
}

// ===== ANA-07 Heatmap Sebaran Realisasi Bulanan =====
export interface BarisHeatmap {
  tingkat: 'seksi' | 'subkegiatan';
  id: string;
  nama: string;
  kode?: string;
  bulan: number[]; // 12 bulan menurut Tanggal BKU pada tahun TA
  luar_tahun: number; // BKU bertanggal di luar tahun TA (penanggalan bebas) agar total tetap rekonsiliasi
  total: number;
  pagu: number;
  persen_bulan: (number | null)[]; // Porsi Realisasi Bulanan terhadap Pagu Sah Terakhir (pembagi pagu subkegiatan)
}
export interface HeatmapTA { ta_label: string; baris: BarisHeatmap[]; rekonsiliasi_ok: boolean; snapshot: boolean }

export function heatmapBulanan(ta_id: string, aktor: AktorAnggaran): HasilA<HeatmapTA> {
  const tolak = hanyaPaKpa(aktor);
  if (tolak) return { ok: false, error: tolak };
  const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
  if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
  const rows = realisasiBKU(ta_id);
  const buat = (tingkat: 'seksi' | 'subkegiatan', id: string, nama: string, pagu: number, milik: typeof rows, kode?: string): BarisHeatmap => {
    const bulan = Array<number>(12).fill(0);
    let luar = 0;
    for (const r of milik) {
      if (r.tanggal_bku.slice(0, 4) === ta.tahun) bulan[Number(r.tanggal_bku.slice(5, 7)) - 1] += r.bruto;
      else luar += r.bruto;
    }
    return { tingkat, id, nama, kode, bulan, luar_tahun: luar, total: milik.reduce((a, r) => a + r.bruto, 0), pagu, persen_bulan: bulan.map((n) => persen1(n, pagu)) };
  };
  const baris: BarisHeatmap[] = [];
  let ok = true;
  for (const s of data.seksiTA.filter((x) => x.ta_id === ta_id)) {
    const subs = data.pemetaanSubkegiatanTA.filter((p) => p.ta_id === ta_id && p.seksi_ta_id === s.id);
    const subBaris = subs.map((p) => buat('subkegiatan', p.id, p.nama_snapshot, paguSubkegiatan(p.id), rows.filter((r) => r.pemetaan_id === p.id), p.kode_snapshot));
    const seksiBaris = buat('seksi', s.id, s.nama_snapshot, paguSeksi(ta_id, s.id), rows.filter((r) => r.seksi_id === s.id));
    const jumlahSub = subBaris.reduce((a, b) => a + b.total, 0);
    if (jumlahSub !== seksiBaris.total) ok = false;
    for (const b of subBaris) if (b.bulan.reduce((a, n) => a + n, 0) + b.luar_tahun !== b.total) ok = false;
    baris.push(seksiBaris, ...subBaris);
  }
  return { ok: true, data: { ta_label: `TA ${ta.tahun}`, baris, rekonsiliasi_ok: ok, snapshot: ta.status === 'Masa Transisi' || ta.status === 'Arsip Read-Only' } };
}
