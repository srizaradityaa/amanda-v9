// VER-05 — Halaman keaslian SPJ via token (publik, tanpa login).
// Hanya status, nama TA, nama seksi, dan tanggal verifikasi. Respons seragam untuk token tidak dikenal atau tidak berlaku.
import { repo } from '@/data/repo';
import { formatTanggal } from '@/lib/wita';
import { CheckCircle2, XCircle } from 'lucide-react';

export function KeaslianPage({ token }: { token: string }) {
  const r = repo.cekKeaslian(token);
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink p-4">
      <div className="w-full max-w-md rounded-lg border border-ink-edge bg-ink-surface p-6 text-center">
        <p className="text-2xs text-mist-dim">Pemerintah Kabupaten Balangan • AMANDA</p>
        <h1 className="mt-1 text-base font-semibold text-mist">Pemeriksaan Keaslian SPJ</h1>
        {r.berlaku ? (
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-ok"><CheckCircle2 size={22} /> Berlaku</div>
            <dl className="space-y-1 text-sm text-mist">
              <div><dt className="inline text-mist-dim">Tahun Anggaran: </dt><dd className="inline">{r.ta}</dd></div>
              <div><dt className="inline text-mist-dim">Seksi: </dt><dd className="inline">{r.seksi}</dd></div>
              <div><dt className="inline text-mist-dim">Tanggal verifikasi: </dt><dd className="inline">{formatTanggal(r.tanggal)}</dd></div>
            </dl>
          </div>
        ) : (
          <div className="mt-5 space-y-2">
            <div className="flex items-center justify-center gap-2 text-lg font-semibold text-crit"><XCircle size={22} /> Tidak berlaku</div>
            <p className="text-sm text-mist-dim">Dokumen ini tidak dapat dinyatakan asli oleh sistem.</p>
          </div>
        )}
        <a href={`${window.location.pathname}`} className="mt-6 inline-block text-2xs text-teal hover:underline">Ke halaman utama AMANDA</a>
      </div>
    </div>
  );
}
