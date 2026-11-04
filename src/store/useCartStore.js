import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      keranjang: [],
      diskonPersen: 0,

      // 1. Tambah Barang (Jika sudah ada di keranjang, tambahkan qty-nya)
      tambahBarang: (produk) => {
        const daftarSekarang = get().keranjang;
        const sudahAda = daftarSekarang.find((item) => item.id === produk.id);

        if (sudahAda) {
          set({
            keranjang: daftarSekarang.map((item) =>
              item.id === produk.id ? { ...item, qty: item.qty + 1 } : item
            ),
          });
        } else {
          set({ keranjang: [...daftarSekarang, { ...produk, qty: 1 }] });
        }
      },

      // 2. Kurangi Qty atau Hapus Barang jika qty sisa 1
      kurangiBarang: (idProduk) => {
        const daftarSekarang = get().keranjang;
        const target = daftarSekarang.find((item) => item.id === idProduk);

        if (target && target.qty > 1) {
          set({
            keranjang: daftarSekarang.map((item) =>
              item.id === idProduk ? { ...item, qty: item.qty - 1 } : item
            ),
          });
        } else {
          set({ keranjang: daftarSekarang.filter((item) => item.id !== idProduk) });
        }
      },

      // 3. Kosongkan Semua Keranjang /persen ilang
      resetKeranjang: () => set({ keranjang: [], diskonPersen: 0 }),

      pakaiVoucher: (kode) => {
        if (kode.trim().toUpperCase() === "TAKUMIHEBAT") {
          set({ diskonPersen: 20 }); // 3. benar
          return true;

          set({ diskonPersen: 0 }); // 3. salah
          return false;
        }
      }
    }),
    {
      name: 'penyimpanan-keranjang-takumi', // Nama kunci otomatis di localStorage!
    }
  )
);