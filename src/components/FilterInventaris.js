'use client';

// const daftarKategori = ['Semua', 'Baik', 'Perlu Cek', 'Rusak'];

const daftarKategori = ['Semua', ...new Set(daftarBarangAwal.map((b) => b.kategori))];

export default function FilterInventaris({ kondisiDipilih, setKondisiDipilih }) {
    return (
        <select
            value={kondisiDipilih}
            onChange={(e) => setKondisiDipilih(e.target.value)}
            style={{ padding: '10px', borderRadius: '6px', border: '1px solid #93c5fd', background: 'white', cursor: 'pointer', marginBottom: '16px' }}
        >
            {daftarKategori.map((k) => (
                <option key={k} value={k}>
                    {k === 'Semua' ? '📂 Semua Kondisi' : k}
                </option>
            ))}
        </select>
    );
}