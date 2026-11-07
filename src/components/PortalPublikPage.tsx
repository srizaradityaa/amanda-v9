// PUB-01..05, PUB-07 — Portal Keterbukaan Informasi Publik (anonim, baca saja).
// Hanya memakai agregat aman dari data/publik.ts: persentase, cacah, nama seksi, peringkat. Tidak ada nominal rupiah.
import { useCallback, useEffect, useState } from 'react';
import { daftarTAPublik, ringkasanPublik, type KodeKategori, type RingkasanPublik } from '@/data/publik';
import { AlertTriangle, ArrowLeft, CheckCircle2, Clock, Landmark, Maximize2, Minimize2, Pencil } from 'lucide-react';

const SEGAR_MS = 20 * 60 * 1000; // refresh halus 20 menit (rentang 15–30 menit)

const persenTeks = (n: number | null) => (n === null ? 'Belum tersedia' : `${n.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`);

const GAYA: Record<KodeKategori, { warna: string; ikon: JSX.Element }> = {
  selesai: { warna: '#34D399', ikon: <CheckCircle2 size={16} aria-hidden /> },
  verifikasi: { warna: '#F59E0B', ikon: <Clock size={16} aria-hidden /> },
  perbaikan: { warna: '#FB923C', ikon: <AlertTriangle size={16} aria-hidden /> },
  draf: { warna: '#9CA3AF', ikon: <Pencil size={16} aria-hidden /> },
};

function Donut({ r }: { r: RingkasanPublik }) {
  const R = 52, K = 2 * Math.PI * R;
  let geser = 0;
  const label = `Distribusi status SPJ: ${r.kategori.map((k) => `${k.label} ${k.cacah}`).join(', ')}. Total ${r.total_spj} SPJ.`;
  return (
    <svg viewBox="0 0 140 140" className="mx-auto h-44 w-44 md:h-52 md:w-52" role="img" aria-label={label}>
      <circle cx="70" cy="70" r={R} fill="none" stroke="#1F2937" strokeWidth="18" />
      {r.total_spj > 0 && r.kategori.map((k) => {
        const panjang = (k.cacah / r.total_spj) * K;
        const el = k.cacah > 0 && (
          <circle key={k.kode} cx="70" cy="70" r={R} fill="none" stroke={GAYA[k.kode].warna} strokeWidth="18"
            strokeDasharray={`${panjang} ${K - panjang}`} strokeDashoffset={-geser} transform="rotate(-90 70 70)" />
        );
        geser += panjang;
        return el;
      })}
      <text x="70" y="66" textAnchor="middle" fill="#E5E7EB" fontSize="20" fontFamily="JetBrains Mono, monospace" fontWeight="700">{r.total_spj}</text>
      <text x="70" y="84" textAnchor="middle" fill="#9CA3AF" fontSize="10">SPJ</text>
    </svg>
  );
}

function Gauge({ persen, label }: { persen: number | null; label: string }) {
  const R = 70, K = Math.PI * R;
  const isi = persen === null ? 0 : Math.min(100, Math.max(0, persen)) / 100;
  return (
    <svg viewBox="0 0 180 110" className="mx-auto h-40 w-full max-w-xs md:h-48" role="img" aria-label={`Realisasi ${label}: ${persenTeks(persen)}`}>
      <path d="M 20 90 A 70 70 0 0 1 160 90" fill="none" stroke="#1F2937" strokeWidth="16" strokeLinecap="round" />
      <path d="M 20 90 A 70 70 0 0 1 160 90" fill="none" stroke="#F59E0B" strokeWidth="16" strokeLinecap="round" strokeDasharray={`${K * isi} ${K}`} />
      <text x="90" y="82" textAnchor="middle" fill="#E5E7EB" fontSize={persen === null ? 13 : 24} fontFamily="JetBrains Mono, monospace" fontWeight="700">{persenTeks(persen)}</text>
      <text x="90" y="104" textAnchor="middle" fill="#9CA3AF" fontSize="10">{label}</text>
    </svg>
  );
}

