// Tampilan bersama laporan: tabel layar, ekspor Excel, dan lembar cetak/PDF (judul kolom diulang pada tiap halaman cetak).
import { Modal, Button } from '@/components/ui';
import { repo } from '@/data/repo';
import { formatRupiah } from '@/lib/format';
import { unduhXlsx, type LembarXlsx, type SelXlsx } from '@/lib/xlsx';
import type { BlokLaporan, KolomLaporan, Laporan, Sel } from '@/data/laporan';
import { Printer } from 'lucide-react';

export function teksSel(v: Sel, k?: KolomLaporan): string {
  if (v === null || v === undefined || v === '') return '';
  if (typeof v === 'number') {
    if (k?.tipe === 'rupiah') return formatRupiah(v);
    if (k?.tipe === 'persen') return `${v.toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`;
    return v.toLocaleString('id-ID', { maximumFractionDigits: 6 });
  }
  return v;
}

export function persenAtauStrip(v: Sel): string {
  return v === null ? '—' : String(v);
}

function TabelBlok({ blok, putih = false }: { blok: BlokLaporan; putih?: boolean }) {
  const rata = (k: KolomLaporan) => (k.tipe ? 'text-right tabular-nums' : 'text-left');
  const sel = putih ? 'border border-black px-1.5 py-0.5' : 'px-3 py-1.5';
  return (
    <div className="mb-4">
      {blok.judul?.map((j, i) => <p key={i} className={putih ? 'text-[11px] font-semibold' : 'text-2xs text-mist-dim'}>{j}</p>)}
      <table className={`w-full ${putih ? 'text-[10px]' : 'text-2xs'}`} style={putih ? { borderCollapse: 'collapse' } : undefined}>
        <thead className={putih ? '' : 'bg-ink text-mist-dim'} style={putih ? { display: 'table-header-group', background: '#eee' } : undefined}>
          <tr>{blok.kolom.map((k, i) => <th key={i} className={`${sel} font-medium whitespace-nowrap ${rata(k)}`}>{k.nama}</th>)}</tr>
        </thead>
        <tbody>
          {blok.baris.map((b, i) => (
            <tr key={i} className={putih ? '' : i % 2 ? 'bg-ink-surface/40' : ''} style={putih ? { breakInside: 'avoid' } : undefined}>
              {blok.kolom.map((k, c) => <td key={c} className={`${sel} ${rata(k)} ${putih ? '' : 'text-mist'}`}>{teksSel(b[c], k) || (k.tipe === 'persen' ? '—' : '')}</td>)}
            </tr>
          ))}
          {blok.total && (
            <tr className="font-semibold">
              {blok.kolom.map((k, c) => <td key={c} className={`${sel} ${rata(k)} ${putih ? '' : 'text-mist'}`}>{teksSel(blok.total![c], k)}</td>)}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export function TabelLaporan({ laporan }: { laporan: Laporan }) {
  if (laporan.sheets.length === 0 || laporan.sheets.every((s) => s.blok.every((b) => b.baris.length === 0))) {
    return <p className="p-4 text-sm text-mist-dim">Belum ada data Dibukukan pada filter ini.</p>;
  }
  return (
    <div className="space-y-4 p-4">
      {laporan.sheets.map((s) => (
        <div key={s.nama}>
          {laporan.sheets.length > 1 && <h4 className="mb-2 text-sm font-semibold text-mist">{s.nama}</h4>}
          <div className="overflow-x-auto">{s.blok.map((b, i) => <TabelBlok key={i} blok={b} />)}</div>
        </div>
      ))}
    </div>
  );
}

export function laporanKeXlsx(l: Laporan): LembarXlsx[] {
  const instansi = repo.templateKuitansi().nama_instansi;
  return l.sheets.map((s) => {
    const baris: SelXlsx[][] = [];
    const tebal: number[] = [];
    if (l.judulDiSheet) {
      tebal.push(baris.length); baris.push([instansi]);
      tebal.push(baris.length); baris.push([l.judul]);
      if (l.keterangan) baris.push([l.keterangan]);
      baris.push([]);
    }
    s.blok.forEach((b, i) => {
      if (i > 0) baris.push([]);
      b.judul?.forEach((j) => { tebal.push(baris.length); baris.push([j]); });
      tebal.push(baris.length); baris.push(b.kolom.map((k) => k.nama));
      b.baris.forEach((r) => baris.push(r.map((v) => (v === undefined ? null : v))));
      if (b.total) { tebal.push(baris.length); baris.push(b.total); }
    });
    return { nama: s.nama, baris, tebal };
  });
}

export function unduhLaporanExcel(l: Laporan, namaBerkas: string): void {
  unduhXlsx(namaBerkas, laporanKeXlsx(l));
}

export function LaporanCetakModal({ laporan, onClose }: { laporan: Laporan; onClose: () => void }) {
  const instansi = repo.templateKuitansi().nama_instansi;
  return (
    <Modal open onClose={onClose} title={`Cetak: ${laporan.judul}`} wider
      footer={<div className="flex justify-end gap-2"><Button variant="ghost" onClick={onClose}>Tutup</Button><Button onClick={() => window.print()}><Printer size={14} /> Cetak / Simpan PDF</Button></div>}>
      <style>{`@media print { body * { visibility: hidden !important; } #lembar-laporan, #lembar-laporan * { visibility: visible !important; } #lembar-laporan { position: absolute; left: 0; top: 0; width: 100%; } }`}</style>
      <p className="mb-3 text-2xs text-mist-dim">Pilih "Simpan sebagai PDF" pada jendela cetak peramban. Judul kolom diulang pada setiap halaman.</p>
      <div id="lembar-laporan" style={{ background: '#fff', color: '#000', padding: 20, fontFamily: 'Inter, Arial, sans-serif' }}>
        <div style={{ textAlign: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700 }}>{instansi}</div>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{laporan.judul}</div>
          {laporan.keterangan && <div style={{ fontSize: 11 }}>{laporan.keterangan}</div>}
        </div>
        {laporan.sheets.map((s) => (
          <div key={s.nama}>
            {laporan.sheets.length > 1 && <h4 style={{ fontWeight: 700, margin: '8px 0 4px' }}>{s.nama}</h4>}
            {s.blok.map((b, i) => <TabelBlok key={i} blok={b} putih />)}
          </div>
        ))}
      </div>
    </Modal>
  );
}
