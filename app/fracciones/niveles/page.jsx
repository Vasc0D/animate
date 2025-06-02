// fracciones//niveles/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const TOTAL_NIVELES = 30;

export default function FraccionesNiveles({}) {
  const [testRealizado, setTestRealizado]       = useState(null);
  const [nivelesDesbloqueados, setNiveles]      = useState([]);
  const [nivelGeneral,        setNivelGeneral]  = useState("");

  const email = typeof window !== "undefined" ? localStorage.getItem("email") : null;

  // Al montar, consultamos si el alumno ya hizo el diagnóstico
  useEffect(() => {
    fetch("http://localhost:5001/user/test-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, tema: "fracciones" }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.test_realizado) {
          setTestRealizado(true);
          setNiveles(data.niveles_desbloqueados);
          setNivelGeneral(data.nivel_general);
        } else {
          // Si no hizo test, lo mandamos primero al diagnóstico
          setTestRealizado(false);
        }
      })
      .catch(() => {
        setTestRealizado(false);
      });
  }, [email]);

  // Mientras esperamos la respuesta
  if (testRealizado === null) {
    return <div className="p-8">Cargando niveles…</div>;
  }

  // Si no hizo el test lo redirigimos al test diagnóstico
  if (testRealizado === false) {
    // podrías usar router.push("/fracciones/test-inicial")
    return (
      <div className="p-8 text-center">
        <p className="mb-4">Primero completa el test diagnóstico</p>
        <Link
          href="/fracciones/test_diagnostico"
          className="bg-orange-400 text-white px-6 py-2 rounded-full"
        >
          Ir al Test
        </Link>
      </div>
    );
  }

  // Una vez hecho el test, renderizamos la lista de 1…30
  const niveles = Array.from({ length: TOTAL_NIVELES }, (_, i) => i + 1);

  return (
    <main className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="flex justify-between items-center w-full max-w-2xl mb-8">
        <Link href="/" className="text-2xl">←</Link>
        <h1 className="text-3xl font-bold text-black">NIVELES: Fracciones</h1>
        <div style={{ width: 24 }} /> {/* espaciador */}
      </div>

      {/* Indicador de nivel general */}
      <div className="mb-8 text-black">
        <p>
          Has alcanzado el nivel{" "}
          <span className="font-bold text-xl">{nivelGeneral}</span>
        </p>
      </div>

      {/* Grid de niveles */}
      <div className="grid grid-cols-6 gap-4 w-full max-w-2xl">
        {niveles.map((n) => {
          const desbloqueado = nivelesDesbloqueados.includes(n);
          return (
            <div key={n} className="flex justify-center">
              {desbloqueado ? (
                <Link
                  href={`/fracciones/nivel/${n}`}
                  className="flex items-center justify-center w-12 h-12 bg-orange-400 text-white rounded-full font-bold hover:bg-orange-500 transition"
                >
                  {n}
                </Link>
              ) : (
                <div
                  className="flex items-center justify-center w-12 h-12 bg-gray-300 text-gray-600 rounded-full cursor-not-allowed"
                  title="Nivel bloqueado"
                >
                  {n}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
