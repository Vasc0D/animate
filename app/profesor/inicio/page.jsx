  // app/profesor/inicio/page.jsx
"use client";
import Link from "next/link";
  
  export default function InicioProfesor() {
    const secciones = [
      { label: "A", id: "A" },
      { label: "B", id: "B" },
      { label: "C", id: "C" },
      { label: "D", id: "D" },
    ];
    
    return (
      <main className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
        <h1 className="text-4xl font-bold bg-orange-400 text-white px-10 py-2 rounded-full mb-8 shadow-md">
          MATEMÁTICAS
        </h1>

        <div className="space-y-4 w-full max-w-md">
          {secciones.map((s) => (
            <Link
              key={s.id}
              href={`/profesor/seccion/${s.id}`}
              className="flex items-center justify-between bg-orange-400 text-white px-6 py-3 rounded-full shadow hover:bg-orange-500"
            >
              <span className="text-xl font-bold">SECCIÓN {s.label}</span>
              <span className="text-2xl">➡️</span>
            </Link>
          ))}
        </div>
  
        <div className="mt-12 flex gap-16 items-center">
          <img src="/images/cuy.png" alt="cuy" className="w-24" />
          <img src="/images/capibara.png" alt="capibara" className="w-24" />
        </div>
      </main>
    );
  }
  