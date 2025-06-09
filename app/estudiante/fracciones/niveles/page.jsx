// fracciones/niveles/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const TOTAL_NIVELES = 30;

export default function FraccionesNiveles() {
  const [testRealizado, setTestRealizado] = useState(null);
  const [nivelesDesbloqueados, setNiveles] = useState([]);
  const [nivelGeneral, setNivelGeneral] = useState("");

  const email =
    typeof window !== "undefined" ? localStorage.getItem("email") : null;

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
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFF5EB] to-[#FFF1E7] text-[#FF7A00]">
        Cargando niveles…
      </div>
    );
  }

  // Si no hizo el test lo redirigimos al test diagnóstico
  if (testRealizado === false) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#FFF5EB] to-[#FFF1E7] p-8">
        <p className="mb-4 text-xl text-gray-700">
          Primero completa el test diagnóstico
        </p>
        <Link
          href="/estudiante/fracciones/test_diagnostico"
          className="rounded-full bg-[#FF7A00] px-6 py-3 text-white font-semibold hover:bg-[#ff8c1a] transition"
        >
          Ir al Test
        </Link>
      </div>
    );
  }

  // Lista completa de niveles 1…30
  const niveles = Array.from({ length: TOTAL_NIVELES }, (_, i) => i + 1);

  return (
    <main className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#FFF5EB] to-[#FFF1E7] p-6">
      {/* Header */}
      <div className="mb-8 flex w-full max-w-2xl items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-[#FF7A00]">
          ← Volver
        </Link>
        <h1 className="text-3xl font-extrabold text-[#FF7A00]">
          NIVELES: Fracciones
        </h1>
        <div style={{ width: 24 }} /> {/* espaciador invisible */}
      </div>

      {/* Indicador de nivel general */}
      <div className="mb-8 text-center text-gray-800">
        <p>
          Has alcanzado el nivel{" "}
          <span className="font-bold text-xl">{nivelGeneral}</span>
        </p>
      </div>

      {/* ------------------------------------------------------
          Aquí empieza el “caminito” horizontal desplegable
          ------------------------------------------------------ */}
      <div className="w-full max-w-3xl overflow-x-auto">
        <div className="relative flex items-center px-4 py-6">
          {/** Para cada nivel: círculo + (si no es el último) rayita de conexión **/}
          {niveles.map((n, i) => {
            const desbloqueado = nivelesDesbloqueados.includes(n);

            return (
              <div key={n} className="flex items-center">
                {/**  
                    1) El “círculo” del nivel 
                    - Si está desbloqueado → botón naranja 
                    - Si no → círculo gris  
                **/}
                {desbloqueado ? (
                  <Link
                    href={`/estudiante/fracciones/nivel/${n}`}
                    className="
                      relative 
                      flex 
                      h-12 
                      w-12 
                      items-center 
                      justify-center 
                      rounded-full 
                      bg-[#FF7A00] 
                      text-white 
                      font-bold 
                      hover:bg-[#ff8c1a] 
                      transition
                      shadow-lg
                    "
                  >
                    {n}
                  </Link>
                ) : (
                  <div
                    className="
                      relative 
                      flex 
                      h-12 
                      w-12 
                      items-center 
                      justify-center 
                      rounded-full 
                      bg-gray-300 
                      text-gray-500 
                      cursor-not-allowed
                      shadow-inner
                    "
                    title="Nivel bloqueado"
                  >
                    {n}
                  </div>
                )}

                {/**
                  2) Si NO es el último nivel, dibujamos la “línea” que conecta al siguiente:
                  - Es un pequeño div de 8px de alto por 40px de ancho (puedes ajustar las medidas)
                  - Centramos verticalmente con “mx-2”
                  - Background gris claro; si el siguiente nivel está desbloqueado, la hacemos naranja
                **/}
                {i < TOTAL_NIVELES - 1 && (
                  <div
                    className={`
                      h-1 
                      w-10 
                      ${
                        nivelesDesbloqueados.includes(n + 1)
                          ? "bg-[#FF7A00]"
                          : "bg-gray-300"
                      } 
                      mx-2
                    `}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* ------------------------------------------------------
          Fin del “caminito” horizontal
          ------------------------------------------------------ */}

      {/**  
        Si quisieras un zig-zag (2 filas alternadas), podrías “romper” el array
        en sub-arrays: [1..10], [11..20], [21..30] y aplicar lógica parecida 
        (con flex-wrap o grid). Pero esta versión horizontal es 100% funcional y 
        ocupa menos código.  
      **/}
    </main>
  );
}
