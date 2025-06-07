// app/estudiante/inicio/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function InicioEstudiante() {
  // Tomamos el email que guardaste en localStorage al hacer login
  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("email")
      : null;

  const [pending, setPending] = useState(null);
  const [open, setOpen] = useState(false);
  const [choice, setChoice] = useState(null);

  // 1️⃣ Polling para revisar si hay actividad pendiente en los últimos 10 minutos
  useEffect(() => {
    if (!email) return;
    async function loadPending() {
      try {
        const res = await fetch(
          `http://localhost:5001/actividades/pending?email=${encodeURIComponent(
            email
          )}`
        );
        if (!res.ok) return;
        const { pending } = await res.json();
        setPending(pending);
      } catch (err) {
        console.error("Error cargando actividad pendiente:", err);
      }
    }
    loadPending();
    const iv = setInterval(loadPending, 15_000); // cada 15 s
    return () => clearInterval(iv);
  }, [email]);

  // 2️⃣ Enviar respuesta (POST /actividades/:id/respuesta)
  const submitResponse = async () => {
    if (choice == null || !pending) return;

    const activityId = pending.activity._id;
    const res = await fetch(
      `http://localhost:5001/actividades/${activityId}/respuesta`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          answerIndex: choice
        }),
      }
    );

    if (res.ok) {
      setOpen(false);
      setPending(null);
      setChoice(null);
    } else {
      console.error("Error al entregar:", await res.text());
    }
  };

  return (
    <main className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
      {/* Header con botón atrás, título y campanita */}
      <div className="flex justify-between items-center w-full max-w-4xl mb-8">
        <Link
          href="/"
          className="bg-orange-300 rounded-full w-12 h-12 flex items-center justify-center shadow hover:bg-orange-400"
        >
          ←
        </Link>

        <h1 className="bg-orange-400 text-white text-3xl font-bold px-8 py-2 rounded-full shadow">
          MATEMÁTICAS
        </h1>

        <div className="w-12 relative flex justify-center">
          {pending && (
            <button onClick={() => setOpen(true)}>
              <Bell className="w-8 h-8 text-orange-400 hover:text-orange-500" />
              <span className="absolute top-0 right-0 block w-2 h-2 bg-red-600 rounded-full" />
            </button>
          )}
        </div>
      </div>

      {/* Menú de temas */}
      <div className="space-y-4 w-full max-w-md">
        <Link
          href="/estudiante/fracciones"
          className="flex items-center justify-between bg-orange-400 text-white px-6 py-3 rounded-full shadow hover:bg-orange-500"
        >
          <span className="text-xl font-bold">FRACCIONES</span>
          <span className="text-2xl">➡️</span>
        </Link>
      </div>

      {/* Imágenes decorativas */}
      <div className="mt-12 flex gap-16 items-center">
        <img src="/images/cuy.png" alt="cuy" className="w-24" />
        <img src="/images/capibara.png" alt="capibara" className="w-24" />
      </div>

      {/* Modal de actividad pendiente */}
      {open && pending && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-black">Actividad disponible</h2>
            <p className="mb-4 text-black">{pending.activity.statement}</p>

            <div className="space-y-2 mb-4">
              {pending.activity.options.map((opt, i) => (
                <label key={i} className="flex items-center gap-2 text-black">
                  <input
                    type="radio"
                    name="actividad"
                    checked={choice === i}
                    onChange={() => setChoice(i)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>

            <div className="flex justify-end gap-2 text-white">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-100"
              >
                Cancelar
              </button>
              <button
                disabled={choice == null}
                onClick={submitResponse}
                className="px-4 py-2 rounded bg-orange-400 text-white hover:bg-orange-500 disabled:opacity-100"
              >
                Enviar (10 min ⏱)
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
