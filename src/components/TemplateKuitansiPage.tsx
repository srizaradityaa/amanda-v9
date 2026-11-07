// TPL-01 — Visual Live Editor template kuitansi (Admin). Mengatur teks template, bukan data transaksi.
// D02 §2.3: opsi unggah .doc/.docx sebagai alternatif. Editor mengatur template, bukan data transaksi.
import { useState, useRef } from 'react';
import { Card, Button, Field, Input, useToast } from '@/components/ui';
import { repo } from '@/data/repo';
import type { TemplateKuitansi } from '@/data/types';
import { UnggahBerkas } from '@/components/UnggahBerkas';
import { LembarKuitansi, KUNCI_LOGO_KUITANSI } from '@/components/LembarKuitansi';
import { simpanBerkasSesi, hapusBerkasSesi, urlBerkasSesi, MB, ekstensiBerkas } from '@/lib/berkas';
import { Upload, FileText, X } from 'lucide-react';

const CONTOH = {
  ta: '2026',
  bruto: 1500000,
  terbilang: 'Satu juta lima ratus ribu rupiah',
  uraian: 'Pembelian bahan habis pakai triwulan I',
  subkeg: 'Penyediaan Layanan Administrasi Perkantoran',
  kodeSubkeg: '5.1.02.02.6.2.01.01',
  kodeRek: '5.2.2.01',
  tanggal: '3 November 2026',
  pa: { nama: 'Nama PA/KPA', nip: '000000000000000000' },
  bendahara: { nama: 'Nama Bendahara', nip: '000000000000000000' },
  pptk: { nama: 'Nama PPTK', nip: '000000000000000000' },
  penerima: 'Nama Penerima',
};

const EKSTENSI_DITERIMA = ['.doc', '.docx'];
const MIME_DITERIMA = [
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function ekstensiValid(nama: string): boolean {
  return EKSTENSI_DITERIMA.some((e) => nama.toLowerCase().endsWith(e));
}

export function TemplateKuitansiPage() {
  const [t, setT] = useState<TemplateKuitansi>(() => ({ ...repo.templateKuitansi() }));
  const [err, setErr] = useState('');
  const [errUpload, setErrUpload] = useState('');
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const simpan = () => {
    const r = repo.simpanTemplateKuitansi(t);
    if (!r.ok) { setErr(r.error ?? 'Gagal menyimpan.'); return; }
    setErr('');
    toast.notify('Tersimpan');
  };

  const onPilihBerkas = (e: React.ChangeEvent<HTMLInputElement>) => {
    const berkas = e.target.files?.[0];
    if (!berkas) return;
    setErrUpload('');
    if (!ekstensiValid(berkas.name)) {
      setErrUpload(`Format tidak didukung. Hanya file ${EKSTENSI_DITERIMA.join(' atau ')}.`);
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    if (MIME_DITERIMA.length > 0 && berkas.type && !MIME_DITERIMA.includes(berkas.type)) {
      setErrUpload(`Tipe MIME tidak didukung. Hanya file ${EKSTENSI_DITERIMA.join(' atau ')}.`);
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    setT({ ...t, berkas_doc: berkas.name });
  };

  const pilihLogo = (f: File) => {
    if (!['png', 'jpg', 'jpeg'].includes(ekstensiBerkas(f.name))) { setErrUpload('Format logo harus PNG atau JPG.'); return; }
    if (f.size > 2 * MB) { setErrUpload('Ukuran logo paling besar 2 MB.'); return; }
    setErrUpload('');
    simpanBerkasSesi(KUNCI_LOGO_KUITANSI, f);
    setT({ ...t, logo_berkas: f.name });
  };
  const hapusLogo = () => { hapusBerkasSesi(KUNCI_LOGO_KUITANSI); setT({ ...t, logo_berkas: null }); };

  const hapusBerkas = () => {
    setT({ ...t, berkas_doc: null });
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <Card className="space-y-4 p-4">
        <h3 className="text-sm font-semibold text-mist">Konfigurasi Editor</h3>
        <Field label="Nama instansi" required><Input value={t.nama_instansi} onChange={(e) => setT({ ...t, nama_instansi: e.target.value })} /></Field>
        <Field label="Judul dokumen" required><Input value={t.judul_dokumen} onChange={(e) => setT({ ...t, judul_dokumen: e.target.value })} /></Field>
        <Field label="Tempat (blok penerima)"><Input value={t.tempat_penerima} onChange={(e) => setT({ ...t, tempat_penerima: e.target.value })} /></Field>
        <Field label="Teks 'Sudah terima dari'" hint="Sama untuk semua kuitansi, mis. BENDAHARA SKPD KECAMATAN BATUMANDI."><Input value={t.terima_dari} onChange={(e) => setT({ ...t, terima_dari: e.target.value })} /></Field>
        <Field label="Logo instansi" hint="PNG atau JPG, maksimal 2 MB. Pada Tahap A hanya tersimpan selama sesi.">
          <UnggahBerkas nama={t.logo_berkas} accept=".png,.jpg,.jpeg" label="Pilih logo" onPilih={pilihLogo} onHapus={hapusLogo} />
        </Field>

        <div className="space-y-2 border-t border-ink-edge pt-3">
          <p className="text-2xs text-mist-dim">Alternatif: unggah template .doc/.docx (D02 §2.3)</p>
          {t.berkas_doc ? (
            <div className="flex items-center gap-2 rounded-md border border-ink-edge px-3 py-2">
              <FileText size={14} className="text-mist-dim" />
              <span className="flex-1 truncate text-2xs text-mist">{t.berkas_doc}</span>
              <button onClick={hapusBerkas} className="rounded p-1 text-mist-dim hover:text-crit" aria-label="Hapus berkas"><X size={14} /></button>
            </div>
          ) : (
            <label className="flex cursor-pointer items-center gap-2 rounded-md border border-dashed border-ink-edge px-3 py-2 text-2xs text-mist-dim hover:border-mist-dim hover:text-mist">
              <Upload size={14} />
              <span>Pilih file .doc / .docx</span>
              <input ref={fileRef} type="file" accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={onPilihBerkas} className="hidden" />
            </label>
          )}
          {errUpload && <p className="text-2xs text-crit">{errUpload}</p>}
        </div>

        {err && <p className="text-2xs text-crit">{err}</p>}
        <Button onClick={simpan}>Simpan Template</Button>
      </Card>

      <Card className="overflow-x-auto p-4">
        <p className="mb-3 text-2xs text-mist-dim">Pratinjau cetak (contoh data, setengah kertas F4)</p>
        <div className="mx-auto w-full max-w-[700px] overflow-hidden border border-ink-edge">
          <LembarKuitansi
            tpl={t}
            logoUrl={t.logo_berkas ? urlBerkasSesi(KUNCI_LOGO_KUITANSI) : null}
            d={{ tahun: CONTOH.ta, kode_subkegiatan: CONTOH.kodeSubkeg, kode_rekening: CONTOH.kodeRek, bruto: CONTOH.bruto, terbilang: CONTOH.terbilang, uraian: CONTOH.uraian, subkegiatan: CONTOH.subkeg, pa: CONTOH.pa, bendahara: CONTOH.bendahara, pptk: CONTOH.pptk, penerima: CONTOH.penerima, tanggal: CONTOH.tanggal }}
          />
          {t.berkas_doc && (
            <p className="border-t border-black pt-2 text-[9px] text-gray-600">Template unggahan: {t.berkas_doc}</p>
          )}
        </div>
      </Card>
    </div>
  );
}
