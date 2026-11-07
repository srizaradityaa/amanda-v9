// VER-01 / VER-02 — Pemeriksaan SPJ oleh Verifikator: setujui atau kembalikan dengan catatan.
// Larangan verifikasi mandiri ditegakkan di repo (setujuiSPJ / kembalikanSPJ).
import { useState } from 'react';
import { Button, Card, EmptyState, FilterSelect, Modal, SearchBox, StatusBadge, useToast } from '@/components/ui';
import { ErrorLine, SectionTitle } from '@/components/AnggaranShared';
import { CetakVerifikasiModal } from '@/components/CetakVerifikasi';
import { repo } from '@/data/repo';
import { getSession } from '@/lib/auth';
import { formatRupiah } from '@/lib/format';
import { formatTanggalPendek } from '@/lib/wita';
import { adaBerkasSesi, bukaBerkasSesi } from '@/lib/berkas';
import type { SPJ } from '@/data/types';
import { Check, Printer, ScrollText, Undo2 } from 'lucide-react';

function StatusSPJBadge({ status }: { status: SPJ['status'] }) {
  const kind = status === 'Draft' ? 'neutral' : status === 'Terkunci' ? 'warn' : status === 'Menunggu BKU' ? 'spike' : 'ok';
  return <StatusBadge kind={kind} label={status} />;
}

