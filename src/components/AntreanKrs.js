"use client"

import { useState, useEffect } from 'react';

export default function AntreanKrs() { 
    const [antreanKrs, setAntreanKrs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(async () => {
        setIsLoading(true)

        const respon = await fetch('https://jsonplaceholder.typicode.com/todos?_limit=5', {
            cache: 'no-store',
        });
        const daftarDosen = await respon.json();
        setAntreanKrs(daftarDosen)
        setIsLoading(false)
    }, []);

    return (
        <ul>
        {!isLoading ? (
        antreanKrs.map((tugas) => (
          <li key={tugas.id}>
            Tiket #{tugas.id}: {tugas.title} —{' '}
            <strong>{tugas.completed ? '✅ Selesai' : '⏳ Mengantre'}</strong>
          </li>
        ))
         ) : 'Sedang Loading ...'}
      </ul>
    )
}