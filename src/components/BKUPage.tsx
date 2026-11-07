// BKU-01..05 — Buku Kas Umum (murni realisasi pengeluaran belanja). Bendahara mencatat/koreksi/cabut; Verifikator hanya membaca.
import { useState } from 'react';
import { Button, Card, EmptyState, Field, FilterSelect, Input, Modal, SearchBox, StatusBadge, useToast } from '@/components/ui';
import { ErrorLine, SectionTitle } from '@/components/AnggaranShared';
import { repo } from '@/data/repo';
import { getSession } from '@/lib/auth';
import { formatRupiah } from '@/lib/format';
import { formatTanggalPendek, todayWita } from '@/lib/wita';
import type { BKU, SPJ } from '@/data/types';
import { BookOpen, Pencil, Plus, Trash2 } from 'lucide-react';

export function BKUPage() {
  const s = getSession()!;
  const ta_id = s.active_ta_id!;
  const ta = repo.tahunAnggaranById(ta_id)!;
  const bendahara = s.active_role === 'bendahara';
  const [, setTick] = useState(0);
  const bump = () => setTick((n) => n + 1);
  const [search, setSearch] = useState('');
  const [fSeksi, setFSeksi] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');
  const [catat, setCatat] = useState<SPJ | null>(null);
  const [koreksi, setKoreksi] = useState<BKU | null>(null);
  const [cabut, setCabut] = useState<BKU | null>(null);

  const kuitansi = repo.kuitansiByTA(ta_id);
  const seksiList = repo.seksiTAByTA(ta_id);
  const menunggu = repo.spjByTA(ta_id).filter((x) => x.status === 'Menunggu BKU');
  const daftar = repo.bkuByTA(ta_id).filter((b) => {
    const k = kuitansi.find((q) => q.id === b.kuitansi_id);
    if (fSeksi && k?.seksi_ta_id !== fSeksi) return false;
    if (fStatus && b.status !== fStatus) return false;
    if (dari && b.tanggal_bku < dari) return false;
    if (sampai && b.tanggal_bku > sampai) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!b.nomor_bku.toLowerCase().includes(q) && !(k?.uraian ?? '').toLowerCase().includes(q)) return false;
    }
    return true;
  });
  const reset = () => { setSearch(''); setFSeksi(''); setFStatus(''); setDari(''); setSampai(''); };

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <SectionTitle title="Buku Kas Umum (BKU)" desc={`TA ${ta.tahun} • mencatat realisasi pengeluaran belanja per kuitansi/SPJ`} />
        <p className="text-2xs text-mist-dim">BKU ini tidak memuat penerimaan kas, SP2D, saldo awal, maupun saldo kas.</p>
      </Card>

      {bendahara && (
        <Card>
          <div className="border-b border-ink-edge px-4 py-3"><h3 className="text-sm font-semibold text-mist">SPJ Menunggu BKU ({menunggu.length})</h3></div>
          <div className="overflow-x-auto">
            {menunggu.length === 0 ? <EmptyState icon={<BookOpen size={28} />} title="Tidak ada SPJ yang menunggu pencatatan BKU" /> : (
              <table className="w-full text-2xs">
                <thead className="bg-ink text-mist-dim"><tr className="text-left">
                  {['Seksi', 'Kuitansi', 'Bruto', 'Aksi'].map((c) => <th key={c} className="px-4 py-2 font-medium whitespace-nowrap">{c}</th>)}
                </tr></thead>
                <tbody>{menunggu.map((x, i) => {
                  const k = kuitansi.find((q) => q.id === x.kuitansi_id);
                  return (
                    <tr key={x.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                      <td className="px-4 py-2 text-mist">{seksiList.find((q) => q.id === k?.seksi_ta_id)?.nama_snapshot}</td>
                      <td className="px-4 py-2 text-mist">{k?.uraian}</td>
                      <td className="px-4 py-2 mono tnum text-mist">{formatRupiah(k?.bruto ?? 0)}</td>
                      <td className="px-4 py-2"><Button variant="secondary" onClick={() => setCatat(x)}><Plus size={14} /> Catat BKU</Button></td>
                    </tr>
                  );
                })}</tbody>
              </table>
            )}
          </div>
        </Card>
      )}

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-edge px-4 py-3">
          <h3 className="text-sm font-semibold text-mist">Daftar BKU</h3>
          <div className="flex flex-wrap items-center gap-2">
            <SearchBox value={search} onChange={setSearch} placeholder="Cari No. BKU/uraian..." />
            <FilterSelect value={fSeksi} onChange={setFSeksi} label="Seksi" options={seksiList.map((x) => ({ value: x.id, label: x.nama_snapshot }))} />
            <FilterSelect value={fStatus} onChange={setFStatus} label="Status" options={[{ value: 'Aktif', label: 'Aktif' }, { value: 'Dicabut', label: 'Dicabut' }]} />
            <label className="flex items-center gap-1 text-2xs text-mist-dim">Dari
              <input type="date" value={dari} onChange={(e) => setDari(e.target.value)} className="rounded-md border border-ink-edge bg-ink px-2 py-1 text-2xs text-mist" /></label>
            <label className="flex items-center gap-1 text-2xs text-mist-dim">Sampai
              <input type="date" value={sampai} onChange={(e) => setSampai(e.target.value)} className="rounded-md border border-ink-edge bg-ink px-2 py-1 text-2xs text-mist" /></label>
            <Button variant="ghost" onClick={reset}>Reset</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {daftar.length === 0 ? <EmptyState icon={<BookOpen size={28} />} title="Belum ada BKU pada filter ini" /> : (
            <table className="w-full text-2xs">
              <thead className="bg-ink text-mist-dim"><tr className="text-left">
                {['No. BKU', 'Tanggal', 'Seksi', 'Uraian', 'Bruto', 'Status', ...(bendahara ? ['Aksi'] : [])].map((c) => <th key={c} className="px-4 py-2 font-medium whitespace-nowrap">{c}</th>)}
              </tr></thead>
              <tbody>{daftar.map((b, i) => {
                const k = kuitansi.find((q) => q.id === b.kuitansi_id);
                return (
                  <tr key={b.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                    <td className="px-4 py-2 mono text-mist">{b.nomor_bku}</td>
                    <td className="px-4 py-2 text-mist-dim">{formatTanggalPendek(b.tanggal_bku)}</td>
                    <td className="px-4 py-2 text-mist-dim">{seksiList.find((q) => q.id === k?.seksi_ta_id)?.nama_snapshot ?? '—'}</td>
                    <td className="px-4 py-2 text-mist">{k?.uraian ?? '—'}</td>
                    <td className="px-4 py-2 mono tnum text-mist">{formatRupiah(k?.bruto ?? 0)}</td>
                    <td className="px-4 py-2"><StatusBadge kind={b.status === 'Aktif' ? 'ok' : 'crit'} label={b.status} /></td>
                    {bendahara && (
                      <td className="px-4 py-2">
                        {b.status === 'Aktif' && (
                          <div className="flex gap-2">
                            <Button variant="secondary" onClick={() => setKoreksi(b)}><Pencil size={14} /> Koreksi</Button>
                            <Button variant="danger" onClick={() => setCabut(b)}><Trash2 size={14} /> Cabut</Button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}</tbody>
            </table>
          )}
        </div>
      </Card>

      {catat && <FormBKU judul="Catat BKU" awal={{ nomor: '', tanggal: todayWita() }} onClose={() => setCatat(null)}
        simpan={(n, t) => repo.catatBKU(catat.id, n, t, s)} onSaved={() => { setCatat(null); bump(); }} />}
      {koreksi && <FormBKU judul={`Koreksi BKU ${koreksi.nomor_bku}`} awal={{ nomor: koreksi.nomor_bku, tanggal: koreksi.tanggal_bku }} catatan="Nominal tidak berubah. Perubahan tercatat di Jejak Audit dengan nilai lama dan baru."
        onClose={() => setKoreksi(null)} simpan={(n, t) => repo.koreksiBKU(koreksi.id, { nomor_bku: n, tanggal_bku: t }, s)} onSaved={() => { setKoreksi(null); bump(); }} />}
      {cabut && <KonfirmasiCabut bku={cabut} onClose={() => setCabut(null)} onDone={() => { setCabut(null); bump(); }} />}
    </div>
  );
}

function FormBKU({ judul, awal, catatan, onClose, simpan, onSaved }: {
  judul: string; awal: { nomor: string; tanggal: string }; catatan?: string;
  onClose: () => void; simpan: (nomor: string, tanggal: string) => { ok: boolean; error?: string }; onSaved: () => void;
}) {
  const toast = useToast();
  const [nomor, setNomor] = useState(awal.nomor);
  const [tanggal, setTanggal] = useState(awal.tanggal);
  const [err, setErr] = useState<string | null>(null);
  const kirim = () => {
    const r = simpan(nomor, tanggal);
    if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
    toast.notify('Tersimpan');
    onSaved();
  };
  return (
    <Modal open onClose={onClose} title={judul}
      footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose}>Batal</Button><Button onClick={kirim}>Simpan</Button></div>}>
      <div className="space-y-3">
        <Field label="No. BKU" required><Input value={nomor} onChange={(e) => setNomor(e.target.value)} placeholder="Contoh: BKU-002" /></Field>
        <Field label="Tanggal BKU" required><Input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)} /></Field>
        {catatan && <p className="text-2xs text-mist-dim">{catatan}</p>}
        <ErrorLine msg={err} />
      </div>
    </Modal>
  );
}

// R-149 — pop-up konfirmasi untuk aksi yang tidak dapat dibatalkan; menutup pop-up tidak mengubah data
function KonfirmasiCabut({ bku, onClose, onDone }: { bku: BKU; onClose: () => void; onDone: () => void }) {
  const s = getSession()!;
  const toast = useToast();
  const [err, setErr] = useState<string | null>(null);
  const jalankan = () => {
    const r = repo.cabutBKU(bku.id, s);
    if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
    toast.notify('BKU dicabut');
    onDone();
  };
  return (
    <Modal open onClose={onClose} title={`Cabut BKU ${bku.nomor_bku}?`}
      footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose}>Batal</Button><Button variant="danger" onClick={jalankan}>Ya, cabut BKU</Button></div>}>
      <p className="text-sm text-mist">Pencabutan tidak dapat dibatalkan. SPJ kembali Menunggu BKU. Untuk mengembalikan transaksi, Verifikator mengembalikan SPJ, lalu Seksi melepas SPJ dan membatalkan kuitansi.</p>
      <ErrorLine msg={err} />
    </Modal>
  );
}
