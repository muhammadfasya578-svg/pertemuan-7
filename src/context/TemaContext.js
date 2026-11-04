'use client';

import { createContext, useContext, useEffect, useState } from 'react';

// 1. Buat "wadah" Context
const TemaContext = createContext();

// 2. Provider: pembungkus yang menyimpan state tema
export function TemaProvider({ children }) {
  const [tema, setTema] = useState('terang');

  // Saat pertama dibuka, baca pilihan tema yang tersimpan di localStorage
  useEffect(() => {
    try {
      const tersimpan = localStorage.getItem('tema-takumi');
      if (tersimpan === 'gelap' || tersimpan === 'terang') {
        setTema(tersimpan);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Setiap tema berubah, pasang ke <html> dan simpan ke localStorage
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-tema', tema);
      localStorage.setItem('tema-takumi', tema);
    } catch (e) {
      console.error(e);
    }
  }, [tema]);

  const gantiTema = () => setTema((prev) => (prev === 'terang' ? 'gelap' : 'terang'));
  const ubahTema = gantiTema;
  const temaGelap = tema === 'gelap';

  return (
    <TemaContext.Provider value={{ tema, gantiTema, temaGelap, ubahTema }}>
      {children}
    </TemaContext.Provider>
  );
}

// 3. Hook singkat supaya komponen mudah memakainya
export function useTema() {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error('useTema harus digunakan di dalam TemaProvider');
  }
  return context;
}
