// LAP-01..06 + SPJ-08 — Katalog laporan baku (PDF/Excel) dan unduh lampiran SPJ.
import { useState } from 'react';
import { Button, Card, EmptyState, FilterSelect, StatusBadge, useToast } from '@/components/ui';
import { ErrorLine, SectionTitle, aktorSesi } from '@/components/AnggaranShared';
import { LaporanCetakModal, TabelLaporan, unduhLaporanExcel } from '@/components/LaporanTampil';
import { buatLaporan, catatUnduhanPengawas, DAFTAR_LAPORAN, laporanBolehUntuk, type FilterLaporan, type LaporanId } from '@/data/laporan';
import { repo } from '@/data/repo';
import { getSession } from '@/lib/auth';
import { unduhBerkasSesi, adaBerkasSesi } from '@/lib/berkas';
import { formatRupiah } from '@/lib/format';
import { FileDown, Paperclip } from 'lucide-react';

export function LaporanPage() {
  const s = getSession()!;
  const aktor = aktorSesi()!;
  const ta_id = s.active_ta_id!;
  const ta = repo.tahunAnggaranById(ta_id)!;
  const toast = useToast();
  const boleh = laporanBolehUntuk(aktor.peran);
  const [id, setId] = useState<LaporanId>(boleh[0] ?? 'a');
  const [f, setF] = useState<FilterLaporan>({});
  const [cetak, setCetak] = useState(false);
  const seksiList = repo.seksiTAByTA(ta_id);
  const pemetaan = repo.pemetaanByTA(ta_id).filter((p) => aktor.peran !== 'pptk' || p.seksi_ta_id === aktor.seksi_ta_id);
  const meta = DAFTAR_LAPORAN.find((l) => l.id === id)!;
  const hasil = buatLaporan(id, aktor, ta_id, f);

  const unduh = () => {
    const h = buatLaporan(id, aktor, ta_id, f); // penegakan hak dilakukan ulang saat unduhan
    if (!h.ok) { toast.notify(h.error); return; }
    unduhLaporanExcel(h.data, `${meta.judul} TA ${ta.tahun}`);
    catatUnduhanPengawas(aktor, ta_id, meta.judul, 'Excel');
  };
  const buka = () => {
    if (!hasil.ok) return;
    catatUnduhanPengawas(aktor, ta_id, meta.judul, 'PDF');
    setCetak(true);
  };
  const toggle = (kunci: 'jenis_belanja' | 'jenis_pajak', v: string) => {
    const cur = f[kunci] ?? [];
    setF({ ...f, [kunci]: cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v] });
  };

  if (boleh.length === 0) return <ErrorLine msg="Peran Anda tidak memiliki akses laporan." />;
  const jenisBelanja = repo.jenisBelanjaList();
  const jenisPajak = repo.masterJenisPajak();

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <SectionTitle title="Laporan" desc={`TA ${ta.tahun} • hanya SPJ Dibukukan (BKU tercatat)`} />
        <div className="flex flex-wrap gap-2">
          {DAFTAR_LAPORAN.filter((l) => boleh.includes(l.id)).map((l) => (
            <button key={l.id} onClick={() => { setId(l.id); setF({}); }}
              className={`rounded-md border px-3 py-1.5 text-2xs ${id === l.id ? 'border-amber text-amber' : 'border-ink-edge text-mist-dim hover:text-mist'}`}>
              ({l.id}) {l.judul}
            </button>
          ))}
        </div>
        <p className="mt-3 text-2xs text-mist-dim">{meta.deskripsi}</p>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-edge px-4 py-3">
          <h3 className="text-sm font-semibold text-mist">{meta.judul}</h3>
          <div className="flex flex-wrap items-center gap-2">
            {aktor.peran !== 'pptk' && (
              <FilterSelect value={f.seksi_ta_id ?? ''} onChange={(v) => setF({ ...f, seksi_ta_id: v || undefined })} label="Seksi"
                options={seksiList.map((x) => ({ value: x.id, label: x.nama_snapshot }))} />
            )}
            {id === 'g' && (
              <FilterSelect value={f.pemetaan_id ?? ''} onChange={(v) => setF({ ...f, pemetaan_id: v || undefined })} label="Subkegiatan"
                options={pemetaan.map((x) => ({ value: x.id, label: `${x.kode_snapshot} ${x.nama_snapshot}` }))} />
            )}
            {['b', 'c', 'e', 'f', 'g'].includes(id) && (
              <>
                <label className="flex items-center gap-1 text-2xs text-mist-dim">Dari
                  <input type="date" value={f.dari ?? ''} onChange={(e) => setF({ ...f, dari: e.target.value || undefined })} className="rounded-md border border-ink-edge bg-ink px-2 py-1 text-2xs text-mist" /></label>
                <label className="flex items-center gap-1 text-2xs text-mist-dim">Sampai
                  <input type="date" value={f.sampai ?? ''} onChange={(e) => setF({ ...f, sampai: e.target.value || undefined })} className="rounded-md border border-ink-edge bg-ink px-2 py-1 text-2xs text-mist" /></label>
              </>
            )}
            <Button variant="ghost" onClick={() => setF({})}>Reset</Button>
          </div>
        </div>
        {id === 'e' && (
          <div className="flex flex-wrap gap-3 border-b border-ink-edge px-4 py-2 text-2xs text-mist-dim">
            <span>Jenis belanja:</span>
            {jenisBelanja.map((j) => <label key={j} className="flex items-center gap-1"><input type="checkbox" checked={(f.jenis_belanja ?? []).includes(j)} onChange={() => toggle('jenis_belanja', j)} /> {j}</label>)}
          </div>
        )}
        {id === 'f' && (
          <div className="flex flex-wrap gap-3 border-b border-ink-edge px-4 py-2 text-2xs text-mist-dim">
            <span>Jenis pajak:</span>
            {jenisPajak.map((j) => <label key={j.id} className="flex items-center gap-1"><input type="checkbox" checked={(f.jenis_pajak ?? []).includes(j.id)} onChange={() => toggle('jenis_pajak', j.id)} /> {j.nama_jenis_pajak}</label>)}
          </div>
        )}
        <div className="flex flex-wrap justify-end gap-2 border-b border-ink-edge px-4 py-2">
          <Button variant="secondary" onClick={unduh} disabled={!hasil.ok}><FileDown size={14} /> Unduh Excel</Button>
          <Button variant="secondary" onClick={buka} disabled={!hasil.ok}><FileDown size={14} /> Cetak / PDF</Button>
        </div>
        {hasil.ok ? <TabelLaporan laporan={hasil.data} /> : <div className="p-4"><ErrorLine msg={hasil.error} /></div>}
      </Card>

      {aktor.peran !== 'pengawas' && <LampiranSPJPanel ta_id={ta_id} />}
      {cetak && hasil.ok && <LaporanCetakModal laporan={hasil.data} onClose={() => setCetak(false)} />}
    </div>
  );
}

