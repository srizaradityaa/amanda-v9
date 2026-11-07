// Pembuat kode QR mandiri (mode byte, koreksi galat M, versi 1-40) tanpa pustaka luar.
// Dipakai untuk barcode keaslian pada Hasil Verifikasi SPJ (D02 §8 poin 3).
// Algoritma mengikuti standar ISO/IEC 18004 (susunan umum yang sama dengan implementasi QR referensi).

const ECC_PER_BLOCK_M = [-1, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28];
const NUM_BLOCKS_M = [-1, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49];

function jumlahModulData(ver: number): number {
  let hasil = (16 * ver + 128) * ver + 64;
  if (ver >= 2) {
    const n = Math.floor(ver / 7) + 2;
    hasil -= (25 * n - 10) * n - 55;
    if (ver >= 7) hasil -= 36;
  }
  return hasil;
}

function jumlahKodeData(ver: number): number {
  return Math.floor(jumlahModulData(ver) / 8) - ECC_PER_BLOCK_M[ver] * NUM_BLOCKS_M[ver];
}

function kaliGF(x: number, y: number): number {
  let z = 0;
  for (let i = 7; i >= 0; i--) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z;
}

function pembagiRS(derajat: number): number[] {
  const hasil: number[] = [];
  for (let i = 0; i < derajat - 1; i++) hasil.push(0);
  hasil.push(1);
  let akar = 1;
  for (let i = 0; i < derajat; i++) {
    for (let j = 0; j < hasil.length; j++) {
      hasil[j] = kaliGF(hasil[j], akar);
      if (j + 1 < hasil.length) hasil[j] ^= hasil[j + 1];
    }
    akar = kaliGF(akar, 0x02);
  }
  return hasil;
}

function sisaRS(data: number[], pembagi: number[]): number[] {
  const hasil: number[] = pembagi.map(() => 0);
  for (const b of data) {
    const faktor = b ^ (hasil.shift() as number);
    hasil.push(0);
    pembagi.forEach((koef, i) => { hasil[i] ^= kaliGF(koef, faktor); });
  }
  return hasil;
}

function utf8(teks: string): number[] {
  return Array.from(new TextEncoder().encode(teks));
}

function bitData(bytes: number[], ver: number): number[] {
  const bits: number[] = [];
  const taruh = (nilai: number, panjang: number) => {
    for (let i = panjang - 1; i >= 0; i--) bits.push((nilai >>> i) & 1);
  };
  taruh(0x4, 4);
  taruh(bytes.length, ver <= 9 ? 8 : 16);
  for (const b of bytes) taruh(b, 8);
  const kapasitas = jumlahKodeData(ver) * 8;
  taruh(0, Math.min(4, kapasitas - bits.length));
  taruh(0, (8 - (bits.length % 8)) % 8);
  for (let pad = 0xec; bits.length < kapasitas; pad ^= 0xec ^ 0x11) taruh(pad, 8);
  const kode: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let v = 0;
    for (let j = 0; j < 8; j++) v = (v << 1) | bits[i + j];
    kode.push(v);
  }
  return kode;
}

function sisipkanECC(data: number[], ver: number): number[] {
  const nBlok = NUM_BLOCKS_M[ver];
  const eccLen = ECC_PER_BLOCK_M[ver];
  const raw = Math.floor(jumlahModulData(ver) / 8);
  const nPendek = nBlok - (raw % nBlok);
  const lenPendek = Math.floor(raw / nBlok);
  const blok: number[][] = [];
  const pembagi = pembagiRS(eccLen);
  for (let i = 0, k = 0; i < nBlok; i++) {
    const dat = data.slice(k, k + lenPendek - eccLen + (i < nPendek ? 0 : 1));
    k += dat.length;
    const ecc = sisaRS(dat, pembagi);
    if (i < nPendek) dat.push(0);
    blok.push(dat.concat(ecc));
  }
  const hasil: number[] = [];
  for (let i = 0; i < blok[0].length; i++) {
    blok.forEach((b, j) => {
      if (i !== lenPendek - eccLen || j >= nPendek) hasil.push(b[i]);
    });
  }
  return hasil;
}

function posisiAlignment(ver: number, ukuran: number): number[] {
  if (ver === 1) return [];
  const n = Math.floor(ver / 7) + 2;
  const langkah = ver === 32 ? 26 : Math.ceil((ver * 4 + 4) / (n * 2 - 2)) * 2;
  const hasil = [6];
  for (let pos = ukuran - 7; hasil.length < n; pos -= langkah) hasil.splice(1, 0, pos);
  return hasil;
}

