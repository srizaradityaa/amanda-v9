// Katalog laporan baku (LAP-01..06), laporan kustom (LAP-07), dan unduh lampiran SPJ (SPJ-08).
// Semua pembatasan peran dan cakupan ditegakkan di sini (lapisan data), bukan di tampilan.
// Basis laporan: hanya SPJ berstatus Dibukukan dengan BKU aktif (D01 §9 poin 3).

import * as data from '@/data/sampleData';
import { paguSeksi, paguSubkegiatan, statusSeksi } from '@/data/anggaran';
import type { AktorAnggaran } from '@/data/anggaran';
import { repo } from '@/data/repo';
import { recordAudit } from '@/lib/audit';
import { formatRupiah } from '@/lib/format';
import { todayWita } from '@/lib/wita';
import type { BKU, FormDinamis, FieldFormDinamis, Kuitansi, SPJ } from '@/data/types';

export type Sel = string | number | null;
export interface KolomLaporan { nama: string; tipe?: 'rupiah' | 'persen' }
export interface BlokLaporan {
  judul?: string[];
  kolom: KolomLaporan[];
  baris: Sel[][];
  total?: Sel[];
}
export interface SheetLaporan { nama: string; blok: BlokLaporan[] }
export type LaporanId = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
export interface Laporan {
  id: LaporanId;
  judul: string;
  keterangan?: string;
  judulDiSheet: boolean;
  sheets: SheetLaporan[];
}
export interface FilterLaporan {
  seksi_ta_id?: string;
  dari?: string;
  sampai?: string;
  jenis_belanja?: string[];
  jenis_pajak?: string[];
  pemetaan_id?: string;
}
export type HasilData<T> = { ok: true; data: T } | { ok: false; error: string };

export const DAFTAR_LAPORAN: { id: LaporanId; judul: string; deskripsi: string }[] = [
  { id: 'a', judul: 'Rekap realisasi per seksi', deskripsi: 'Pagu, realisasi BKU, Realisasi (%), dan status per seksi.' },
  { id: 'b', judul: 'Buku Kas (BKU)', deskripsi: 'Nomor BKU, tanggal BKU, nominal, dan kuitansi terkait.' },
  { id: 'c', judul: 'Daftar kuitansi dan SPJ', deskripsi: 'Kuitansi dan SPJ yang sudah Dibukukan.' },
  { id: 'd', judul: 'Realisasi per seksi dan subkegiatan', deskripsi: 'Realisasi (%) per seksi dan per subkegiatan.' },
  { id: 'e', judul: 'Rekap isian SPJ per jenis belanja', deskripsi: 'Isian Form Dinamis per SPJ; satu sheet per jenis belanja.' },
  { id: 'f', judul: 'Rekap pajak per jenis pajak', deskripsi: 'Entri pajak SPJ ber-BKU; satu sheet per jenis pajak.' },
  { id: 'g', judul: 'Rincian Kartu Kendali Kegiatan', deskripsi: 'Realisasi dan sisa anggaran per subkegiatan dan rekening belanja.' },
];

export function laporanBolehUntuk(peran: string): LaporanId[] {
  if (peran === 'pa_kpa') return ['a', 'b', 'd', 'e', 'f', 'g'];
  if (['bendahara', 'verifikator', 'pptk', 'pengawas'].includes(peran)) return ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
  return [];
}

// ===== Cakupan =====
function cakupanSeksi(aktor: AktorAnggaran, ta_id: string, filter: FilterLaporan): HasilData<string[]> {
  const ta = data.tahunAnggaran.find((t) => t.id === ta_id);
  if (!ta) return { ok: false, error: 'TA tidak ditemukan.' };
  if (!['bendahara', 'verifikator', 'pa_kpa', 'pptk', 'pengawas'].includes(aktor.peran)) {
    return { ok: false, error: 'Peran Anda tidak memiliki akses laporan.' };
  }
  if (aktor.peran === 'pengawas' && !repo.taIdsForPengawas(aktor.id).includes(ta_id)) {
    return { ok: false, error: 'TA ini tidak termasuk penugasan Anda.' };
  }
  const semua = data.seksiTA.filter((s) => s.ta_id === ta_id).map((s) => s.id);
  let lingkup = semua;
  if (aktor.peran === 'pptk') {
    if (!aktor.seksi_ta_id || !semua.includes(aktor.seksi_ta_id)) return { ok: false, error: 'Seksi PPTK tidak valid.' };
    lingkup = [aktor.seksi_ta_id];
  }
  if (filter.seksi_ta_id) {
    if (!lingkup.includes(filter.seksi_ta_id)) return { ok: false, error: 'Seksi di luar cakupan Anda.' };
    lingkup = [filter.seksi_ta_id];
  }
  return { ok: true, data: lingkup };
}

