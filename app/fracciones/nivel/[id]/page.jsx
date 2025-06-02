"use client";
import { useEffect, useState } from "react";
import TutorChat from "./tutorchat";

export default function NivelFracciones({ params }) {
  /* ─────────────  estado y carga de datos  ───────────── */
  const nivel = parseInt(params.id);
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/ejercicios/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tema: "fracciones", nivel }),
    })
      .then((res) => res.json())
      .then((data) => {
        setEjercicios(data.ejercicios || []);
        setLoading(false);
      });
  }, [nivel]);

  /* ─────────────  vistas de carga / vacío  ───────────── */
  if (loading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFF5EB] to-[#FFF1E7] text-[#FF7A00]">
        Cargando ejercicios…
      </div>
    );

  if (!ejercicios.length)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFF5EB] to-[#FFF1E7] text-gray-700">
        No hay ejercicios para este nivel.
      </div>
    );

  /* ─────────────  ejercicio actual  ───────────── */
  const ejercicio = ejercicios[0];

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#FFF5EB] to-[#FFF1E7] p-6">
      <div className="w-full max-w-xl rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="mb-6 text-center text-3xl font-extrabold text-[#FF7A00]">
          Nivel {nivel}
        </h1>

        <p className="mb-4 text-gray-800">{ejercicio.enunciado}</p>

        {ejercicio.imagen_url && (
          <img
            src={ejercicio.imagen_url}
            alt="Ejercicio"
            className="mx-auto mb-6 max-h-60 rounded-lg shadow"
          />
        )}

        {/* ────── opciones de respuesta ────── */}
        <div className="space-y-3">
          {ejercicio.opciones.map((op, i) => (
            <button
              key={i}
              className="w-full rounded-full bg-[#FFE0C2] px-4 py-3 text-left font-medium text-gray-800 transition hover:bg-[#FF7A00] hover:text-white"
              /* Aquí puedes añadir lógica de selección */
            >
              {op}
            </button>
          ))}
        </div>

        {/* ────── chat tutor IA ────── */}
        <div className="mt-8">
          <TutorChat
            enunciado={ejercicio.enunciado}
            opciones={ejercicio.opciones}
            imagen={ejercicio.imagen_url}
          />
        </div>
      </div>
    </div>
  );
}
