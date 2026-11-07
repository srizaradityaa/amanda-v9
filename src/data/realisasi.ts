// Realisasi sah = BKU aktif pada SPJ berstatus Dibukukan (D01 §12 poin 2). Komitmen tidak dihitung.
import * as data from '@/data/sampleData';

export interface BarisBKU {
  ta_id: string;
  seksi_id: string;
  pemetaan_id: string;
  tanggal_bku: string;
  nomor_bku: string;
  bruto: number;
}

export function realisasiBKU(ta_id: string): BarisBKU[] {
  const hasil: BarisBKU[] = [];
  for (const b of data.bku) {
    if (b.ta_id !== ta_id || b.status !== 'Aktif') continue;
    const spj = data.spj.find((x) => x.id === b.spj_id);
    const k = data.kuitansi.find((x) => x.id === b.kuitansi_id);
    if (!spj || !k || spj.status !== 'Dibukukan') continue;
    hasil.push({ ta_id, seksi_id: k.seksi_ta_id, pemetaan_id: k.pemetaan_subkegiatan_id, tanggal_bku: b.tanggal_bku, nomor_bku: b.nomor_bku, bruto: k.bruto });
  }
  return hasil;
}

export function persen1(bagian: number, penyebut: number): number | null {
  return penyebut > 0 ? Math.round((bagian / penyebut) * 1000) / 10 : null;
}