// ===== Baris dasar: BKU aktif dari SPJ Dibukukan =====
interface BarisRealisasi { bku: BKU; k: Kuitansi; spj: SPJ; seksi_id: string }

function barisRealisasi(ta_id: string, seksiIds: string[], f: FilterLaporan): BarisRealisasi[] {
  const hasil: BarisRealisasi[] = [];
  for (const b of data.bku) {
    if (b.ta_id !== ta_id || b.status !== 'Aktif') continue;
    const spj = data.spj.find((x) => x.id === b.spj_id);
    const k = data.kuitansi.find((x) => x.id === b.kuitansi_id);
    if (!spj || !k || spj.status !== 'Dibukukan') continue;
    if (!seksiIds.includes(k.seksi_ta_id)) continue;
    if (f.dari && b.tanggal_bku < f.dari) continue;
    if (f.sampai && b.tanggal_bku > f.sampai) continue;
    hasil.push({ bku: b, k, spj, seksi_id: k.seksi_ta_id });
  }
  return hasil.sort((x, y) => x.bku.tanggal_bku.localeCompare(y.bku.tanggal_bku) || x.bku.nomor_bku.localeCompare(y.bku.nomor_bku));
}

const namaSeksi = (id: string) => data.seksiTA.find((s) => s.id === id)?.nama_snapshot ?? '—';
const persen = (real: number, pagu: number): number | null => (pagu > 0 ? Math.round((real / pagu) * 10000) / 100 : null);
const pem = (id: string) => data.pemetaanSubkegiatanTA.find((p) => p.id === id);
const rek = (id: string) => data.masterRekeningBelanja.find((r) => r.id === id);

function ket(f: FilterLaporan): string {
  const bagian: string[] = [];
  if (f.dari || f.sampai) bagian.push(`Periode tanggal BKU ${f.dari || '…'} s.d. ${f.sampai || '…'}`);
  return bagian.join(' • ');
}

