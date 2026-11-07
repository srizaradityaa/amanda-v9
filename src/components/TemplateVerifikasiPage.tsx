// TPL-04 — Admin: template Hasil Verifikasi SPJ (tata letak/label/teks/logo/stempel) dan format nomor verifikasi per TA.
// Editor hanya mengatur teks konfigurasi; data sistem pada cetakan tidak dapat diubah dari sini.
import { useState } from 'react';
import { Button, Card, Field, Input, Select, useToast } from '@/components/ui';
import { UnggahBerkas } from '@/components/UnggahBerkas';
import { ErrorLine } from '@/components/AnggaranShared';
import { LembarVerifikasi, urlKeaslian, KUNCI_LOGO, KUNCI_STEMPEL } from '@/components/CetakVerifikasi';
import { repo, type DataCetakVerifikasi } from '@/data/repo';
import { getSession } from '@/lib/auth';
import { simpanBerkasSesi, hapusBerkasSesi, MB, ekstensiBerkas } from '@/lib/berkas';
import type { FormatNomorVerifikasi, TemplateVerifikasi } from '@/data/types';

const CONTOH: DataCetakVerifikasi = {
  ta_tahun: '2026', seksi_nama: 'Contoh Seksi', spj_id: 'spj-contoh', jenis_belanja: 'Belanja Barang Habis Pakai',
  nomor_verifikasi: 'VER/2026/0001', tanggal_verifikasi: '2026-03-03', verifikator_nama: 'Nama Verifikator', verifikator_nip: '000000000000000000',
  subkegiatan: '0.00.00.0.00.00 Contoh Subkegiatan', kode_rekening: '5.2.02.01 Contoh Rekening', uraian: 'Contoh uraian belanja',
  bruto: 1_000_000, penerima: 'Nama Penerima',
  rekening_penerima: [{ id: 'r', account_name: 'Nama Penerima', bank_name: 'Bank Contoh', account_number: '1234567890', alias: null }],
  pajak: [{ nama: 'Contoh Pajak', nominal: 100_000 }], total_pajak: 100_000, dibayarkan: 900_000, token: 'CONTOHTOKEN',
  pa_kpa_nama: 'Nama PA/KPA', pa_kpa_nip: '000', bendahara_nama: 'Nama Bendahara', bendahara_nip: '000', pptk_nama: 'Nama PPTK', pptk_nip: '000',
};
const LABEL: [keyof TemplateVerifikasi, string][] = [
  ['label_nomor', 'Label nomor'], ['label_tanggal', 'Label tanggal'], ['label_seksi', 'Label seksi'], ['label_subkegiatan', 'Label sub kegiatan'],
  ['label_rekening', 'Label kode rekening'], ['label_uraian', 'Label uraian'], ['label_bruto', 'Label bruto'], ['label_penerima', 'Label penerima'],
  ['label_rekening_penerima', 'Label rekening penerima'], ['label_pajak', 'Label pajak'], ['label_total_pajak', 'Label total pajak'],
  ['label_dibayarkan', 'Label jumlah dibayarkan'], ['label_verifikator', 'Label verifikator'],
];