export function VerifikasiPage() {
  const s = getSession()!;
  const ta_id = s.active_ta_id!;
  const ta = repo.tahunAnggaranById(ta_id)!;
  const [, setTick] = useState(0);
  const [search, setSearch] = useState('');
  const [fStatus, setFStatus] = useState('Terkunci');
  const [fSeksi, setFSeksi] = useState('');
  const [aktif, setAktif] = useState<string | null>(null);

  const seksiList = repo.seksiTAByTA(ta_id);
  const kuitansi = repo.kuitansiByTA(ta_id);
  const semua = repo.spjByTA(ta_id).filter((x) => x.status !== 'Draft' || x.catatan_revisi);
  const daftar = semua.filter((x) => {
    const k = kuitansi.find((q) => q.id === x.kuitansi_id);
    if (!k) return false;
    if (fStatus === 'Dikembalikan') { if (!(x.status === 'Draft' && x.catatan_revisi)) return false; }
    else if (fStatus && x.status !== fStatus) return false;
    if (fSeksi && k.seksi_ta_id !== fSeksi) return false;
    if (search) {
      const q = search.toLowerCase();
      if (![k.uraian, k.penerima, x.jenis_belanja, x.id].some((t) => t.toLowerCase().includes(q))) return false;
    }
    return true;
  });
  const spjAktif = aktif ? repo.spjById(aktif) : undefined;

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <SectionTitle title="Verifikasi SPJ" desc={`TA ${ta.tahun} • seluruh seksi`} />
        <div className="flex flex-wrap items-center gap-4 text-sm text-mist">
          <span>Antrean Terkunci: <span className="mono tnum">{semua.filter((x) => x.status === 'Terkunci').length}</span></span>
          <span>Disetujui: <span className="mono tnum">{semua.filter((x) => x.status === 'Menunggu BKU' || x.status === 'Dibukukan').length}</span></span>
          <span>Dikembalikan: <span className="mono tnum">{semua.filter((x) => x.status === 'Draft' && x.catatan_revisi).length}</span></span>
        </div>
      </Card>
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-edge px-4 py-3">
          <h3 className="text-sm font-semibold text-mist">Daftar SPJ</h3>
          <div className="flex flex-wrap items-center gap-2">
            <SearchBox value={search} onChange={setSearch} placeholder="Cari uraian/penerima..." />
            <FilterSelect value={fStatus} onChange={setFStatus} label="Status" options={[
              { value: 'Terkunci', label: 'Terkunci (antrean)' }, { value: 'Menunggu BKU', label: 'Menunggu BKU' },
              { value: 'Dibukukan', label: 'Dibukukan' }, { value: 'Dikembalikan', label: 'Dikembalikan' },
            ]} />
            <FilterSelect value={fSeksi} onChange={setFSeksi} label="Seksi" options={seksiList.map((x) => ({ value: x.id, label: x.nama_snapshot }))} />
            <Button variant="ghost" onClick={() => { setSearch(''); setFStatus(''); setFSeksi(''); }}>Reset</Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          {daftar.length === 0 ? <EmptyState icon={<ScrollText size={28} />} title="Tidak ada SPJ pada filter ini" /> : (
            <table className="w-full text-2xs">
              <thead className="bg-ink text-mist-dim"><tr className="text-left">
                {['Seksi', 'Kuitansi', 'Jenis Belanja', 'Status', 'Aksi'].map((c) => <th key={c} className="px-4 py-2 font-medium whitespace-nowrap">{c}</th>)}
              </tr></thead>
              <tbody>
                {daftar.map((x, i) => {
                  const k = kuitansi.find((q) => q.id === x.kuitansi_id)!;
                  const seksi = seksiList.find((q) => q.id === k.seksi_ta_id);
                  return (
                    <tr key={x.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                      <td className="px-4 py-2 text-mist">{seksi?.nama_snapshot ?? '—'}</td>
                      <td className="px-4 py-2 text-mist"><div>{k.uraian}</div><div className="text-mist-dim">{formatTanggalPendek(k.tanggal_kuitansi)} • {formatRupiah(k.bruto)}</div></td>
                      <td className="px-4 py-2 text-mist-dim">{x.jenis_belanja}</td>
                      <td className="px-4 py-2"><StatusSPJBadge status={x.status} /></td>
                      <td className="px-4 py-2"><Button variant="secondary" onClick={() => setAktif(x.id)}>Periksa</Button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </Card>
      {spjAktif && <DetailVerifikasi spj={spjAktif} onClose={() => { setAktif(null); setTick((n) => n + 1); }} />}
    </div>
  );
}

function DetailVerifikasi({ spj, onClose }: { spj: SPJ; onClose: () => void }) {
  const sesi = getSession()!;
  const toast = useToast();
  const [err, setErr] = useState<string | null>(null);
  const [, setTick] = useState(0);
  const [konfirmSetuju, setKonfirmSetuju] = useState(false);
  const [kembali, setKembali] = useState(false);
  const [catatan, setCatatan] = useState('');
  const [cetak, setCetak] = useState(false);
  const k = repo.kuitansiByTA(spj.ta_id).find((q) => q.id === spj.kuitansi_id);
  const seksi = k ? repo.seksiTAById(k.seksi_ta_id) : undefined;
  const form = repo.getFormByVersion(spj.jenis_belanja, spj.versi_form);
  const rp = repo.ringkasanPajakSPJ(spj.id);
  const tk = repo.tokenAktifSPJ(spj.id);
  const jenisPajak = repo.masterJenisPajak();
  const bku = repo.bkuByTA(spj.ta_id).find((b) => b.spj_id === spj.id && b.status === 'Aktif');

  const setujui = () => {
    const r = repo.setujuiSPJ(spj.id, sesi);
    setKonfirmSetuju(false);
    if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
    setErr(null); toast.notify(`Disetujui • ${r.nomor}`); setTick((n) => n + 1);
  };
  const kembalikan = () => {
    const r = repo.kembalikanSPJ(spj.id, catatan, sesi);
    if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
    setErr(null); setKembali(false); setCatatan(''); toast.notify('SPJ dikembalikan'); setTick((n) => n + 1);
  };

  const nilai = (id: string) => {
    const v = spj.jawaban[id];
    return typeof v === 'string' && v ? v : '—';
  };
  const blok = form?.blok_berulang;
  const baris = blok && Array.isArray(spj.jawaban[blok.id]) ? (spj.jawaban[blok.id] as Record<string, string>[]) : [];
  const bisaPeriksa = spj.status === 'Terkunci';
  const bisaKembalikan = spj.status === 'Terkunci' || spj.status === 'Menunggu BKU';
  const bisaCetak = spj.status === 'Menunggu BKU' || spj.status === 'Dibukukan';

  return (
    <>
      <Modal open onClose={onClose} title={`Periksa SPJ — ${spj.jenis_belanja}`} wider
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0 flex-1"><ErrorLine msg={err} /></div>
            <div className="flex flex-wrap gap-2">
              {bisaCetak && <Button variant="secondary" onClick={() => setCetak(true)}><Printer size={14} /> Cetak Hasil Verifikasi</Button>}
              {bisaKembalikan && <Button variant="danger" onClick={() => { setKembali(true); setErr(null); }}><Undo2 size={14} /> Kembalikan</Button>}
              {bisaPeriksa && <Button onClick={() => setKonfirmSetuju(true)}><Check size={14} /> Setujui</Button>}
            </div>
          </div>
        }>
        <div className="space-y-4 text-2xs text-mist-dim">
          {k && (
            <div className="rounded-md border border-ink-edge bg-ink p-3">
              <div>Seksi: <span className="text-mist">{seksi?.nama_snapshot}</span></div>
              <div>Kuitansi: <span className="text-mist">{k.uraian}</span> • {formatTanggalPendek(k.tanggal_kuitansi)}</div>
              <div>Penerima: <span className="text-mist">{k.penerima}</span></div>
              <div>Bruto: <span className="mono tnum text-mist">{formatRupiah(k.bruto)}</span></div>
              <div>Status: <StatusSPJBadge status={spj.status} />{spj.tanggal_pengajuan && <span> • diajukan {formatTanggalPendek(spj.tanggal_pengajuan)}</span>}</div>
              {spj.penandatangan_pengajuan && <div>PPTK pengaju: <span className="text-mist">{spj.penandatangan_pengajuan.pptk_nama}</span></div>}
              {spj.catatan_revisi && <div className="mt-1 text-warn">Catatan revisi sebelumnya: {spj.catatan_revisi}</div>}
              {tk && <div>Nomor verifikasi: <span className="mono text-mist">{tk.nomor_verifikasi}</span> • <span className={tk.status === 'Berlaku' ? 'text-ok' : 'text-crit'}>{tk.status}</span></div>}
              {bku && <div className="text-warn">BKU aktif {bku.nomor_bku}. Bendahara harus mencabut BKU sebelum SPJ dapat dikembalikan.</div>}
            </div>
          )}
          <div>
            <h4 className="mb-1 text-sm font-semibold text-mist">Isian Form ({spj.versi_form})</h4>
            {form ? (
              <div className="space-y-1">
                {form.fields.map((f) => <div key={f.id}>{f.label}: <span className="text-mist">{nilai(f.id)}</span></div>)}
                {blok && baris.length > 0 && (
                  <div className="mt-2 overflow-x-auto">
                    <div className="mb-1 text-mist">{blok.nama}</div>
                    <table className="w-full"><thead><tr className="text-left">{blok.fields.map((f) => <th key={f.id} className="px-2 py-1 font-medium">{f.label}</th>)}</tr></thead>
                      <tbody>{baris.map((r, i) => <tr key={i}>{blok.fields.map((f) => <td key={f.id} className="px-2 py-1 text-mist">{r[f.id] || '—'}</td>)}</tr>)}</tbody></table>
                  </div>
                )}
              </div>
            ) : <p>Form versi {spj.versi_form} tidak ditemukan.</p>}
          </div>
          <div>
            <h4 className="mb-1 text-sm font-semibold text-mist">Pajak</h4>
            {spj.entri_pajak.length === 0 ? <p>Tidak ada entri pajak.</p> : spj.entri_pajak.map((e) => (
              <div key={e.id}>{jenisPajak.find((j) => j.id === e.jenis_pajak_id)?.nama_jenis_pajak ?? '—'}: <span className="mono tnum text-mist">{formatRupiah(e.nominal)}</span></div>
            ))}
            <div>Total Pajak: <span className="mono tnum text-mist">{formatRupiah(rp?.total ?? 0)}</span> • Jumlah dibayarkan: <span className="mono tnum text-mist">{formatRupiah(rp?.dibayarkan ?? 0)}</span></div>
          </div>
          <div>
            <h4 className="mb-1 text-sm font-semibold text-mist">Rekening Penerima</h4>
            {spj.rekening_penerima.length === 0 ? <p>Belum ada rekening.</p> : spj.rekening_penerima.map((r) => (
              <div key={r.id}>{r.account_name} • {r.bank_name} • <span className="mono text-mist">{r.account_number}</span>{r.alias ? ` • ${r.alias}` : ''}</div>
            ))}
          </div>
          <div>
            <h4 className="mb-1 text-sm font-semibold text-mist">Lampiran PDF</h4>
            {spj.lampiran_nama_asli ? (
              <div className="flex items-center gap-2">
                <span className="text-mist">{spj.lampiran_nama_asli}</span>
                {adaBerkasSesi(spj.id) ? <button className="text-teal hover:underline" onClick={() => bukaBerkasSesi(spj.id)}>Buka</button> : <span>(isi berkas hanya tersedia pada sesi unggah; penyimpanan permanen menunggu backend)</span>}
              </div>
            ) : <p>Belum ada lampiran.</p>}
          </div>
        </div>
      </Modal>
      <Modal open={konfirmSetuju} onClose={() => setKonfirmSetuju(false)} title="Setujui SPJ?"
        footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setKonfirmSetuju(false)}>Batal</Button><Button onClick={setujui}>Ya, setujui</Button></div>}>
        <p className="text-sm text-mist">SPJ akan berstatus Menunggu BKU. Nomor dan token verifikasi dibuat otomatis.</p>
      </Modal>
      <Modal open={kembali} onClose={() => setKembali(false)} title="Kembalikan SPJ ke Seksi"
        footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setKembali(false)}>Batal</Button><Button variant="danger" onClick={kembalikan}>Kembalikan</Button></div>}>
        <label className="block text-2xs text-mist-dim">Catatan revisi (wajib)
          <textarea value={catatan} onChange={(e) => setCatatan(e.target.value)} rows={4}
            className="mt-1 w-full rounded-md border border-ink-edge bg-ink p-2 text-sm text-mist focus-visible:outline-amber focus-visible:outline-2" />
        </label>
        <p className="mt-2 text-2xs text-mist-dim">SPJ menjadi Draft. Kuitansi tetap Terkunci dan komitmen SPD tidak dilepas.</p>
        <ErrorLine msg={err} />
      </Modal>
      {cetak && <CetakVerifikasiModal spj_id={spj.id} onClose={() => setCetak(false)} />}
    </>
  );
}
