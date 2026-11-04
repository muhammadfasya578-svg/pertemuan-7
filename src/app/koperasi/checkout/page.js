'use client';

import { useState } from 'react';

import Link from 'next/link';
import { useCartStore } from '@/store/useCartStore';

export default function HalamanCheckout() {
  const { keranjang, diskonPersen, pakaiVoucher, resetKeranjang } = useCartStore();
  const [kode, setKode] = useState('');
  const [pesan, setPesan] = useState('');
  const [berhasil, setBerhasil] = useState(false);
  const [struk, setStruk] = useState({ total: 0, jumlah: 0 });

  const subtotal = keranjang.reduce((sum, item) => sum + item.harga * item.qty, 0);
  const potongan = (subtotal * diskonPersen) / 100;
  const totalBayar = subtotal - potongan;

  const handleVoucher = () => {
    const berhasil = pakaiVoucher(kode);
    setPesan(berhasil ? 'Voucher Berhasil! Diskon 20% Diterapkan.' : 'Kode Voucher Tidak Valid');
  };

  const handleBayar = () => {
    setStruk({
      total: totalBayar,
      jumlah: keranjang.reduce((sum, item) => sum + item.qty, 0),
    });

    setBerhasil(true);

    resetKeranjang();
    setKode('');
    setPesan('');
  };


  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>💳 Halaman Checkout Pembayaran</h1>
      <p>Perhatikan: Meskipun kita sudah pindah halaman, data dari Zustand tetap terbaca utuh!</p>

      <ul>
        {keranjang.map((item) => (
          <li key={item.id}>
            {item.nama} ({item.qty} pcs) — <strong>Rp {(item.harga * item.qty).toLocaleString('id-ID')}</strong>
          </li>
        ))}
      </ul>

      <h3>Total yang Harus Dibayar: Rp {totalBayar.toLocaleString('id-ID')}</h3>

      <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
        <input
          value={kode}
          onChange={(e) => setKode(e.target.value)}
          placeholder="Masukkan kode voucher"
          style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid #cbd5e1' }}
        />
        <button onClick={handleVoucher} style={{ padding: '8px 14px', borderRadius: 6, border: 'none', background: '#2563eb', color: 'white', cursor: 'pointer' }}>
          Pakai
        </button>
      </div>
      {pesan && <p>{pesan}</p>}

      <p>Subtotal: Rp {subtotal.toLocaleString('id-ID')}</p>
      {diskonPersen > 0 && (
        <p style={{ color: '#16a34a' }}>
          Diskon {diskonPersen}%: − Rp {potongan.toLocaleString('id-ID')}
        </p>
      )}

      <div style={{ display: 'flex', gap: '12px' }}>
        <Link href="/koperasi" style={{ padding: '10px 16px', background: '#e2e8f0', borderRadius: '6px', textDecoration: 'none', color: '#0f172a' }}>
          ← Kembali Belanja
        </Link>
        <button
          onClick={handleBayar}
          disabled={keranjang.length === 0}
          style={{ padding: '10px 20px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          ✅ Bayar Sekarang
        </button>
      </div>

      {berhasil && (
        <div className="overlay-sukses">
          <div className="kartu-sukses">
            <div className="lingkaran-centang">✓</div>
            <h2 style={{ margin: '16px 0 8px' }}>Pembayaran Berhasil!</h2>
            <p style={{ margin: 0 }}>Terima kasih sudah berbelanja di Koperasi Takumi.</p>
            <p style={{ margin: '12px 0 0' }}>{struk.jumlah} barang dibeli</p>
            <p style={{ margin: '4px 0 20px', fontWeight: 'bold', fontSize: 18 }}>
              Total dibayar: Rp {struk.total.toLocaleString('id-ID')}
            </p>
            <Link
              href="/koperasi"
              style={{ display: 'inline-block', padding: '10px 20px', background: '#2563eb', color: 'white', borderRadius: 6, textDecoration: 'none', fontWeight: 'bold' }}
            >
              Kembali ke Koperasi
            </Link>
          </div>
        </div>
      )}

      <style>{`
  .overlay-sukses {
    position: fixed; inset: 0;
    background: rgba(0, 0, 0, 0.55);
    display: flex; align-items: center; justify-content: center;
    z-index: 100;
    animation: muncul 0.25s ease-out;
  }
  .kartu-sukses {
    background: white; color: #0f172a;
    padding: 32px 40px; border-radius: 16px;
    text-align: center; max-width: 380px; width: 90%;
    animation: pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .lingkaran-centang {
    width: 80px; height: 80px; margin: 0 auto;
    border-radius: 50%; background: #16a34a; color: white;
    font-size: 44px; line-height: 80px; font-weight: bold;
    animation: denyut 1.2s ease-out 0.4s;
  }
  @keyframes muncul { from { opacity: 0; } to { opacity: 1; } }
  @keyframes pop { from { transform: scale(0.6); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  @keyframes denyut {
    0%   { box-shadow: 0 0 0 0 rgba(22, 163, 74, 0.6); }
    100% { box-shadow: 0 0 0 28px rgba(22, 163, 74, 0); }
  }
`}</style>
    </div>
  );
}