// VER-04 — Lembar Hasil Verifikasi SPJ (PDF melalui cetak peramban) dengan barcode QR dan nomor verifikasi.
// Data sistem dari repo.dataCetakVerifikasi; teks dan label dari template yang diatur Admin (TPL-04).
import { Modal, Button } from '@/components/ui';
import { QRKode } from '@/components/QRKode';
import { repo, type DataCetakVerifikasi } from '@/data/repo';
import { getSession } from '@/lib/auth';
import { formatRupiah, terbilang } from '@/lib/format';
import { formatTanggal } from '@/lib/wita';
import { urlBerkasSesi } from '@/lib/berkas';
import type { TemplateVerifikasi } from '@/data/types';
import { Printer } from 'lucide-react';
import { useState } from 'react';

export function urlKeaslian(token: string): string {
  return `${window.location.origin}${window.location.pathname}#/keaslian/${token}`;
}

export const KUNCI_LOGO = 'tplver-logo';
export const KUNCI_STEMPEL = 'tplver-stempel';

// Palet skala abu-abu (grayscale) agar hemat tinta dan tetap jelas saat difotokopi.
// Hitam putih tanpa blok isian (hemat tinta saat dicetak): hanya garis, huruf tebal, dan huruf miring.
const G = { teks: '#000000', sedang: '#222222', redup: '#444444', garis: '#000000', garisTipis: '#000000', latar: 'transparent', gelap: '#000000' };
const ADJ = { WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' } as React.CSSProperties;

export function LembarVerifikasi({ d, tpl }: { d: DataCetakVerifikasi; tpl: TemplateVerifikasi }) {
  const logo = tpl.logo_berkas ? urlBerkasSesi(KUNCI_LOGO) : null;
  const stempel = tpl.stempel_berkas ? urlBerkasSesi(KUNCI_STEMPEL) : null;
  const baris = (label: string, nilai: React.ReactNode, tebal = false) => (
    <tr>
      <td style={{ padding: '3px 0', verticalAlign: 'top', width: '30%', color: G.sedang }}>{label}</td>
      <td style={{ padding: '3px 6px', verticalAlign: 'top', width: 10 }}>:</td>
      <td style={{ padding: '3px 0', verticalAlign: 'top', fontWeight: tebal ? 700 : 400 }}>{nilai}</td>
    </tr>
  );
  const rpBaris = (label: string, nilai: string, tebal = false) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '3px 0', fontWeight: tebal ? 700 : 400 }}>
      <span>{label}</span><span style={{ fontFamily: 'JetBrains Mono, Consolas, monospace' }}>{nilai}</span>
    </div>
  );
  return (
    <div id="lembar-verifikasi" style={{ ...ADJ, background: '#ffffff', color: G.teks, padding: 28, fontSize: 12, lineHeight: 1.5, fontFamily: 'Arial, Helvetica, sans-serif' }}>
      {/* Kepala surat */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, paddingBottom: 8, borderBottom: `3px double ${G.gelap}` }}>
        {logo ? <img src={logo} alt="Logo" style={{ height: 60, width: 'auto', filter: 'grayscale(1)' }} /> : <div style={{ width: 8 }} />}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 800, fontSize: 16, letterSpacing: 1.2, textTransform: 'uppercase', fontFamily: 'Georgia, "Times New Roman", serif' }}>{tpl.nama_instansi}</div>
          <div style={{ color: G.sedang, fontSize: 11 }}>{tpl.subjudul}</div>
        </div>
        {logo ? <div style={{ width: 60 }} /> : null}
      </div>

      {/* Judul + pita nomor */}
      <div style={{ textAlign: 'center', margin: '14px 0 8px', fontWeight: 800, fontSize: 14, letterSpacing: 1.5, textTransform: 'uppercase' }}>{tpl.judul_dokumen}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1.5px solid #000', padding: '5px 12px' }}>
        <span style={{ fontWeight: 700, letterSpacing: 1 }}>✓ TERVERIFIKASI</span>
        <span style={{ fontSize: 11 }}>{tpl.label_nomor}: <b style={{ fontFamily: 'JetBrains Mono, Consolas, monospace', fontSize: 13 }}>{d.nomor_verifikasi}</b></span>
      </div>

      {tpl.teks_pembuka && <p style={{ margin: '10px 0', textAlign: 'justify', textIndent: 24 }}>{tpl.teks_pembuka}</p>}

      {/* Rincian pembayaran */}
      <div style={{ border: '1px solid #000', padding: '8px 12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>
          {baris(`Tahun Anggaran / ${tpl.label_seksi}`, `${d.ta_tahun} • ${d.seksi_nama}`)}
          {baris(tpl.label_subkegiatan, d.subkegiatan)}
          {baris(tpl.label_rekening, <span style={{ fontFamily: 'JetBrains Mono, Consolas, monospace' }}>{d.kode_rekening}</span>)}
          {baris(tpl.label_uraian, d.uraian)}
          {baris(tpl.label_bruto, formatRupiah(d.bruto), true)}
          {baris('Terbilang', <i>{terbilang(d.bruto)}</i>)}
        </tbody></table>
      </div>

      {/* Dua kolom: pengesahan (QR) | penerima dan perhitungan */}
      <div style={{ display: 'flex', marginTop: 12, border: '1px solid #000' }}>
        <div style={{ width: '34%', padding: 12, textAlign: 'center', borderRight: '1px solid #000' }}>
          <div style={{ fontSize: 10, color: G.redup, textTransform: 'uppercase', letterSpacing: 1 }}>{tpl.label_tanggal}</div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{formatTanggal(d.tanggal_verifikasi)}</div>
          <div style={{ display: 'inline-block', padding: 4, background: '#fff', border: '1px solid #000' }}><QRKode teks={urlKeaslian(d.token)} ukuran={118} /></div>
          <div style={{ fontSize: 10, color: G.redup, marginTop: 6 }}>{tpl.label_nomor}</div>
          <div style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, Consolas, monospace', wordBreak: 'break-all' }}>{d.nomor_verifikasi}</div>
          <div style={{ position: 'relative', height: 54, marginTop: 6 }}>
            {stempel && <img src={stempel} alt="Stempel" style={{ height: 62, width: 'auto', position: 'absolute', left: '50%', top: -4, transform: 'translateX(-50%)', opacity: 0.85, filter: 'grayscale(1)' }} />}
          </div>
          <div style={{ fontSize: 10, color: G.redup }}>{tpl.label_verifikator}</div>
          <div style={{ fontWeight: 700, textDecoration: 'underline' }}>{d.verifikator_nama}</div>
          <div style={{ fontSize: 11 }}>NIP. {d.verifikator_nip}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #000' }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{tpl.label_penerima}</div>
            {d.rekening_penerima.length === 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse' }}><tbody>{baris('Nama', d.penerima)}{baris('Bank', '—')}{baris('No. Rekening', '—')}</tbody></table>
            ) : d.rekening_penerima.map((r) => (
              <table key={r.id} style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 4 }}><tbody>
                {baris('Nama', r.account_name)}{baris('Bank', r.bank_name)}{baris('No. Rekening', <span style={{ fontFamily: 'JetBrains Mono, Consolas, monospace' }}>{r.account_number}</span>)}
              </tbody></table>
            ))}
          </div>
          <div style={{ padding: '10px 14px' }}>
            {rpBaris('Jumlah yang diminta', formatRupiah(d.bruto), true)}
            <div style={{ marginTop: 4, fontWeight: 700 }}>{tpl.label_pajak}</div>
            {d.pajak.length === 0 ? <div style={{ color: G.redup, padding: '2px 0 2px 12px' }}>Tidak ada potongan pajak</div> : d.pajak.map((p, i) => (
              <div key={i} style={{ paddingLeft: 12 }}>{rpBaris(p.nama, formatRupiah(p.nominal))}</div>
            ))}
            <div style={{ borderTop: '1px solid #000', marginTop: 4 }}>{rpBaris(tpl.label_total_pajak, formatRupiah(d.total_pajak))}</div>
            <div style={{ marginTop: 6, borderTop: '1.5px solid #000', borderBottom: '3px double #000', padding: '5px 2px', fontSize: 13 }}>
              {rpBaris(tpl.label_dibayarkan, formatRupiah(d.dibayarkan), true)}
            </div>
            <div style={{ textAlign: 'right', fontSize: 10, color: G.redup, marginTop: 2 }}>Jumlah yang diminta dikurangi total pajak</div>
          </div>
        </div>
      </div>

      {/* Identitas dokumen */}
      <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ border: '1px solid #000', padding: '4px 10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8 }}>{d.jenis_belanja}</div>
        <div style={{ fontSize: 10, color: G.sedang, textAlign: 'right' }}>
          <div>Identitas SPJ: <span style={{ fontFamily: 'JetBrains Mono, Consolas, monospace' }}>{d.spj_id}</span></div>
          <div>PA/KPA: {d.pa_kpa_nama} • Bendahara: {d.bendahara_nama} • PPTK: {d.pptk_nama}</div>
        </div>
      </div>

      {/* Catatan keaslian */}
      <div style={{ marginTop: 14, borderTop: '1px solid #000', paddingTop: 8, fontSize: 10, color: G.sedang, textAlign: 'center' }}>
        {tpl.teks_qr && <div>{tpl.teks_qr}</div>}
        {tpl.teks_penutup && <div style={{ marginTop: 2 }}>{tpl.teks_penutup}</div>}
      </div>
    </div>
  );
}