// ===== Pembuat laporan =====
export function buatLaporan(id: LaporanId, aktor: AktorAnggaran, ta_id: string, filter: FilterLaporan = {}): HasilData<Laporan> {
  if (!laporanBolehUntuk(aktor.peran).includes(id)) {
    return { ok: false, error: aktor.peran === 'admin' ? 'Admin tidak mendapat laporan.' : 'Laporan ini tidak tersedia untuk peran Anda.' };
  }
  const sc = cakupanSeksi(aktor, ta_id, filter);
  if (!sc.ok) return sc;
  const seksiIds = sc.data;
  const ta = data.tahunAnggaran.find((t) => t.id === ta_id)!;
  const meta = DAFTAR_LAPORAN.find((l) => l.id === id)!;
  const rows = barisRealisasi(ta_id, seksiIds, filter);
  const dasar = { id, judul: meta.judul, keterangan: [`TA ${ta.tahun}`, ket(filter)].filter(Boolean).join(' • ') };
  const pa = aktor.peran === 'pa_kpa';

  if (id === 'a') {
    const baris: Sel[][] = seksiIds.map((sid) => {
      const pagu = paguSeksi(ta_id, sid);
      const real = rows.filter((r) => r.seksi_id === sid).reduce((a, r) => a + r.k.bruto, 0);
      return [namaSeksi(sid), pagu, real, persen(real, pagu), statusSeksi(ta_id, sid)];
    });
    return { ok: true, data: { ...dasar, judulDiSheet: true, sheets: [{ nama: 'Rekap Realisasi', blok: [{
      kolom: [{ nama: 'Seksi' }, { nama: 'Pagu', tipe: 'rupiah' }, { nama: 'Realisasi BKU', tipe: 'rupiah' }, { nama: 'Realisasi (%)', tipe: 'persen' }, { nama: 'Status' }], baris }] }] } };
  }

  if (id === 'b') {
    const kolom: KolomLaporan[] = [{ nama: 'No. BKU' }, { nama: 'Tanggal BKU' }, { nama: 'Nominal', tipe: 'rupiah' }];
    if (!pa) kolom.push({ nama: 'Kuitansi Terkait' });
    const baris = rows.map((r) => {
      const b: Sel[] = [r.bku.nomor_bku, r.bku.tanggal_bku, r.k.bruto];
      if (!pa) b.push(`${r.k.uraian} (${r.k.penerima})`);
      return b;
    });
    return { ok: true, data: { ...dasar, judulDiSheet: true, sheets: [{ nama: 'Buku Kas', blok: [{ kolom, baris }] }] } };
  }

  if (id === 'c') {
    const baris = rows.map((r) => [r.k.id, r.k.tanggal_kuitansi, namaSeksi(r.seksi_id), r.k.status, r.spj.status]);
    return { ok: true, data: { ...dasar, judulDiSheet: true, sheets: [{ nama: 'Kuitansi dan SPJ', blok: [{
      kolom: [{ nama: 'Nomor Kuitansi' }, { nama: 'Tanggal Kuitansi' }, { nama: 'Seksi' }, { nama: 'Status Kuitansi' }, { nama: 'Status SPJ' }], baris }] }] } };
  }

  if (id === 'd') {
    const perSeksi: Sel[][] = seksiIds.map((sid) => {
      const pagu = paguSeksi(ta_id, sid);
      const real = rows.filter((r) => r.seksi_id === sid).reduce((a, r) => a + r.k.bruto, 0);
      return [namaSeksi(sid), pagu, real, persen(real, pagu)];
    });
    const perSub: Sel[][] = [];
    for (const sid of seksiIds) {
      for (const p of data.pemetaanSubkegiatanTA.filter((x) => x.ta_id === ta_id && x.seksi_ta_id === sid)) {
        const pagu = paguSubkegiatan(p.id);
        const real = rows.filter((r) => r.k.pemetaan_subkegiatan_id === p.id).reduce((a, r) => a + r.k.bruto, 0);
        perSub.push([namaSeksi(sid), p.kode_snapshot, p.nama_snapshot, pagu, real, persen(real, pagu)]);
      }
    }
    return { ok: true, data: { ...dasar, judulDiSheet: true, sheets: [{ nama: 'Realisasi', blok: [
      { judul: ['Per seksi'], kolom: [{ nama: 'Seksi' }, { nama: 'Pagu', tipe: 'rupiah' }, { nama: 'Realisasi BKU', tipe: 'rupiah' }, { nama: 'Realisasi (%)', tipe: 'persen' }], baris: perSeksi },
      { judul: ['Per subkegiatan'], kolom: [{ nama: 'Seksi' }, { nama: 'Kode Subkegiatan' }, { nama: 'Subkegiatan' }, { nama: 'Pagu', tipe: 'rupiah' }, { nama: 'Realisasi BKU', tipe: 'rupiah' }, { nama: 'Realisasi (%)', tipe: 'persen' }], baris: perSub },
    ] }] } };
  }

  if (id === 'e') return { ok: true, data: laporanE(dasar, rows, filter) };
  if (id === 'f') return { ok: true, data: laporanF(dasar, rows, filter, pa) };
  return { ok: true, data: laporanG(dasar, ta_id, seksiIds, filter) };
}

// ----- (e) Rekap isian SPJ per jenis belanja -----
function formUntuk(spj: SPJ): FormDinamis | undefined {
  return repo.getFormByVersion(spj.jenis_belanja, spj.versi_form);
}
function urutFields(f: FieldFormDinamis[]): FieldFormDinamis[] {
  return [...f].sort((a, b) => a.urutan - b.urutan);
}
// Kunci kolom: label + urutan kemunculan (label berulang diberi penanda urut, mis. "Nama Maskapai 1", "Nama Maskapai 2")
function kolomForm(form: FormDinamis): { key: string; label: string; field: FieldFormDinamis; blok: boolean }[] {
  const daftar = [
    ...urutFields(form.fields).map((f) => ({ f, blok: false })),
    ...(form.blok_berulang ? urutFields(form.blok_berulang.fields).map((f) => ({ f, blok: true })) : []),
  ];
  const jumlah = new Map<string, number>();
  for (const d of daftar) jumlah.set(d.f.label, (jumlah.get(d.f.label) ?? 0) + 1);
  const kemunculan = new Map<string, number>();
  return daftar.map((d) => {
    const n = (kemunculan.get(d.f.label) ?? 0) + 1;
    kemunculan.set(d.f.label, n);
    const label = (jumlah.get(d.f.label) ?? 1) > 1 ? `${d.f.label} ${n}` : d.f.label;
    return { key: label, label, field: d.f, blok: d.blok };
  });
}
function nilaiSel(field: FieldFormDinamis, v: string | undefined): Sel {
  if (v === undefined || v === '') return null;
  if (field.tipe === 'angka' && /^-?\d+(\.\d+)?$/.test(v) && v.length < 15) return Number(v);
  return v;
}

