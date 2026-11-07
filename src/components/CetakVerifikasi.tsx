// VER-04 — Lembar Hasil Verifikasi SPJ (PDF melalui cetak peramban) dengan barcode QR dan nomor verifikasi.
// Data sistem dari repo.dataCetakVerifikasi; teks dan label dari template yang diatur Admin (TPL-04).
import { Modal, Button } from '@/components/ui';
import { QRKode } from '@/components/QRKode';
import { repo, type DataCetakVerifikasi } from '@/data/repo';
import { getSession } from '@/lib/auth';
import { formatRupiah } from '@/lib/format';
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

export function LembarVerifikasi({ d, tpl }: { d: DataCetakVerifikasi; tpl: TemplateVerifikasi }) {
  const logo = tpl.logo_berkas ? urlBerkasSesi(KUNCI_LOGO) : null;
  const stempel = tpl.stempel_berkas ? urlBerkasSesi(KUNCI_STEMPEL) : null;
  const baris = (label: string, nilai: React.ReactNode) => (
    <tr>
      <td style={{ padding: '2px 8px 2px 0', verticalAlign: 'top', width: '34%' }}>{label}</td>
      <td style={{ padding: '2px 0', verticalAlign: 'top' }}>: {nilai}</td>
    </tr>
  );
  return (
    <div id="lembar-verifikasi" style={{ background: '#ffffff', color: '#000000', padding: 24, fontSize: 12, lineHeight: 1.5, fontFamily: 'Inter, Arial, sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, borderBottom: '2px solid #000', paddingBottom: 8 }}>
        {logo && <img src={logo} alt="Logo" style={{ height: 56, width: 'auto' }} />}
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontWeight: 700 }}>{tpl.nama_instansi}</div>
          <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>{tpl.judul_dokumen}</div>
          <div>{tpl.subjudul}</div>
        </div>
      </div>
      {tpl.teks_pembuka && <p style={{ margin: '10px 0' }}>{tpl.teks_pembuka}</p>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <tbody>
          {baris(tpl.label_nomor, <b>{d.nomor_verifikasi}</b>)}
          {baris(tpl.label_tanggal, formatTanggal(d.tanggal_verifikasi))}
          {baris('Tahun Anggaran', d.ta_tahun)}
          {baris(tpl.label_seksi, d.seksi_nama)}
          {baris('Identitas SPJ', `${d.spj_id} • ${d.jenis_belanja}`)}
          {baris(tpl.label_subkegiatan, d.subkegiatan)}
          {baris(tpl.label_rekening, d.kode_rekening)}
          {baris(tpl.label_uraian, d.uraian)}
          {baris(tpl.label_bruto, formatRupiah(d.bruto))}
          {baris(tpl.label_penerima, d.penerima)}
          {baris(tpl.label_rekening_penerima, d.rekening_penerima.length === 0 ? '—' : (
            <span>{d.rekening_penerima.map((r) => (
              <span key={r.id} style={{ display: 'block' }}>{r.account_name} • {r.bank_name} • {r.account_number}</span>
            ))}</span>
          ))}
          {baris(tpl.label_pajak, d.pajak.length === 0 ? '—' : (
            <span>{d.pajak.map((p, i) => (
              <span key={i} style={{ display: 'block' }}>{p.nama}: {formatRupiah(p.nominal)}</span>
            ))}</span>
          ))}
          {baris(tpl.label_total_pajak, formatRupiah(d.total_pajak))}
          {baris(tpl.label_dibayarkan, <b>{formatRupiah(d.dibayarkan)}</b>)}
        </tbody>
      </table>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginTop: 16, alignItems: 'flex-end' }}>
        <div style={{ fontSize: 11 }}>
          <div>PA/KPA: {d.pa_kpa_nama} (NIP {d.pa_kpa_nip})</div>
          <div>Bendahara Pengeluaran: {d.bendahara_nama} (NIP {d.bendahara_nip})</div>
          <div>PPTK: {d.pptk_nama} (NIP {d.pptk_nip})</div>
        </div>
        <div style={{ textAlign: 'center', position: 'relative' }}>
          <div>{tpl.label_verifikator}</div>
          <div style={{ height: 56, position: 'relative' }}>
            {stempel && <img src={stempel} alt="Stempel" style={{ height: 64, width: 'auto', position: 'absolute', left: '50%', top: -4, transform: 'translateX(-50%)', opacity: 0.85 }} />}
          </div>
          <div style={{ fontWeight: 700 }}>{d.verifikator_nama}</div>
          <div>NIP {d.verifikator_nip}</div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, borderTop: '1px solid #000', paddingTop: 10 }}>
        <QRKode teks={urlKeaslian(d.token)} ukuran={110} />
        <div>
          <div style={{ fontSize: 11 }}>{tpl.teks_qr}</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontWeight: 700 }}>{d.nomor_verifikasi}</div>
          {tpl.teks_penutup && <div style={{ fontSize: 11, marginTop: 4 }}>{tpl.teks_penutup}</div>}
        </div>
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
