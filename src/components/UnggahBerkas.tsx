// Pemilih berkas bersama (dipakai Register SK dan lampiran SPJ). Tidak membuat komponen unggah ganda.
import { useRef } from 'react';
import { Button } from '@/components/ui';
import { Paperclip, ExternalLink, X } from 'lucide-react';

export function UnggahBerkas({
  nama, accept, disabled = false, label = 'Pilih berkas', status, onPilih, onHapus, onBuka, bisaBuka,
}: {
  nama: string | null;
  accept: string;
  disabled?: boolean;
  label?: string;
  status?: string | null;
  onPilih: (file: File) => void;
  onHapus?: () => void;
  onBuka?: () => void;
  bisaBuka?: boolean;
}) {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={ref} type="file" accept={accept} className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            e.target.value = '';
            if (f) onPilih(f);
          }}
        />
        {!disabled && (
          <Button variant="secondary" onClick={() => ref.current?.click()}><Paperclip size={14} /> {label}</Button>
        )}
        {nama ? (
          <span className="flex min-w-0 items-center gap-2 rounded border border-ink-edge bg-ink px-2 py-1 text-2xs text-mist">
            <span className="truncate">{nama}</span>
            {onBuka && bisaBuka && (
              <button onClick={onBuka} className="text-teal hover:underline" title="Buka berkas"><ExternalLink size={13} /></button>
            )}
            {onHapus && !disabled && (
              <button onClick={onHapus} className="text-mist-dim hover:text-crit" aria-label="Hapus berkas"><X size={13} /></button>
            )}
          </span>
        ) : (
          <span className="text-2xs text-mist-dim">Belum ada berkas</span>
        )}
      </div>
      {nama && onBuka && !bisaBuka && (
        <p className="text-2xs text-mist-dim">Berkas hanya dapat dibuka pada sesi saat diunggah. Penyimpanan permanen tersedia setelah backend.</p>
      )}
      {status && <p className="text-2xs text-mist-dim">{status}</p>}
    </div>
  );
}