function bangunMatriks(kode: number[], ver: number): boolean[][] {
  const ukuran = ver * 4 + 17;
  const m: boolean[][] = Array.from({ length: ukuran }, () => Array<boolean>(ukuran).fill(false));
  const fungsi: boolean[][] = Array.from({ length: ukuran }, () => Array<boolean>(ukuran).fill(false));
  const setF = (x: number, y: number, v: boolean) => { m[y][x] = v; fungsi[y][x] = true; };

  for (let i = 0; i < ukuran; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }
  const finder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        const d = Math.max(Math.abs(dx), Math.abs(dy));
        const x = cx + dx, y = cy + dy;
        if (x >= 0 && x < ukuran && y >= 0 && y < ukuran) setF(x, y, d !== 2 && d !== 4);
      }
    }
  };
  finder(3, 3); finder(ukuran - 4, 3); finder(3, ukuran - 4);
  const pos = posisiAlignment(ver, ukuran);
  const n = pos.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      if ((i === 0 && j === 0) || (i === 0 && j === n - 1) || (i === n - 1 && j === 0)) continue;
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        setF(pos[i] + dx, pos[j] + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
      }
    }
  }
  const tulisFormat = (mask: number) => {
    const data = (0 << 3) | mask; // tingkat koreksi M = 0
    let rem = data;
    for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = ((data << 10) | rem) ^ 0x5412;
    const bit = (i: number) => ((bits >>> i) & 1) !== 0;
    for (let i = 0; i <= 5; i++) setF(8, i, bit(i));
    setF(8, 7, bit(6)); setF(8, 8, bit(7)); setF(7, 8, bit(8));
    for (let i = 9; i < 15; i++) setF(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) setF(ukuran - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) setF(8, ukuran - 15 + i, bit(i));
    setF(8, ukuran - 8, true);
  };
  tulisFormat(0); // cadangan area format agar tidak terisi data
  if (ver >= 7) {
    let rem = ver;
    for (let i = 0; i < 12; i++) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (ver << 12) | rem;
    for (let i = 0; i < 18; i++) {
      const b = ((bits >>> i) & 1) !== 0;
      const a = ukuran - 11 + (i % 3);
      const c = Math.floor(i / 3);
      setF(a, c, b); setF(c, a, b);
    }
  }
  // tempatkan kode data
  let idx = 0;
  for (let kanan = ukuran - 1; kanan >= 1; kanan -= 2) {
    if (kanan === 6) kanan = 5;
    for (let v = 0; v < ukuran; v++) {
      for (let j = 0; j < 2; j++) {
        const x = kanan - j;
        const naik = ((kanan + 1) & 2) === 0;
        const y = naik ? ukuran - 1 - v : v;
        if (!fungsi[y][x] && idx < kode.length * 8) {
          m[y][x] = ((kode[idx >>> 3] >>> (7 - (idx & 7))) & 1) !== 0;
          idx++;
        }
      }
    }
  }
  const terapkanMask = (mask: number) => {
    for (let y = 0; y < ukuran; y++) {
      for (let x = 0; x < ukuran; x++) {
        let balik = false;
        switch (mask) {
          case 0: balik = (x + y) % 2 === 0; break;
          case 1: balik = y % 2 === 0; break;
          case 2: balik = x % 3 === 0; break;
          case 3: balik = (x + y) % 3 === 0; break;
          case 4: balik = (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0; break;
          case 5: balik = ((x * y) % 2) + ((x * y) % 3) === 0; break;
          case 6: balik = (((x * y) % 2) + ((x * y) % 3)) % 2 === 0; break;
          default: balik = (((x + y) % 2) + ((x * y) % 3)) % 2 === 0; break;
        }
        if (balik && !fungsi[y][x]) m[y][x] = !m[y][x];
      }
    }
  };
  const penalti = (): number => {
    let p = 0;
    for (let y = 0; y < ukuran; y++) {
      let run = 1;
      for (let x = 1; x <= ukuran; x++) {
        if (x < ukuran && m[y][x] === m[y][x - 1]) run++;
        else { if (run >= 5) p += run - 2; run = 1; }
      }
    }
    for (let x = 0; x < ukuran; x++) {
      let run = 1;
      for (let y = 1; y <= ukuran; y++) {
        if (y < ukuran && m[y][x] === m[y - 1][x]) run++;
        else { if (run >= 5) p += run - 2; run = 1; }
      }
    }
    for (let y = 0; y < ukuran - 1; y++) for (let x = 0; x < ukuran - 1; x++) {
      const c = m[y][x];
      if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) p += 3;
    }
    let gelap = 0;
    for (const baris of m) for (const c of baris) if (c) gelap++;
    const total = ukuran * ukuran;
    p += Math.floor(Math.abs(gelap * 20 - total * 10) / total) * 10;
    return p;
  };
  let terbaik = 0, skorTerbaik = Infinity;
  for (let mask = 0; mask < 8; mask++) {
    terapkanMask(mask);
    tulisFormat(mask);
    const s = penalti();
    if (s < skorTerbaik) { skorTerbaik = s; terbaik = mask; }
    terapkanMask(mask); // batalkan (XOR kedua)
  }
  terapkanMask(terbaik);
  tulisFormat(terbaik);
  return m;
}

/** Matriks modul QR (true = gelap) tanpa zona hening. Melempar galat bila teks terlalu panjang. */
export function qrModul(teks: string): boolean[][] {
  const bytes = utf8(teks);
  for (let ver = 1; ver <= 40; ver++) {
    const bitDibutuhkan = 4 + (ver <= 9 ? 8 : 16) + bytes.length * 8;
    if (bitDibutuhkan <= jumlahKodeData(ver) * 8) {
      return bangunMatriks(sisipkanECC(bitData(bytes, ver), ver), ver);
    }
  }
  throw new Error('Teks terlalu panjang untuk kode QR.');
}