export function PortalPublikPage({ onBack }: { onBack: () => void }) {
  const daftar = daftarTAPublik();
  const [taId, setTaId] = useState(daftar.find((t) => t.bawaan)?.id ?? daftar[0]?.id ?? '');
  const [r, setR] = useState<RingkasanPublik | null>(() => (taId ? ringkasanPublik(taId) : null));
  const [layarPenuh, setLayarPenuh] = useState(false);

  const segarkan = useCallback(() => { setR(taId ? ringkasanPublik(taId) : null); }, [taId]);
  useEffect(() => { segarkan(); const t = setInterval(segarkan, SEGAR_MS); return () => clearInterval(t); }, [segarkan]);

  const alih = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen?.();
    else void document.documentElement.requestFullscreen?.();
  }, []);
  useEffect(() => {
    const ubah = () => setLayarPenuh(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', ubah);
    return () => document.removeEventListener('fullscreenchange', ubah);
  }, []);
  // Pintasan F tidak mengganggu pengetikan pada kolom isian
  useEffect(() => {
    const tekan = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'f' || e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName) || t.isContentEditable)) return;
      alih();
    };
    window.addEventListener('keydown', tekan);
    return () => window.removeEventListener('keydown', tekan);
  }, [alih]);

  const besar = layarPenuh ? 'text-base md:text-xl' : 'text-sm';
  const fokus = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber';

  return (
    <div className={`min-h-screen bg-ink text-mist ${besar}`} data-portal-publik>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-edge bg-ink-surface px-4 py-3 md:px-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md border border-ink-edge bg-ink"><Landmark size={18} className="text-amber" aria-hidden /></div>
          <div>
            <h1 className="font-bold leading-tight">AMANDA — Portal Keterbukaan</h1>
            <p className="text-2xs text-mist-dim">Pemerintah Kabupaten Balangan • akses anonim, baca saja</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-2 text-2xs text-mist-dim">Tahun Anggaran
            <select value={taId} onChange={(e) => setTaId(e.target.value)} className={`rounded-md border border-ink-edge bg-ink px-2 py-1.5 text-mist ${fokus}`}>
              {daftar.map((t) => <option key={t.id} value={t.id}>{t.label}{t.bawaan ? ' (Aktif)' : ` (${t.status})`}</option>)}
            </select>
          </label>
          <button onClick={alih} className={`flex items-center gap-1 rounded-md border border-ink-edge px-3 py-1.5 text-2xs text-mist-dim hover:text-mist ${fokus}`} aria-label={layarPenuh ? 'Keluar layar penuh' : 'Layar penuh'} title="Layar penuh (F)">
            {layarPenuh ? <Minimize2 size={14} aria-hidden /> : <Maximize2 size={14} aria-hidden />} {layarPenuh ? 'Tutup layar penuh' : 'Layar penuh'}
          </button>
          <button onClick={onBack} className={`flex items-center gap-1 rounded-md border border-teal px-3 py-1.5 text-2xs text-teal hover:bg-ink ${fokus}`}>
            <ArrowLeft size={14} aria-hidden /> Kembali ke login
          </button>
        </div>
      </header>

      {!r ? <p className="p-6 text-mist-dim">Data TA tidak tersedia.</p> : (
        <main className="mx-auto max-w-6xl space-y-4 p-4 md:p-6">
          <section aria-label="Ringkasan" className="grid gap-3 rounded-lg border border-ink-edge bg-ink-surface p-3 sm:grid-cols-2 md:grid-cols-4">
            <Tiker label="Tahun Anggaran" nilai={r.ta_label} />
            <Tiker label="Realisasi instansi" nilai={persenTeks(r.persen_realisasi)} />
            <Tiker label="Total SPJ" nilai={String(r.total_spj)} />
            <Tiker label="Jumlah seksi" nilai={String(r.seksi.length)} />
          </section>

          <div className="grid gap-4 md:grid-cols-2">
            <section aria-label="Status SPJ" className="rounded-lg border border-ink-edge bg-ink-surface p-4">
              <h2 className="mb-2 font-semibold">Distribusi Status SPJ</h2>
              <Donut r={r} />
              <ul className="mt-3 space-y-1">
                {r.kategori.map((k) => (
                  <li key={k.kode} className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2" style={{ color: GAYA[k.kode].warna }}>{GAYA[k.kode].ikon}<span className="text-mist">{k.label}</span></span>
                    <span className="mono tnum text-mist">{k.cacah} • {persenTeks(k.persen)}</span>
                  </li>
                ))}
              </ul>
            </section>
            <section aria-label="Realisasi" className="rounded-lg border border-ink-edge bg-ink-surface p-4">
              <h2 className="mb-2 font-semibold">Realisasi Belanja</h2>
              <Gauge persen={r.persen_realisasi} label="Realisasi BKU terhadap pagu" />
              <p className="mt-2 text-2xs text-mist-dim">Realisasi dihitung dari BKU yang sudah dibukukan terhadap pagu TA. Komitmen yang belum dibukukan tidak dihitung.</p>
            </section>
          </div>

          <section aria-label="Peringkat seksi" className="rounded-lg border border-ink-edge bg-ink-surface p-4">
            <h2 className="mb-3 font-semibold">Peringkat Realisasi per Seksi</h2>
            <ol className="space-y-3">
              {r.seksi.map((s) => (
                <li key={s.id}>
                  <div className="flex items-center justify-between gap-2">
                    <span><span className="mono tnum mr-2 text-mist-dim">{s.peringkat}.</span>{s.nama}</span>
                    <span className="mono tnum">{persenTeks(s.persen)}</span>
                  </div>
                  <div className="mt-1 h-2.5 w-full overflow-hidden rounded bg-ink" role="progressbar" aria-label={`Realisasi ${s.nama}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={s.persen ?? undefined} aria-valuetext={persenTeks(s.persen)}>
                    <div className="h-full bg-amber" style={{ width: `${Math.min(100, s.persen ?? 0)}%` }} />
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <p className="text-center text-2xs text-mist-dim">Data diperbarui otomatis berkala. Pembaruan terakhir: <span className="mono">{r.diperbarui} WITA</span></p>
        </main>
      )}
    </div>
  );
}

function Tiker({ label, nilai }: { label: string; nilai: string }) {
  return (
    <div>
      <div className="text-2xs text-mist-dim">{label}</div>
      <div className="mono tnum text-lg font-semibold text-mist md:text-xl">{nilai}</div>
    </div>
  );
}
