'use client';

import { useTema } from '@/context/TemaContext';

export default function TombolTema() {
  const { tema, gantiTema } = useTema();

  return (
    <button
      onClick={gantiTema}
      style={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        padding: '10px 16px',
        borderRadius: 999,
        border: '1px solid var(--garis)',
        background: 'var(--kartu)',
        color: 'var(--teks)',
        cursor: 'pointer',
        zIndex: 50,
      }}
    >
      {tema === 'terang' ? '🌙 Mode Gelap' : '☀️ Mode Terang'}
    </button>
  );
}