function laporanE(dasar: Omit<Laporan, 'judulDiSheet' | 'sheets'>, rows: BarisRealisasi[], f: FilterLaporan): Laporan {
  const jenisList = [...new Set(rows.map((r) => r.spj.jenis_belanja))]
    .filter((j) => !f.jenis_belanja || f.jenis_belanja.length === 0 || f.jenis_belanja.includes(j));
  const sheets: SheetLaporan[] = [];
  for (const jenis of jenisList) {
    const spjs = rows.filter((r) => r.spj.jenis_belanja === jenis).map((r) => r.spj);
    const bentuk = new Map<string, { form: FormDinamis; versi: number }>();
    for (const s of spjs) {
      const form = formUntuk(s);
      if (form) bentuk.set(s.versi_form, { form, versi: Number(s.versi_form.replace(/\D/g, '')) || 0 });
    }
    const urutVersi = [...bentuk.values()].sort((a, b) => b.versi - a.versi);
    const kolom: string[] = [];
    for (const v of urutVersi) for (const k of kolomForm(v.form)) if (!kolom.includes(k.key)) kolom.push(k.key);
    const baris: Sel[][] = [];
    for (const s of spjs) {
      const form = formUntuk(s);
      if (!form) continue;
      const kf = kolomForm(form);
      const blok = form.blok_berulang;
      const entri = blok && Array.isArray(s.jawaban[blok.id]) && (s.jawaban[blok.id] as Record<string, string>[]).length > 0
        ? (s.jawaban[blok.id] as Record<string, string>[]) : [{}];
      for (const e of entri) {
        baris.push(kolom.map((key) => {
          const k = kf.find((x) => x.key === key);
          if (!k) return null;
          const v = k.blok ? e[k.field.id] : (s.jawaban[k.field.id] as string | undefined);
          return nilaiSel(k.field, typeof v === 'string' ? v : undefined);
        }));
      }
    }
    sheets.push({ nama: jenis, blok: [{ kolom: kolom.map((nama) => ({ nama })), baris }] });
  }
  return { ...dasar, judulDiSheet: false, sheets };
}

// ----- (f) Rekap pajak per jenis pajak -----
function laporanF(dasar: Omit<Laporan, 'judulDiSheet' | 'sheets'>, rows: BarisRealisasi[], f: FilterLaporan, pa: boolean): Laporan {
  const kolom: KolomLaporan[] = [{ nama: 'Jenis Pajak' }, { nama: 'Nominal Pajak', tipe: 'rupiah' }, { nama: 'Seksi' }, { nama: 'Jenis Belanja' }, { nama: 'Kode Subkegiatan' }, { nama: 'Kode Rekening Belanja' }, { nama: 'No. BKU' }];
  if (!pa) kolom.push({ nama: 'Tanggal Kuitansi' });
  const grup = new Map<string, Sel[][]>();
  for (const r of rows) {
    for (const e of r.spj.entri_pajak) {
      if (f.jenis_pajak && f.jenis_pajak.length > 0 && !f.jenis_pajak.includes(e.jenis_pajak_id)) continue;
      const nama = data.masterJenisPajak.find((j) => j.id === e.jenis_pajak_id)?.nama_jenis_pajak ?? '—';
      const b: Sel[] = [nama, e.nominal, namaSeksi(r.seksi_id), r.spj.jenis_belanja, pem(r.k.pemetaan_subkegiatan_id)?.kode_snapshot ?? '—', rek(r.k.rekening_id)?.kode_rekening ?? '—', r.bku.nomor_bku];
      if (!pa) b.push(r.k.tanggal_kuitansi);
      grup.set(nama, [...(grup.get(nama) ?? []), b]);
    }
  }
  const sheets = [...grup.entries()].map(([nama, baris]) => ({ nama, blok: [{ kolom, baris }] }));
  return { ...dasar, judulDiSheet: false, sheets };
}

