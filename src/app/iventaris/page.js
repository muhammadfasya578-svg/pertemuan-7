'use client';

import { useState, useEffect } from 'react';
import FilterInventaris from '@/components/FilterInventaris';

export default function HalamanInventarisLab() {
    const [daftarBarang, setDaftarBarang] = useState([]);
    const [loading, setLoading] = useState(true);
    const [kondisiDipilih, setKondisiDipilih] = useState('Semua');
    const [kategoriDipilih, setKategoriDipilih] = useState('Semua');

    

    const [idEdit, setIdEdit] = useState(null);
    const [kode, setKode] = useState('');
    const [nama, setNama] = useState('');
    const [stok, setStok] = useState(1);
    const [kondisi, setKondisi] = useState('Baik');

    async function muatDataBarang() {
        setLoading(true);
        try {
            const res = await fetch('/api/inventaris');
            const data = await res.json();
            setDaftarBarang(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Gagal memuat data:', err);
            setDaftarBarang([]);
        }
        setLoading(false);
    }

    useEffect(() => {
        muatDataBarang();
    }, []);

    async function simpanBarang(e) {
        e.preventDefault();
        const payload = { kode, nama, stok, kondisi };

        if (idEdit !== null) {
            await fetch(`/api/inventaris/${idEdit}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        } else {
            await fetch('/api/inventaris', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        }

        resetForm();
        muatDataBarang();
    }

    async function hapusBarang(id, namaBarang) {
        if (!confirm(`Yakin ingin menghapus "${namaBarang}" dari inventaris lab?`)) return;
        await fetch(`/api/inventaris/${id}`, { method: 'DELETE' });
        muatDataBarang();
    }

    function pilihUntukEdit(barang) {
        setIdEdit(barang.id);
        setKode(barang.kode);
        setNama(barang.nama);
        setStok(barang.stok);
        setKondisi(barang.kondisi);
    }

    function resetForm() {
        setIdEdit(null);
        setKode('');
        setNama('');
        setStok(1);
        setKondisi('Baik');
    }

    // MEMFILTER DATA
    const barangTersaring = daftarBarang.filter(
        (b) => kondisiDipilih === 'Semua' || b.kondisi === kondisiDipilih

    );
    console.log(kondisiDipilih, barangTersaring);

    return (
        <div style={{ padding: '24px' }}>
            <h1>🖥️ Sistem Inventaris Laboratorium Komputer (Full CRUD)</h1>

            <form onSubmit={simpanBarang} style={{ background: '#eff6ff', padding: '20px', borderRadius: '10px', marginBottom: '24px', border: '1px solid #bfdbfe' }}>
                <h3 style={{ marginTop: 0 }}>
                    {idEdit ? '✏️ Edit Data Barang Lab' : '➕ Tambah Barang Baru'}
                </h3>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <input placeholder="Kode (Misal: LAB-04)" value={kode} onChange={(e) => setKode(e.target.value)} required style={{ padding: '8px' }} />
                    <input placeholder="Nama Alat Lab" value={nama} onChange={(e) => setNama(e.target.value)} required style={{ padding: '8px', flex: 1 }} />
                    <input type="number" placeholder="Stok" value={stok} onChange={(e) => setStok(e.target.value)} min="0" style={{ padding: '8px', width: '70px' }} />
                    <select value={kondisi} onChange={(e) => setKondisi(e.target.value)} style={{ padding: '8px' }}>
                        <option value="Baik">Baik</option>
                        <option value="Perlu Cek">Perlu Cek</option>
                        <option value="Rusak">Rusak</option>
                    </select>
                    <button type="submit" style={{ background: '#1e40af', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}>
                        {idEdit ? 'Simpan Perubahan' : 'Tambah Barang'}
                    </button>
                    {idEdit && (
                        <button type="button" onClick={resetForm} style={{ padding: '8px 12px' }}>Batal</button>
                    )}
                </div>
            </form>

            <FilterInventaris
                kondisiDipilih={kondisiDipilih}
                setKondisiDipilih={setKondisiDipilih}
            />

            {loading ? <p>⏳ Sedang mengambil data dari REST API...</p> : (
                <>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ background: '#1e3a8a', color: 'white' }}>
                                <th style={{ padding: '10px' }}>Kode</th>
                                <th style={{ padding: '10px' }}>Nama Perangkat</th>
                                <th style={{ padding: '10px' }}>Stok</th>
                                <th style={{ padding: '10px' }}>Kondisi</th>
                                <th style={{ padding: '10px' }}>Aksi CRUD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {barangTersaring.map((b) => (
                                <tr key={b.id} style={{ borderBottom: '1px solid #cbd5e1' }}>
                                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{b.kode}</td>
                                    <td style={{ padding: '10px' }}>{b.nama}</td>
                                    <td style={{ padding: '10px' }}>{b.stok} Unit</td>
                                    <td style={{ padding: '10px' }}>{b.kondisi}</td>
                                    <td style={{ padding: '10px' }}>
                                        <button onClick={() => pilihUntukEdit(b)} style={{ marginRight: '8px' }}>✏️ Edit</button>
                                        <button onClick={() => hapusBarang(b.id, b.nama)} style={{ color: '#dc2626' }}>🗑️ Hapus</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {barangTersaring.length === 0 && (
                        <p style={{ padding: '16px', color: '#64748b' }}>Tidak ada barang dengan kondisi ini.</p>
                    )}
                </>
            )}
        </div>
    );
}