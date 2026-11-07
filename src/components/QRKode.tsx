// Menampilkan kode QR sebagai SVG (VER-04). Pembuatan matriks memakai lib/qr.ts tanpa pustaka luar.
import { useMemo } from 'react';
import { qrModul } from '@/lib/qr';

export function QRKode({ teks, ukuran = 128 }: { teks: string; ukuran?: number }) {
  const { n, path } = useMemo(() => {
    const m = qrModul(teks);
    let d = '';
    m.forEach((baris, y) => baris.forEach((gelap, x) => { if (gelap) d += `M${x} ${y}h1v1h-1z`; }));
    return { n: m.length, path: d };
  }, [teks]);
  return (
    <svg width={ukuran} height={ukuran} viewBox={`-4 -4 ${n + 8} ${n + 8}`} shapeRendering="crispEdges" role="img" aria-label="Kode QR keaslian SPJ">
      <rect x={-4} y={-4} width={n + 8} height={n + 8} fill="#ffffff" />
      <path d={path} fill="#000000" />
    </svg>
  );
}
