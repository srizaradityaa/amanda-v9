// Bantuan unggah berkas Tahap A (frontend dengan data contoh).
// Berkas yang dipilih hanya dipegang di memori peramban selama sesi (alamat objek sementara).
// Penyimpanan permanen berkas baru tersedia di Tahap B (backend). Yang tersimpan di lapisan data: nama dan ukuran.

export const MB = 1024 * 1024;

const store = new Map<string, string>();

export function simpanBerkasSesi(key: string, file: File): void {
  const lama = store.get(key);
  if (lama) URL.revokeObjectURL(lama);
  store.set(key, URL.createObjectURL(file));
}

export function hapusBerkasSesi(key: string): void {
  const lama = store.get(key);
  if (lama) URL.revokeObjectURL(lama);
  store.delete(key);
}

export function adaBerkasSesi(key: string): boolean {
  return store.has(key);
}

export function bukaBerkasSesi(key: string): boolean {
  const u = store.get(key);
  if (!u) return false;
  window.open(u, '_blank', 'noopener');
  return true;
}

// Unduh berkas yang dipegang pada sesi ini dengan nama aslinya.
export function unduhBerkasSesi(key: string, nama: string): boolean {
  const u = store.get(key);
  if (!u) return false;
  const a = document.createElement('a');
  a.href = u;
  a.download = nama;
  document.body.appendChild(a);
  a.click();
  a.remove();
  return true;
}

export function formatUkuran(bytes: number): string {
  if (bytes >= MB) return `${(bytes / MB).toFixed(1).replace('.', ',')} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function ekstensiBerkas(nama: string): string {
  const i = nama.lastIndexOf('.');
  return i < 0 ? '' : nama.slice(i + 1).toLowerCase();
}

// Alamat sementara berkas sesi (mis. untuk menampilkan gambar logo/stempel pada pratinjau). Null bila tidak ada.
export function urlBerkasSesi(key: string): string | null {
  return store.get(key) ?? null;
}