// ----- (g) Rincian Kartu Kendali Kegiatan -----
function laporanG(dasar: Omit<Laporan, 'judulDiSheet' | 'sheets'>, ta_id: string, seksiIds: string[], f: FilterLaporan): Laporan {
  // Sisa anggaran dihitung dari awal TA: ambil seluruh baris tanpa filter periode, dalam cakupan seksi peran.
  const penuh = barisRealisasi(ta_id, seksiIds, { dari: undefined, sampai: undefined });
  const kunciSet = new Map<string, BarisRealisasi[]>();
  for (const r of penuh) {
    if (f.pemetaan_id && r.k.pemetaan_subkegiatan_id !== f.pemetaan_id) continue;
    const key = `${r.k.pemetaan_subkegiatan_id}|${r.k.rekening_id}`;
    kunciSet.set(key, [...(kunciSet.get(key) ?? []), r]);
  }
  const blok: BlokLaporan[] = [];
  for (const [key, daftar] of kunciSet) {
    const [pemId, rekId] = key.split('|');
    const alokasi = data.alokasiRekening.find((a) => a.ta_id === ta_id && a.pemetaan_subkegiatan_id === pemId && a.rekening_id === rekId);
    const pagu = alokasi?.pagu ?? 0;
    let kumulatif = 0;
    const barisSemua = daftar.map((r) => {
      kumulatif += r.k.bruto;
      return { r, sisa: pagu - kumulatif };
    });
    const tampil = barisSemua.filter(({ r }) => (!f.dari || r.bku.tanggal_bku >= f.dari) && (!f.sampai || r.bku.tanggal_bku <= f.sampai));
    if (tampil.length === 0) continue;
    const p = pem(pemId);
    const rk = rek(rekId);
    const totalReal = tampil.reduce((a, { r }) => a + r.k.bruto, 0);
    blok.push({
      judul: [
        `Subkegiatan: ${p?.kode_snapshot ?? ''} ${p?.nama_snapshot ?? ''}`.trim(),
        `Rekening Belanja: ${rk?.kode_rekening ?? ''} ${rk?.nama ?? ''}`.trim(),
        `Pagu akhir: ${formatRupiah(pagu)}`,
      ],
      kolom: [{ nama: 'No' }, { nama: 'Tanggal' }, { nama: 'No. Bukti' }, { nama: 'Uraian' }, { nama: 'Realisasi', tipe: 'rupiah' }, { nama: 'Sisa Anggaran', tipe: 'rupiah' }],
      baris: tampil.map(({ r, sisa }, i) => [i + 1, r.bku.tanggal_bku, r.bku.nomor_bku, r.k.uraian, r.k.bruto, sisa]),
      total: ['', '', '', 'TOTAL', totalReal, tampil[tampil.length - 1].sisa],
    });
  }
  const sampai = f.sampai || todayWita();
  return { ...dasar, keterangan: `per ${sampai}${ket(f) ? ` • ${ket(f)}` : ''}`, judulDiSheet: true, sheets: [{ nama: 'Kartu Kendali', blok }] };
}

// ===== LAP-07 Laporan kustom =====
export interface DefKolomKustom { id: string; label: string }
export const KOLOM_KUSTOM: DefKolomKustom[] = [
  { id: 'tanggal_bku', label: 'Tanggal BKU' },
  { id: 'no_bku', label: 'No. BKU' },
  { id: 'subkegiatan', label: 'Kode dan Nama Subkegiatan' },
  { id: 'rekening_belanja', label: 'Kode dan Nama Rekening Belanja' },
  { id: 'uraian', label: 'Uraian Kuitansi' },
  { id: 'penerima', label: 'Nama Penerima' },
  { id: 'bruto', label: 'Nilai Bruto' },
  { id: 'total_pajak', label: 'Total Pajak' },
  { id: 'dibayarkan', label: 'Jumlah Dibayarkan' },
  { id: 'nip_rekening', label: 'NIP/NIK dan Nomor Rekening' },
];
const DILARANG_PA_KPA = ['rekening_belanja', 'uraian', 'penerima', 'nip_rekening'];

/** Kolom yang boleh dipilih oleh peran (Matriks Kolom, D01 §9 poin 12d). */
export function kolomKustomBoleh(peran: string): DefKolomKustom[] {
  if (!['bendahara', 'pptk', 'verifikator', 'pa_kpa'].includes(peran)) return [];
  return KOLOM_KUSTOM.filter((k) => peran !== 'pa_kpa' || !DILARANG_PA_KPA.includes(k.id));
}

