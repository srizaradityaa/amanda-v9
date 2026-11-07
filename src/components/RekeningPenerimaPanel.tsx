// REK-01/REK-02 — Split View rekening penerima pada SPJ (D02 §5, D03 §13, D01 §14)
import { useState, type Dispatch, type SetStateAction } from 'react';
import { Button, Field, Input, SearchBox, EmptyState, useToast } from '@/components/ui';
import { ErrorLine } from '@/components/AnggaranShared';
import { repo } from '@/data/repo';
import type { SPJ, SessionPayload } from '@/data/types';
import { Plus, Save, Trash2 } from 'lucide-react';

export type BarisRekening = { key: number; account_name: string; bank_name: string; account_number: string; alias: string };
type Baris = BarisRekening;

// Baris awal dari snapshot rekening pada SPJ.
export function barisDariSPJ(spj: SPJ): BarisRekening[] {
  return (spj.rekening_penerima ?? []).map((r, i) => ({ key: i, account_name: r.account_name, bank_name: r.bank_name, account_number: r.account_number, alias: r.alias ?? '' }));
}

// State baris dipegang oleh induk (EditSPJModal) agar isian tidak hilang saat berpindah tab
// dan ikut tersimpan ketika "Simpan Draft" atau "Ajukan" ditekan.
export function RekeningPenerimaPanel({ sesi, spj, isDraft, baris, setBaris }: {
  sesi: SessionPayload; spj: SPJ; isDraft: boolean;
  baris: BarisRekening[]; setBaris: Dispatch<SetStateAction<BarisRekening[]>>;
}) {
  const { notify } = useToast();
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState('');
  const hasilCari = repo.cariRekeningBank(q);

  const tambahBaris = (isi: Omit<Baris, 'key'>) => {
    setBaris((b) => [...b, { key: b.reduce((m, x) => Math.max(m, x.key), -1) + 1, ...isi }]);
  };
  const ubahBaris = (key: number, patch: Partial<Omit<Baris, 'key'>>) =>
    setBaris((b) => b.map((r) => (r.key === key ? { ...r, ...patch } : r)));
  const hapusBaris = (key: number) => setBaris((b) => b.filter((r) => r.key !== key));

  const simpan = () => {
    setErr(null);
    const r = repo.simpanRekeningSPJ(spj.id, baris, sesi);
    if (!r.ok) { setErr(r.error ?? 'Gagal'); return; }
    notify('Tersimpan');
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <div className="min-w-0 rounded-md border border-ink-edge bg-ink p-3">
        <h4 className="mb-2 text-sm font-semibold text-mist">Direktori Rekening Bank</h4>
        <SearchBox value={q} onChange={setQ} placeholder="Cari nama, alias, atau no. rekening..." />
        <div className="mt-3 max-h-96 space-y-2 overflow-y-auto">
          {hasilCari.length === 0 ? (
            <EmptyState title="Tidak ada rekening yang cocok" desc="Isi rincian secara manual pada panel kanan." />
          ) : hasilCari.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-2 rounded-md border border-ink-edge bg-ink-surface p-3">
              <div className="min-w-0 text-2xs">
                <div className="truncate text-mist">{d.account_name}</div>
                <div className="truncate text-mist-dim">{d.alias ? `${d.alias} • ` : ''}{d.bank_name} • <span className="mono">{d.account_number}</span></div>
              </div>
              <Button variant="secondary" disabled={!isDraft}
                onClick={() => tambahBaris({ account_name: d.account_name, bank_name: d.bank_name, account_number: d.account_number, alias: d.alias ?? '' })}>
                Pilih
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="min-w-0 space-y-3">
        <h4 className="text-sm font-semibold text-mist">Rincian Penerima / Rekening</h4>
        {baris.length === 0 && <p className="text-2xs text-mist-dim">Belum ada rekening penerima. Opsional untuk SPJ ini.</p>}
        {baris.map((r, idx) => (
          <div key={r.key} className="rounded-md border border-ink-edge bg-ink p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-2xs text-mist-dim">Rekening {idx + 1}</span>
              {isDraft && (
                <button onClick={() => hapusBaris(r.key)} className="text-mist-dim hover:text-crit" title="Hapus baris">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nama Penerima" required>
                <Input value={r.account_name} disabled={!isDraft} onChange={(e) => ubahBaris(r.key, { account_name: e.target.value })} />
              </Field>
              <Field label="Nama Bank" required>
                <Input value={r.bank_name} disabled={!isDraft} onChange={(e) => ubahBaris(r.key, { bank_name: e.target.value })} />
              </Field>
              <Field label="Nomor Rekening" required>
                <Input value={r.account_number} disabled={!isDraft} onChange={(e) => ubahBaris(r.key, { account_number: e.target.value })} />
              </Field>
              <Field label="Alias / Instansi">
                <Input value={r.alias} disabled={!isDraft} onChange={(e) => ubahBaris(r.key, { alias: e.target.value })} />
              </Field>
            </div>
          </div>
        ))}
        {isDraft && (
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Button variant="secondary" onClick={() => tambahBaris({ account_name: '', bank_name: '', account_number: '', alias: '' })}>
              <Plus size={14} /> Tambah Baris
            </Button>
            <Button variant="primary" onClick={simpan}><Save size={14} /> Simpan Rekening</Button>
          </div>
        )}
        <ErrorLine msg={err} />
        {!isDraft && <p className="text-2xs text-mist-dim">Rekening SPJ {spj.status} tidak dapat diubah.</p>}
      </div>
    </div>
  );
}
