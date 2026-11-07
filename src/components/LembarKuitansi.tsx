// KUI-03 / TPL-01 — Lembar kuitansi (satu tata letak dipakai untuk cetak dan pratinjau Template).
// Mengikuti contoh kwitansi pemilik: kotak TA, logo, tabel kode, judul, isian berlabel, empat blok tanda tangan 2x2.
// Tidak memuat No. Kuitansi, Kegiatan, rekening bank, daftar pelaksana, kotak verifikasi, maupun nama rekening (D01 §2.2).
import type { TemplateKuitansi } from '@/data/types';
import { formatRupiah } from '@/lib/format';

export const KUNCI_LOGO_KUITANSI = 'tplkui-logo';

export interface DataLembarKuitansi {
  tahun: string;
  kode_subkegiatan: string;
  kode_rekening: string;
  bruto: number;
  terbilang: string;
  uraian: string;
  subkegiatan: string;
  pa: { nama: string; nip: string };
  bendahara: { nama: string; nip: string };
  pptk: { nama: string; nip: string };
  penerima: string;
  tanggal: string; // sudah terformat, mis. "26 Agustus 2025"
}

function Baris({ label, children, tebal }: { label: string; children: React.ReactNode; tebal?: boolean }) {
  return (
    <div className="flex items-start gap-1 py-1">
      <span className="w-[34%] shrink-0 uppercase">{label}</span>
      <span className="w-3 shrink-0">:</span>
      <span className={tebal ? 'font-bold' : ''}>{children}</span>
    </div>
  );
}

function Blok({ atas, jabatan, nama, nip }: { atas: string; jabatan?: string; nama: string; nip?: string }) {
  return (
    <div className="text-center">
      <div>{atas}</div>
      {jabatan !== undefined && <div>{jabatan}</div>}
      <div className="h-14" />
      <div className="font-bold underline">{nama}</div>
      {nip && <div className="font-semibold">NIP. {nip}</div>}
    </div>
  );
}

export function LembarKuitansi({ tpl, d, logoUrl }: { tpl: TemplateKuitansi; d: DataLembarKuitansi; logoUrl: string | null }) {
  return (
    <div id="lembar-kuitansi" className="w-full bg-white p-6 text-[12px] leading-snug text-black" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-3">
        <div><span className="inline-block border-2 border-black px-3 py-1 text-[11px] font-bold uppercase">Tahun Anggaran : {d.tahun}</span></div>
        <div className="flex h-16 w-16 items-center justify-center">
          {logoUrl ? <img src={logoUrl} alt="Logo" className="max-h-16 max-w-16 object-contain" /> : <span className="text-center text-[9px] text-gray-500">{tpl.nama_instansi}</span>}
        </div>
        <div className="justify-self-end">
          <table className="border-2 border-black text-[11px]"><tbody>
            <tr><td className="border border-black px-1.5 py-0.5">Kode Sub Kegiatan</td><td className="border border-black px-1.5 py-0.5">: <span className="font-mono">{d.kode_subkegiatan}</span></td></tr>
            <tr><td className="border border-black px-1.5 py-0.5">Kode Rekening</td><td className="border border-black px-1.5 py-0.5">: <span className="font-mono">{d.kode_rekening}</span></td></tr>
          </tbody></table>
        </div>
      </div>

      <div className="my-3 text-center text-lg font-bold" style={{ letterSpacing: '0.45em' }}>{tpl.judul_dokumen}</div>

      <div>
        <Baris label="Sudah terima dari">{tpl.terima_dari}</Baris>
        <Baris label="Uang sejumlah" tebal>{formatRupiah(d.bruto)}</Baris>
        <Baris label="Terbilang">{`/// ${d.terbilang} ///`}</Baris>
        <Baris label="Untuk pembayaran">{d.uraian}</Baris>
        <div className="flex gap-2 py-1 pl-[34%]">
          <span className="font-bold">Sub Keg.</span><span className="font-bold">{d.subkegiatan}</span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-3">
        <Blok atas="Setuju dibayar oleh" jabatan="PPTK" nama={d.pptk.nama} nip={d.pptk.nip} />
        <div className="text-center">
          <div>{tpl.tempat_penerima}, {d.tanggal}</div>
          <div>Yang Menerima,</div>
          <div className="h-14" />
          <div className="font-bold underline">{d.penerima}</div>
        </div>
        <Blok atas="Setuju dibayar," jabatan="Pengguna Anggaran" nama={d.pa.nama} nip={d.pa.nip} />
        <Blok atas="Lunas dibayar oleh," jabatan="Bendahara Pengeluaran" nama={d.bendahara.nama} nip={d.bendahara.nip} />
      </div>
    </div>
  );
}