function nipPelaku(spj: SPJ): string {
  const form = formUntuk(spj);
  if (!form) return '';
  const hasil: string[] = [];
  for (const f of form.fields) if (f.system_tag === '[SYS_PERSONNEL_ID]') { const v = spj.jawaban[f.id]; if (typeof v === 'string' && v) hasil.push(v); }
  const b = form.blok_berulang;
  if (b && Array.isArray(spj.jawaban[b.id])) {
    for (const f of b.fields) if (f.system_tag === '[SYS_PERSONNEL_ID]') {
      for (const e of spj.jawaban[b.id] as Record<string, string>[]) if (e[f.id]) hasil.push(e[f.id]);
    }
  }
  return hasil.join('; ');
}

export interface HasilKustom { kolom: KolomLaporan[]; baris: Sel[][]; totalBaris: number }

export function laporanKustom(
  aktor: AktorAnggaran, ta_id: string,
  param: { kolom: string[]; seksi_ta_id?: string; dari?: string; sampai?: string },
  batas?: number,
): HasilData<HasilKustom> {
  if (!['bendahara', 'pptk', 'verifikator', 'pa_kpa'].includes(aktor.peran)) {
    return { ok: false, error: 'Peran Anda tidak memiliki akses Penyusunan Laporan Kustom.' };
  }
  if (!param.kolom || param.kolom.length === 0) return { ok: false, error: 'Pilih minimal satu kolom.' };
  const boleh = kolomKustomBoleh(aktor.peran).map((k) => k.id);
  const terlarang = param.kolom.filter((k) => !boleh.includes(k));
  if (terlarang.length > 0) return { ok: false, error: 'Permintaan ditolak: memuat kolom yang tidak diizinkan untuk peran Anda.' };
  const sc = cakupanSeksi(aktor, ta_id, { seksi_ta_id: param.seksi_ta_id });
  if (!sc.ok) return sc;
  const rows = barisRealisasi(ta_id, sc.data, { dari: param.dari, sampai: param.sampai });
  const kolom: KolomLaporan[] = [];
  for (const id of KOLOM_KUSTOM.map((k) => k.id).filter((k) => param.kolom.includes(k))) {
    const label = KOLOM_KUSTOM.find((k) => k.id === id)!.label;
    if (id === 'nip_rekening') { kolom.push({ nama: 'NIP/NIK' }, { nama: 'Nomor Rekening' }); continue; }
    kolom.push({ nama: label, tipe: ['bruto', 'total_pajak', 'dibayarkan'].includes(id) ? 'rupiah' : undefined });
  }
  const urut = KOLOM_KUSTOM.map((k) => k.id).filter((k) => param.kolom.includes(k));
  const baris: Sel[][] = rows.map((r) => {
    const totalPajak = r.spj.entri_pajak.reduce((a, e) => a + e.nominal, 0);
    const p = pem(r.k.pemetaan_subkegiatan_id);
    const rk = rek(r.k.rekening_id);
    const out: Sel[] = [];
    for (const id of urut) {
      switch (id) {
        case 'tanggal_bku': out.push(r.bku.tanggal_bku); break;
        case 'no_bku': out.push(r.bku.nomor_bku); break;
        case 'subkegiatan': out.push(`${p?.kode_snapshot ?? ''} ${p?.nama_snapshot ?? ''}`.trim()); break;
        case 'rekening_belanja': out.push(`${rk?.kode_rekening ?? ''} ${rk?.nama ?? ''}`.trim()); break;
        case 'uraian': out.push(r.k.uraian); break;
        case 'penerima': out.push(r.k.penerima); break;
        case 'bruto': out.push(r.k.bruto); break;
        case 'total_pajak': out.push(totalPajak); break;
        case 'dibayarkan': out.push(r.k.bruto - totalPajak); break;
        case 'nip_rekening': out.push(nipPelaku(r.spj) || null, r.spj.rekening_penerima.map((x) => x.account_number).join('; ') || null); break;
      }
    }
    return out;
  });
  return { ok: true, data: { kolom, baris: batas ? baris.slice(0, batas) : baris, totalBaris: baris.length } };
}

// ===== Jejak unduhan Pengawas (D01 §9 poin 5) =====
export function catatUnduhanPengawas(aktor: AktorAnggaran, ta_id: string, namaLaporan: string, format: 'Excel' | 'PDF'): void {
  if (aktor.peran !== 'pengawas') return; // peran lain tidak menghasilkan jejak (T-163)
  recordAudit({ ta_id, entitas: `Laporan ${namaLaporan}`, aksi: 'aksi_pengawas', nilai_sesudah: `Unduhan ${format}` });
}
