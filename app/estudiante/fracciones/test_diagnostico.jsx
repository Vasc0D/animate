"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TestDiagnostico() {
  const [preguntas, setPreguntas]   = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const router = useRouter();
  const email =
    typeof window !== "undefined" ? localStorage.getItem("email") : null;

  /* ──────── Cargar preguntas ──────── */
  useEffect(() => {
    fetch("http://localhost:5001/test/fracciones")
      .then((res) => res.json())
      .then((data) => {
        setPreguntas(data.preguntas || []);
        setRespuestas(new Array(data.preguntas.length).fill(""));
      });
  }, []);

  const handleChange = (idx, val) => {
    const nuevas = [...respuestas];
    nuevas[idx] = val;
    setRespuestas(nuevas);
  };

  const handleSubmit = async () => {
    const res = await fetch(
      "http://localhost:5001/test/fracciones/resultados",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, respuestas }),
      }
    );
    const data = await res.json();
    router.push(
      `/fracciones/resultado?puntaje=${data.puntaje}&nivel=${data.nivel}`
    );
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-b from-[#FFF5EB] to-[#FFF1E7] p-6">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-8 shadow-2xl">
        <h1 className="mb-8 text-center text-3xl font-extrabold text-[#FF7A00]">
          Test Diagnóstico de Fracciones
        </h1>

        {preguntas.map((preg, idx) => (
          <div key={idx} className="mb-6">
            <p className="mb-2 font-medium text-black">
              {idx + 1}. {preg.enunciado}
            </p>
            <input
              type="text"
              value={respuestas[idx]}
              onChange={(e) => handleChange(idx, e.target.value)}
              placeholder="Ej. 3/4"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-[#FF7A00] focus:outline-none focus:ring-2 text-black"
            />
          </div>
        ))}

        <button
          onClick={handleSubmit}
          disabled={!preguntas.length}
          className="mt-4 w-full rounded-lg bg-[#FF7A00] py-3 text-lg font-semibold text-white transition hover:bg-[#ff8c1a] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Enviar respuestas
        </button>
      </div>
    </div>
  );
}