export function TemplateVerifikasiPage() {
  const s = getSession()!;
  const toast = useToast();
  const [t, setT] = useState<TemplateVerifikasi>(() => ({ ...repo.templateVerifikasi() }));
  const [err, setErr] = useState<string | null>(null);
  const [errBerkas, setErrBerkas] = useState<string | null>(null);
  const tas = repo.tahunAnggaran();
  const [taId, setTaId] = useState(tas.find((x) => x.status === 'Aktif Penuh')?.id ?? tas[0]?.id ?? '');
  const [fmt, setFmt] = useState<FormatNomorVerifikasi>(() => repo.formatNomorVerifikasi(taId));
  const [errFmt, setErrFmt] = useState<string | null>(null);
  const [, setTick] = useState(0);

  const ganti = (id: string) => { setTaId(id); setFmt(repo.formatNomorVerifikasi(id)); setErrFmt(null); };
  const simpan = () => {
    const r = repo.simpanTemplateVerifikasi(t, s);
    if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
    setErr(null); toast.notify('Tersimpan');
  };
  const simpanFmt = () => {
    const r = repo.simpanFormatNomor(taId, fmt, s);
    if (!r.ok) { setErrFmt(r.error ?? 'Gagal'); return; }
    setErrFmt(null); toast.notify('Tersimpan');
  };
  const pilihGambar = (kunci: string, kolom: 'logo_berkas' | 'stempel_berkas', f: File) => {
    const ext = ekstensiBerkas(f.name);
    if (!['png', 'jpg', 'jpeg'].includes(ext)) { setErrBerkas('Format gambar harus PNG atau JPG.'); return; }
    if (f.size > 2 * MB) { setErrBerkas('Ukuran gambar paling besar 2 MB.'); return; }
    setErrBerkas(null);
    simpanBerkasSesi(kunci, f);
    setT({ ...t, [kolom]: f.name });
  };
  const hapusGambar = (kunci: string, kolom: 'logo_berkas' | 'stempel_berkas') => {
    hapusBerkasSesi(kunci);
    setT({ ...t, [kolom]: null });
    setTick((n) => n + 1);
  };
  const teks = (k: keyof TemplateVerifikasi, label: string) => (
    <Field key={k} label={label}><Input value={(t[k] as string) ?? ''} onChange={(e) => setT({ ...t, [k]: e.target.value })} /></Field>
  );
  const contohNomor = repo.contohNomorVerifikasi(taId, fmt);

  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-4">
        <h3 className="text-sm font-semibold text-mist">Format Nomor Verifikasi per TA</h3>
        <div className="grid gap-3 sm:grid-cols-5">
          <Field label="Tahun Anggaran">
            <Select value={taId} onChange={(e) => ganti(e.target.value)}>{tas.map((x) => <option key={x.id} value={x.id}>TA {x.tahun}</option>)}</Select>
          </Field>
          <Field label="Awalan"><Input value={fmt.awalan} onChange={(e) => setFmt({ ...fmt, awalan: e.target.value })} /></Field>
          <Field label="Pemisah"><Input value={fmt.pemisah} onChange={(e) => setFmt({ ...fmt, pemisah: e.target.value })} /></Field>
          <Field label="Pola tahun">
            <Select value={fmt.pola_tahun} onChange={(e) => setFmt({ ...fmt, pola_tahun: e.target.value as FormatNomorVerifikasi['pola_tahun'] })}>
              <option value="YYYY">4 digit (2026)</option><option value="YY">2 digit (26)</option><option value="TANPA">Tanpa tahun</option>
            </Select>
          </Field>
          <Field label="Jumlah digit urut"><Input type="number" min={1} max={8} value={fmt.digit} onChange={(e) => setFmt({ ...fmt, digit: Number(e.target.value) })} /></Field>
        </div>
        <p className="text-2xs text-mist-dim">Nomor berikutnya: <span className="mono text-mist">{contohNomor}</span>. Nomor yang sudah tercetak tidak berubah.</p>
        <ErrorLine msg={errFmt} />
        <Button onClick={simpanFmt}>Simpan Format</Button>
      </Card>

      <div className="grid gap-4 lg:grid-cols-[340px_1fr]">
        <Card className="space-y-3 p-4">
          <h3 className="text-sm font-semibold text-mist">Template Hasil Verifikasi SPJ</h3>
          <Field label="Nama instansi" required><Input value={t.nama_instansi} onChange={(e) => setT({ ...t, nama_instansi: e.target.value })} /></Field>
          <Field label="Judul dokumen" required><Input value={t.judul_dokumen} onChange={(e) => setT({ ...t, judul_dokumen: e.target.value })} /></Field>
          {teks('subjudul', 'Subjudul')}
          {teks('teks_pembuka', 'Teks pembuka')}
          {teks('teks_penutup', 'Teks penutup')}
          {teks('teks_qr', 'Teks di samping barcode')}
          {LABEL.map(([k, l]) => teks(k, l))}
          <div className="space-y-1">
            <p className="text-2xs text-mist-dim">Logo (PNG/JPG, maks. 2 MB)</p>
            <UnggahBerkas nama={t.logo_berkas} accept=".png,.jpg,.jpeg" label="Pilih logo" onPilih={(f) => pilihGambar(KUNCI_LOGO, 'logo_berkas', f)} onHapus={() => hapusGambar(KUNCI_LOGO, 'logo_berkas')} />
          </div>
          <div className="space-y-1">
            <p className="text-2xs text-mist-dim">Gambar stempel (PNG/JPG, maks. 2 MB)</p>
            <UnggahBerkas nama={t.stempel_berkas} accept=".png,.jpg,.jpeg" label="Pilih stempel" onPilih={(f) => pilihGambar(KUNCI_STEMPEL, 'stempel_berkas', f)} onHapus={() => hapusGambar(KUNCI_STEMPEL, 'stempel_berkas')} />
          </div>
          <p className="text-2xs text-mist-dim">Gambar hanya dipegang pada sesi ini. Penyimpanan permanen menunggu backend.</p>
          <ErrorLine msg={errBerkas} />
          <ErrorLine msg={err} />
          <Button onClick={simpan}>Simpan Template</Button>
        </Card>
        <Card className="overflow-x-auto p-4">
          <p className="mb-3 text-2xs text-mist-dim">Pratinjau cetak (data contoh; data sistem tidak dapat diubah dari editor)</p>
          <div className="mx-auto max-w-[640px]"><LembarVerifikasi d={{ ...CONTOH, nomor_verifikasi: contohNomor, token: urlKeaslian('CONTOH').slice(-6) }} tpl={t} /></div>
        </Card>
      </div>
    </div>
  );
}