export function CetakVerifikasiModal({ spj_id, onClose }: { spj_id: string; onClose: () => void }) {
  const s = getSession();
  const [, ulang] = useState(0);
  void ulang;
  const hasil = s ? repo.dataCetakVerifikasi(spj_id, s) : ({ ok: false, error: 'Sesi tidak valid.' } as const);
  return (
    <Modal open onClose={onClose} title="Hasil Verifikasi SPJ" wide
      footer={hasil.ok ? (
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Tutup</Button>
          <Button onClick={() => window.print()}><Printer size={14} /> Cetak / Simpan PDF</Button>
        </div>
      ) : undefined}>
      <style>{`@media print { body * { visibility: hidden !important; } #lembar-verifikasi, #lembar-verifikasi * { visibility: visible !important; } #lembar-verifikasi { position: fixed; left: 0; top: 0; width: 100%; } }`}</style>
      {hasil.ok ? (
        <>
          <p className="mb-3 text-2xs text-mist-dim">Pilih "Simpan sebagai PDF" pada jendela cetak peramban untuk menghasilkan berkas PDF.</p>
          <LembarVerifikasi d={hasil.data} tpl={repo.templateVerifikasi()} />
        </>
      ) : (
        <p className="text-sm text-crit">{hasil.error}</p>
      )}
    </Modal>
  );
}
