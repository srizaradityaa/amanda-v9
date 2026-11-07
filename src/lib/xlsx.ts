// Penulis berkas Excel (.xlsx) mandiri tanpa pustaka luar: paket OOXML minimal dalam kontainer ZIP tanpa kompresi.
// Dipakai pada unduhan laporan (Langkah 7). Sel berupa teks atau angka; teks panjang seperti NIP/NIK dan nomor rekening tetap teks.

export type SelXlsx = string | number | null;
export interface LembarXlsx {
  nama: string;
  baris: SelXlsx[][];
  tebal?: number[]; // indeks baris (mulai 0) yang dicetak tebal
}

const enc = new TextEncoder();

let tabelCrc: Uint32Array | null = null;
function crc32(data: Uint8Array): number {
  if (!tabelCrc) {
    tabelCrc = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      tabelCrc[n] = c >>> 0;
    }
  }
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) crc = tabelCrc[(crc ^ data[i]) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function esc(s: string): string {
  // hapus karakter kendali yang tidak sah di XML 1.0
  const bersih = s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '');
  return bersih.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function namaKolom(i: number): string {
  let s = '';
  for (let n = i + 1; n > 0; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
}

/** Nama sheet sah: maksimal 31 karakter, tanpa []:*?/\ dan unik tanpa memandang huruf besar kecil. */
export function namaSheetAman(nama: string, dipakai: string[]): string {
  let dasar = nama.replace(/[\[\]:*?/\\]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 31) || 'Sheet';
  let hasil = dasar;
  let n = 2;
  while (dipakai.some((x) => x.toLowerCase() === hasil.toLowerCase())) {
    const akhiran = ` (${n++})`;
    hasil = dasar.slice(0, 31 - akhiran.length) + akhiran;
  }
  return hasil;
}

function xmlSheet(l: LembarXlsx): string {
  const tebal = new Set(l.tebal ?? []);
  let lebar = 0;
  for (const b of l.baris) lebar = Math.max(lebar, b.length);
  const kolom: string[] = [];
  for (let c = 0; c < lebar; c++) {
    let maks = 8;
    for (const b of l.baris) {
      const v = b[c];
      if (v !== null && v !== undefined) maks = Math.max(maks, Math.min(60, String(v).length + 2));
    }
    kolom.push(`<col min="${c + 1}" max="${c + 1}" width="${maks}" customWidth="1"/>`);
  }
  let rows = '';
  l.baris.forEach((b, r) => {
    let cells = '';
    b.forEach((v, c) => {
      if (v === null || v === undefined || v === '') return;
      const ref = `${namaKolom(c)}${r + 1}`;
      const s = tebal.has(r) ? ' s="1"' : '';
      if (typeof v === 'number' && Number.isFinite(v)) cells += `<c r="${ref}"${s}><v>${v}</v></c>`;
      else cells += `<c r="${ref}"${s} t="inlineStr"><is><t xml:space="preserve">${esc(String(v))}</t></is></c>`;
    });
    rows += `<row r="${r + 1}">${cells}</row>`;
  });
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">${kolom.length ? `<cols>${kolom.join('')}</cols>` : ''}<sheetData>${rows}</sheetData></worksheet>`;
}

function zipSimpan(berkas: { nama: string; isi: Uint8Array }[]): Uint8Array {
  const bagian: Uint8Array[] = [];
  const pusat: Uint8Array[] = [];
  let offset = 0;
  const u16 = (v: number) => [v & 0xff, (v >>> 8) & 0xff];
  const u32 = (v: number) => [v & 0xff, (v >>> 8) & 0xff, (v >>> 16) & 0xff, (v >>> 24) & 0xff];
  for (const b of berkas) {
    const nama = enc.encode(b.nama);
    const crc = crc32(b.isi);
    const lokal = new Uint8Array([
      ...u32(0x04034b50), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21),
      ...u32(crc), ...u32(b.isi.length), ...u32(b.isi.length), ...u16(nama.length), ...u16(0),
    ]);
    bagian.push(lokal, nama, b.isi);
    pusat.push(new Uint8Array([
      ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0x0800), ...u16(0), ...u16(0), ...u16(0x21),
      ...u32(crc), ...u32(b.isi.length), ...u32(b.isi.length), ...u16(nama.length), ...u16(0), ...u16(0),
      ...u16(0), ...u16(0), ...u32(0), ...u32(offset),
    ]), nama);
    offset += lokal.length + nama.length + b.isi.length;
  }
  const ukuranPusat = pusat.reduce((a, x) => a + x.length, 0);
  const akhir = new Uint8Array([
    ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(berkas.length), ...u16(berkas.length),
    ...u32(ukuranPusat), ...u32(offset), ...u16(0),
  ]);
  const semua = [...bagian, ...pusat, akhir];
  const total = semua.reduce((a, x) => a + x.length, 0);
  const hasil = new Uint8Array(total);
  let p = 0;
  for (const x of semua) { hasil.set(x, p); p += x.length; }
  return hasil;
}

/** Bangun berkas .xlsx. Nama sheet otomatis dibuat sah dan unik. */
export function buatXlsx(lembar: LembarXlsx[]): Uint8Array {
  const dipakai: string[] = [];
  const sheets = (lembar.length ? lembar : [{ nama: 'Sheet', baris: [] } as LembarXlsx]).map((l) => {
    const nama = namaSheetAman(l.nama, dipakai);
    dipakai.push(nama);
    return { ...l, nama };
  });
  const berkas: { nama: string; isi: Uint8Array }[] = [];
  const tambah = (nama: string, isi: string) => berkas.push({ nama, isi: enc.encode(isi) });
  tambah('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`);
  tambah('_rels/.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`);
  tambah('xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s, i) => `<sheet name="${esc(s.nama)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`);
  tambah('xl/_rels/workbook.xml.rels', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`);
  tambah('xl/styles.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts><fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="2"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`);
  sheets.forEach((s, i) => tambah(`xl/worksheets/sheet${i + 1}.xml`, xmlSheet(s)));
  return zipSimpan(berkas);
}

/** Unduh berkas .xlsx pada peramban. */
export function unduhXlsx(namaBerkas: string, lembar: LembarXlsx[]): void {
  const bytes = buatXlsx(lembar);
  const blob = new Blob([bytes as BlobPart], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const u = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = u;
  a.download = namaBerkas.endsWith('.xlsx') ? namaBerkas : `${namaBerkas}.xlsx`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(u), 1000);
}
