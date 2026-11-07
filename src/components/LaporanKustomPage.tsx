// LAP-07 — Penyusunan Laporan Kustom (halaman sendiri). Matriks kolom per peran divalidasi di lapisan data.
import { useState } from 'react';
import { Button, Card, FilterSelect, useToast } from '@/components/ui';
import { ErrorLine, SectionTitle, aktorSesi } from '@/components/AnggaranShared';
import { LaporanCetakModal, TabelLaporan, unduhLaporanExcel } from '@/components/LaporanTampil';
import { kolomKustomBoleh, laporanKustom, type Laporan } from '@/data/laporan';
import { repo } from '@/data/repo';
import { getSession } from '@/lib/auth';
import { FileDown } from 'lucide-react';

export function LaporanKustomPage() {
  const s = getSession()!;
  const aktor = aktorSesi()!;
  const ta_id = s.active_ta_id!;
  const ta = repo.tahunAnggaranById(ta_id)!;
  const toast = useToast();
  const kolomBoleh = kolomKustomBoleh(aktor.peran);
  const [pilih, setPilih] = useState<string[]>(kolomBoleh.slice(0, 3).map((k) => k.id));
  const [seksi, setSeksi] = useState('');
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');
  const [cetak, setCetak] = useState<Laporan | null>(null);
  const seksiList = repo.seksiTAByTA(ta_id);
  const param = { kolom: pilih, seksi_ta_id: seksi || undefined, dari: dari || undefined, sampai: sampai || undefined };
  const pratinjau = laporanKustom(aktor, ta_id, param, 10);

  const susun = (): Laporan | null => {
    const h = laporanKustom(aktor, ta_id, param); // validasi ulang di data saat unduh
    if (!h.ok) { toast.notify(h.error); return null; }
    return { id: 'a', judul: 'Laporan Kustom', keterangan: `TA ${ta.tahun}`, judulDiSheet: true, sheets: [{ nama: 'Laporan Kustom', blok: [{ kolom: h.data.kolom, baris: h.data.baris }] }] };
  };
  const unduh = () => { const l = susun(); if (l) unduhLaporanExcel(l, `Laporan Kustom TA ${ta.tahun}`); };
  const pdf = () => { const l = susun(); if (l) setCetak(l); };
  const toggle = (id: string) => setPilih(pilih.includes(id) ? pilih.filter((x) => x !== id) : [...pilih, id]);

  if (kolomBoleh.length === 0) return <ErrorLine msg="Peran Anda tidak memiliki akses Penyusunan Laporan Kustom." />;
  return (
    <div className="space-y-4">
      <Card className="space-y-3 p-5">
        <SectionTitle title="Penyusunan Laporan Kustom" desc={`TA ${ta.tahun} • hanya SPJ Dibukukan dengan BKU tercatat`} />
        <div>
          <p className="mb-1 text-2xs text-mist-dim">Pilih kolom</p>
          <div className="flex flex-wrap gap-3">
            {kolomBoleh.map((k) => (
              <label key={k.id} className="flex items-center gap-1 text-2xs text-mist"><input type="checkbox" checked={pilih.includes(k.id)} onChange={() => toggle(k.id)} /> {k.label}</label>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {aktor.peran !== 'pptk' && (
            <FilterSelect value={seksi} onChange={setSeksi} label="Seksi" options={seksiList.map((x) => ({ value: x.id, label: x.nama_snapshot }))} />
          )}
          <label className="flex items-center gap-1 text-2xs text-mist-dim">Dari
            <input type="date" value={dari} onChange={(e) => setDari(e.target.value)} className="rounded-md border border-ink-edge bg-ink px-2 py-1 text-2xs text-mist" /></label>
          <label className="flex items-center gap-1 text-2xs text-mist-dim">Sampai
            <input type="date" value={sampai} onChange={(e) => setSampai(e.target.value)} className="rounded-md border border-ink-edge bg-ink px-2 py-1 text-2xs text-mist" /></label>
          <Button variant="ghost" onClick={() => { setSeksi(''); setDari(''); setSampai(''); }}>Reset</Button>
        </div>
      </Card>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-edge px-4 py-3">
          <h3 className="text-sm font-semibold text-mist">Pratinjau{pratinjau.ok ? ` (${Math.min(10, pratinjau.data.totalBaris)} dari ${pratinjau.data.totalBaris} baris)` : ''}</h3>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={unduh} disabled={!pratinjau.ok}><FileDown size={14} /> Unduh Excel (.xlsx)</Button>
            <Button variant="secondary" onClick={pdf} disabled={!pratinjau.ok}><FileDown size={14} /> Unduh PDF</Button>
          </div>
        </div>
        {pratinjau.ok
          ? <TabelLaporan laporan={{ id: 'a', judul: 'Pratinjau', judulDiSheet: false, sheets: [{ nama: 'Pratinjau', blok: [{ kolom: pratinjau.data.kolom, baris: pratinjau.data.baris }] }] }} />
          : <div className="p-4"><ErrorLine msg={pratinjau.error} /></div>}
      </Card>
      {cetak && <LaporanCetakModal laporan={cetak} onClose={() => setCetak(null)} />}
    </div>
  );
}
