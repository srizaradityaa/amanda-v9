// REK-05 — Admin kelola Direktori Rekening Bank (D03 §13 poin 3, D01 §14 poin 6, D04 §2.5).
// Admin melihat seluruh rekening global lintas seksi, mengoreksi ejaan, dan menggabungkan duplikat.
// Aksi Admin hanya memengaruhi pencarian ke depan; snapshot rekening pada SPJ tidak berubah (O-114).
import { useState } from 'react';
import { Button, Card, EmptyState, Field, Input, Modal, SearchBox, TableHead, useToast } from '@/components/ui';
import { repo } from '@/data/repo';
import { getSession } from '@/lib/auth';
import type { DirektoriRekeningBank } from '@/data/types';
import { Landmark, Merge, Pencil } from 'lucide-react';

export function DirektoriRekeningPage() {
  const [list, setList] = useState<DirektoriRekeningBank[]>(() => [...repo.rekeningBankDirektori()]);
  const [q, setQ] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [gabung, setGabung] = useState<{ keepId: string; dropId: string } | null>(null);
  const [keepId, setKeepId] = useState('');
  const [dropId, setDropId] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const { notify } = useToast();
  const refresh = () => setList([...repo.rekeningBankDirektori()]);

  const k = q.trim().toLowerCase();
  const tampil = list.filter((r) => !k || `${r.account_name} ${r.alias ?? ''} ${r.bank_name} ${r.account_number}`.toLowerCase().includes(k));

  const konfirmasiGabung = () => {
    const sesi = getSession();
    if (!sesi || !gabung) return;
    const r = repo.mergeRekeningBank(gabung.keepId, gabung.dropId, sesi);
    if (!r.ok) { setErr(r.error ?? 'Gagal'); setGabung(null); return; }
    setErr(null); setGabung(null); setKeepId(''); setDropId('');
    refresh(); notify('Tersimpan');
  };

  const label = (r: DirektoriRekeningBank) => `${r.account_name} — ${r.bank_name} ${r.account_number}`;
  const siapGabung = !!keepId && !!dropId && keepId !== dropId;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-mist">Direktori Rekening Bank</h2>
        <p className="mt-0.5 text-2xs text-mist-dim">
          Rekening yang dihimpun otomatis dari pengisian SPJ, global lintas seksi. Koreksi dan penggabungan hanya memengaruhi pencarian ke depan; rekening pada SPJ yang sudah tersimpan tidak berubah.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <SearchBox value={q} onChange={setQ} placeholder="Cari nama, alias, bank, atau no. rekening..." />
        <Button variant="ghost" onClick={() => setQ('')}>Reset</Button>
      </div>
      {err && <p className="text-2xs text-crit">{err}</p>}
      <Card className="overflow-x-auto">
        <table className="w-full text-2xs">
          <TableHead columns={['Nama Penerima', 'Bank', 'No. Rekening', 'Alias / Instansi', 'Dibuat', 'Aksi']} />
          <tbody>
            {tampil.map((r, i) => (
              <tr key={r.id} className={i % 2 ? 'bg-ink-surface/40' : ''}>
                <td className="std-row px-4 text-mist">{r.account_name}</td>
                <td className="std-row px-4 text-mist">{r.bank_name}</td>
                <td className="std-row px-4 mono text-mist">{r.account_number}</td>
                <td className="std-row px-4 text-mist-dim">{r.alias ?? '—'}</td>
                <td className="std-row px-4 text-mist-dim whitespace-nowrap">{r.created_at}</td>
                <td className="std-row px-4">
                  <button onClick={() => setEditId(r.id)} className="rounded p-1 text-mist-dim hover:text-mist" title="Koreksi"><Pencil size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tampil.length === 0 && <EmptyState icon={<Landmark size={28} />} title="Tidak ada rekening di direktori" />}
      </Card>

      {list.length >= 2 && (
        <Card className="space-y-3 p-4">
          <h3 className="text-sm font-semibold text-mist">Gabungkan entri duplikat</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Entri yang dipertahankan">
              <select value={keepId} onChange={(e) => setKeepId(e.target.value)} className="w-full rounded-md border border-ink-edge bg-ink px-3 py-2 text-mist">
                <option value="">Pilih entri...</option>
                {list.map((r) => <option key={r.id} value={r.id}>{label(r)}</option>)}
              </select>
            </Field>
            <Field label="Entri yang digabung (dihapus dari direktori)">
              <select value={dropId} onChange={(e) => setDropId(e.target.value)} className="w-full rounded-md border border-ink-edge bg-ink px-3 py-2 text-mist">
                <option value="">Pilih entri...</option>
                {list.filter((r) => r.id !== keepId).map((r) => <option key={r.id} value={r.id}>{label(r)}</option>)}
              </select>
            </Field>
          </div>
          <Button variant="secondary" disabled={!siapGabung} onClick={() => setGabung({ keepId, dropId })}><Merge size={14} /> Gabungkan</Button>
        </Card>
      )}

      {editId && <EditRekeningModal id={editId} onClose={() => setEditId(null)} onSaved={() => { refresh(); notify('Tersimpan'); }} />}

      {gabung && (
        <Modal open onClose={() => setGabung(null)} title="Konfirmasi Penggabungan"
          footer={<div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setGabung(null)}>Batal</Button>
            <Button variant="danger" onClick={konfirmasiGabung}>Gabungkan</Button>
          </div>}>
          <p className="text-2xs text-mist-dim">
            Entri kedua dihapus dari direktori dan entri pertama dipertahankan. Rekening pada SPJ yang sudah tersimpan tidak berubah, dan tidak ada pengaruh pada BKU maupun Sisa SPD Bebas.
          </p>
        </Modal>
      )}
    </div>
  );
}

function EditRekeningModal({ id, onClose, onSaved }: { id: string; onClose: () => void; onSaved: () => void }) {
  const ada = repo.rekeningBankDirektori().find((r) => r.id === id);
  const [nama, setNama] = useState(ada?.account_name ?? '');
  const [bank, setBank] = useState(ada?.bank_name ?? '');
  const [nomor, setNomor] = useState(ada?.account_number ?? '');
  const [alias, setAlias] = useState(ada?.alias ?? '');
  const [err, setErr] = useState<string | null>(null);

  const simpan = () => {
    const sesi = getSession();
    if (!sesi) return;
    const r = repo.koreksiRekeningBank(id, { account_name: nama, bank_name: bank, account_number: nomor, alias }, sesi);
    if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
    onSaved(); onClose();
  };

  if (!ada) return null;
  return (
    <Modal open onClose={onClose} title="Koreksi Entri Direktori Rekening"
      footer={<div className="flex items-center justify-between gap-2">
        <span className="text-2xs text-crit">{err}</span>
        <div className="flex gap-2"><Button variant="ghost" onClick={onClose}>Batal</Button><Button variant="primary" onClick={simpan}>Simpan</Button></div>
      </div>}>
      <div className="space-y-4">
        <Field label="Nama Penerima" required><Input value={nama} onChange={(e) => setNama(e.target.value)} /></Field>
        <Field label="Nama Bank" required><Input value={bank} onChange={(e) => setBank(e.target.value)} /></Field>
        <Field label="Nomor Rekening" required><Input className="mono" value={nomor} onChange={(e) => setNomor(e.target.value)} /></Field>
        <Field label="Alias / Instansi"><Input value={alias} onChange={(e) => setAlias(e.target.value)} /></Field>
      </div>
    </Modal>
  );
}
