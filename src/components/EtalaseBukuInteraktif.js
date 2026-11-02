'use client'; // 🌟 Wajib karena kita memakai useState, onChange, dan onClick!

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'bukuDipinjam';

export default function EtalaseBukuInteraktif({ daftarBukuAwal }) {
  const [kataKunci, setKataKunci] = useState('');
  const [kategoriDipilih, setKategoriDipilih] = useState('Semua');
  const [bukuDipinjam, setBukuDipinjam] = useState([]);
  const [sudahLoad, setSudahLoad] = useState(false);

  // Baca dari localStorage setelah mount (di useEffect biar nggak hydration mismatch)
  useEffect(() => {
    try {
      const tersimpan = localStorage.getItem(STORAGE_KEY);
      if (tersimpan) setBukuDipinjam(JSON.parse(tersimpan));
    } catch (err) {
      console.error('Gagal baca localStorage:', err);
    }
    setSudahLoad(true);
  }, []);

  // Simpan setiap kali bukuDipinjam berubah (setelah load awal selesai)
  useEffect(() => {
    if (!sudahLoad) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bukuDipinjam));
  }, [bukuDipinjam, sudahLoad]);

  // Kategori unik untuk dropdown
  const daftarKategori = ['Semua', ...new Set(daftarBukuAwal.map((buku) => buku.kategori))];

  // Filter gabungan: judul + kategori
  const bukuTersaring = daftarBukuAwal.filter((buku) => {
    const cocokJudul = buku.judul.toLowerCase().includes(kataKunci.toLowerCase());
    const cocokKategori = kategoriDipilih === 'Semua' || buku.kategori === kategoriDipilih;
    return cocokJudul && cocokKategori;
  });

  function togglePinjam(judulBuku) {
    if (bukuDipinjam.includes(judulBuku)) {
      setBukuDipinjam(bukuDipinjam.filter((j) => j !== judulBuku));
    } else {
      setBukuDipinjam([...bukuDipinjam, judulBuku]);
    }
  }

  console.log('render ulang')

  return (
    <div>
      {/* Bar Pencarian, Filter Kategori & Info Kantong Peminjaman */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px', background: '#eff6ff', padding: '16px', borderRadius: '8px' }}>
        <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '280px' }}>
          <input
            type="text"
            placeholder="🔍 Cari judul buku di sini..."
            value={kataKunci}
            onChange={(e) => setKataKunci(e.target.value)}
            style={{ padding: '10px', flex: 1, borderRadius: '6px', border: '1px solid #93c5fd' }}
          />
          <select
            value={kategoriDipilih}
            onChange={(e) => setKategoriDipilih(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #93c5fd', background: 'white', cursor: 'pointer' }}
          >
            {daftarKategori.map((kat) => (
              <option key={kat} value={kat}>
                {kat === 'Semua' ? '📂 Semua Kategori' : kat}
              </option>
            ))}
          </select>
        </div>
        <div style={{ fontWeight: 'bold', color: '#1e3a8a' }}>
          📚 Buku Dipilih: {bukuDipinjam.length} Judul
        </div>
      </div>

      {/* Daftar Kartu Buku */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {bukuTersaring.length === 0 && (
          <p style={{ color: '#64748b', textAlign: 'center' }}>Buku tidak ditemukan.</p>
        )}

        {bukuTersaring.map((buku) => {
          const sudahDipilih = bukuDipinjam.includes(buku.judul);
          return (
            <div key={buku.id} style={{ border: '1px solid #cbd5e1', padding: '16px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: sudahDipilih ? '#f0fdf4' : 'white' }}>
              <div>
                <strong style={{ fontSize: '16px' }}>{buku.judul}</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  Kategori: {buku.kategori} • Rak: {buku.rak}
                </p>
              </div>
              <button
                onClick={() => togglePinjam(buku.judul)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  backgroundColor: sudahDipilih ? '#dc2626' : '#2563eb',
                  color: 'white',
                  fontWeight: 'bold'
                }}
              >
                {sudahDipilih ? '❌ Batal Pinjam' : '➕ Pinjam Buku'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}