// SPJ-08 — unduh lampiran PDF SPJ; hak dicek ulang di repo.unduhLampiranSPJ
function LampiranSPJPanel({ ta_id }: { ta_id: string }) {
  const s = getSession()!;
  const toast = useToast();
  const kuitansi = repo.kuitansiByTA(ta_id);
  const daftar = repo.spjByTA(ta_id).filter((x) => {
    if (!x.lampiran_nama_asli) return false;
    const k = kuitansi.find((q) => q.id === x.kuitansi_id);
    return s.active_role !== 'pptk' || k?.seksi_ta_id === s.active_seksi_id;
  });
  const unduh = (spj_id: string) => {
    const r = repo.unduhLampiranSPJ(spj_id, s);
    if (!r.ok) { toast.notify(r.error ?? 'Gagal'); return; }
    if (!unduhBerkasSesi(spj_id, r.nama!)) toast.notify('Isi berkas hanya tersedia pada sesi unggah. Penyimpanan permanen menunggu backend.');
  };
  return (
    <Card>
      <div className="border-b border-ink-edge px-4 py-3"><h3 className="text-sm font-semibold text-mist">Lampiran PDF SPJ</h3></div>
      {daftar.length === 0 ? <EmptyState icon={<Paperclip size={28} />} title="Belum ada lampiran SPJ" /> : (
        <div className="overflow-x-auto">
          <table className="w-full text-2xs">
            <thead className="bg-ink text-mist-dim"><tr className="text-left">{['Seksi', 'Kuitansi', 'Status SPJ', 'Berkas', 'Aksi'].map((c) => <th key={c} className="px-4 py-2 font-medium whitespace-nowrap">{c}</th>)}</tr></thead>
            <tbody>{daftar.map((x, i) => {
              const k = kuitansi.find((q) => q.id === x.kuitansi_id);
              return (
                <tr key={x.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                  <td className="px-4 py-2 text-mist-dim">{k ? repo.seksiTAById(k.seksi_ta_id)?.nama_snapshot : '—'}</td>
                  <td className="px-4 py-2 text-mist">{k?.uraian} <span className="text-mist-dim">({formatRupiah(k?.bruto ?? 0)})</span></td>
                  <td className="px-4 py-2"><StatusBadge kind="neutral" label={x.status} /></td>
                  <td className="px-4 py-2 text-mist-dim">{x.lampiran_nama_asli}{adaBerkasSesi(x.id) ? '' : ' (isi tidak tersedia pada sesi ini)'}</td>
                  <td className="px-4 py-2"><Button variant="secondary" onClick={() => unduh(x.id)}>Unduh</Button></td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
