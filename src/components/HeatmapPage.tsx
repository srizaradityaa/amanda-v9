// ANA-07 — Heatmap Sebaran Realisasi Bulanan (halaman sendiri, khusus PA/KPA). Baris Seksi → Subkegiatan; tanpa tingkat rekening.
import { Card } from '@/components/ui';
import { ErrorLine, SectionTitle, aktorSesi } from '@/components/AnggaranShared';
import { heatmapBulanan } from '@/data/analitik';
import { repo } from '@/data/repo';
import { getSession } from '@/lib/auth';
import { formatRupiah } from '@/lib/format';

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

export function HeatmapPage() {
  const s = getSession()!;
  const aktor = aktorSesi()!;
  const ta = repo.tahunAnggaranById(s.active_ta_id!)!;
  const h = heatmapBulanan(ta.id, aktor);
  if (!h.ok) return <ErrorLine msg={h.error} />;
  const adaLuar = h.data.baris.some((b) => b.luar_tahun > 0);
  // Warna hanya penanda tambahan: intensitas mengikuti persen, nilai tetap tertulis pada setiap sel.
  const latar = (p: number | null, nominal: number) => (nominal > 0 && p !== null ? `rgba(245,158,11,${Math.min(0.55, 0.12 + p / 100)})` : 'transparent');
  return (
    <div className="space-y-4">
      <Card className="p-5">
        <SectionTitle title="Heatmap Sebaran Realisasi Bulanan" desc={`${h.data.ta_label} • realisasi BKU per bulan menurut Tanggal BKU`} />
        <p className="text-2xs text-mist-dim">Persentase pada setiap sel adalah "Porsi Realisasi Bulanan terhadap Pagu Sah Terakhir" dengan pembagi pagu subkegiatan atau seksi. Komitmen kuitansi aktif tidak dihitung, dan angka ini bukan Serapan.</p>
        {h.data.snapshot && <p className="mt-1 text-2xs text-warn">TA ini tidak lagi aktif: matriks menampilkan snapshot pagu TA tersebut.</p>}
        <p className={`mt-1 text-2xs ${h.data.rekonsiliasi_ok ? 'text-ok' : 'text-crit'}`}>{h.data.rekonsiliasi_ok ? 'Rekonsiliasi: total bulanan setiap subkegiatan sama dengan total BKU, dan total seksi sama dengan jumlah subkegiatannya.' : 'Rekonsiliasi: terdapat selisih. Periksa data.'}</p>
      </Card>
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-2xs">
            <thead className="bg-ink text-mist-dim">
              <tr className="text-right">
                <th className="px-3 py-2 text-left font-medium whitespace-nowrap">Seksi / Subkegiatan</th>
                {BULAN.map((b) => <th key={b} className="px-2 py-2 font-medium">{b}</th>)}
                {adaLuar && <th className="px-2 py-2 font-medium whitespace-nowrap">Di luar TA</th>}
                <th className="px-3 py-2 font-medium">Total</th>
              </tr>
            </thead>
            <tbody>
              {h.data.baris.map((b) => (
                <tr key={`${b.tingkat}-${b.id}`} className={`text-right ${b.tingkat === 'seksi' ? 'bg-ink-surface font-semibold' : ''}`}>
                  <td className={`px-3 py-1.5 text-left text-mist ${b.tingkat === 'subkegiatan' ? 'pl-7' : ''}`}>{b.kode && <span className="mono mr-1 text-mist-dim">{b.kode}</span>}{b.nama}</td>
                  {b.bulan.map((n, i) => (
                    <td key={i} className="px-2 py-1.5 align-top" style={{ background: latar(b.persen_bulan[i], n) }}>
                      {n > 0 ? (<><div className="mono tnum text-mist">{formatRupiah(n)}</div><div className="mono tnum text-mist-dim">{b.persen_bulan[i] === null ? '—' : `${b.persen_bulan[i]!.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}%`}</div></>) : <span className="text-mist-dim">—</span>}
                    </td>
                  ))}
                  {adaLuar && <td className="px-2 py-1.5 mono tnum text-mist">{b.luar_tahun > 0 ? formatRupiah(b.luar_tahun) : '—'}</td>}
                  <td className="px-3 py-1.5 mono tnum text-mist">{formatRupiah(b.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
