// app/profesor/seccion/[sectionId]/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SeccionProfesor() {
  const { sectionId } = useParams();

  // — estados para crear actividad
  const [isModalOpen, setIsModalOpen]     = useState(false);
  const [statement, setStatement]         = useState("");
  const [options, setOptions]             = useState(["", ""]);
  const [correctIndex, setCorrectIndex]   = useState(null);

  // — estados para mostrar progreso
  const [isProgOpen, setIsProgOpen]       = useState(false);
  const [progressData, setProgressData]   = useState(null);

  // Helpers creación
  const addOption = () => setOptions([...options, ""]);
  const updateOption = (i, v) => {
    const copy = [...options]; copy[i] = v; setOptions(copy);
  };

  // 1️⃣ Crear actividad
  const submitActivity = async () => {
    if (
      !statement.trim() ||
      options.some((o) => !o.trim()) ||
      correctIndex === null
    ) {
      return alert("Rellena todo y marca la opción correcta");
    }
    try {
      const res = await fetch("http://localhost:5001/actividades/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionId,
          statement,
          options,
          correctIndex,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      // reset
      setStatement("");
      setOptions(["", ""]);
      setCorrectIndex(null);
      setIsModalOpen(false);
    } catch (e) {
      alert("Error creando actividad: " + e.message);
    }
  };

  // 2️⃣ Cargar progreso de la última actividad
  const loadProgress = async () => {
    try {
      // a) traer lista de actividades
      const resActs = await fetch(
        `http://localhost:5001/actividades?sectionId=${sectionId}`
      );
      const { actividades } = await resActs.json();
      if (!actividades.length) {
        setProgressData(null);
        setIsProgOpen(true);
        return;
      }

      // b) tomar la más reciente (asumiendo orden by createdAt desc)
      const latest = actividades[0];
      // c) fetch progreso
      const resProg = await fetch(
        `http://localhost:5001/actividades/${latest._id}/progreso`
      );
      const dataProg = await resProg.json();

      setProgressData({
        statement: latest.statement,
        ...dataProg,
      });
      setIsProgOpen(true);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="min-h-screen bg-orange-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold bg-orange-400 text-white px-10 py-2 rounded-full mb-8 shadow-md">
        SECCIÓN {sectionId}
      </h1>

      <div className="space-y-4 w-full max-w-md">
        <Link
          href={`/profesor/seccion/${sectionId}/estudiantes`}
          className="flex items-center justify-between bg-orange-400 text-white px-6 py-3 rounded-full shadow hover:bg-orange-500"
        >
          <span className="text-xl font-bold">ESTUDIANTES</span>
          <span className="text-2xl">➡️</span>
        </Link>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full flex items-center justify-between bg-orange-400 text-white px-6 py-3 rounded-full shadow hover:bg-orange-500"
        >
          <span className="text-xl font-bold">DEJAR ACTIVIDAD</span>
          <span className="text-2xl">➡️</span>
        </button>

        <button
          onClick={loadProgress}
          className="w-full flex items-center justify-between bg-green-500 text-white px-6 py-3 rounded-full shadow hover:bg-green-600"
        >
          <span className="text-xl font-bold">Actividad en progreso ahora</span>
          <span className="text-2xl">📊</span>
        </button>

        <Link
          href={`/profesor/seccion/${sectionId}/reportes`}
          className="flex items-center justify-between bg-orange-400 text-white px-6 py-3 rounded-full shadow hover:bg-orange-500"
        >
          <span className="text-xl font-bold">REPORTES</span>
          <span className="text-2xl">➡️</span>
        </Link>
      </div>

      {/* Modal Creación */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-5"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-black">Nueva actividad</h2>
            <textarea
              placeholder="Enunciado…"
              value={statement}
              onChange={(e) => setStatement(e.target.value)}
              className="w-full border rounded p-2 mb-4 text-black"
            />
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-2 mb-2 text-black">
                <input
                  type="text"
                  placeholder={`Opción ${i + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(i, e.target.value)}
                  className="flex-1 border rounded p-2"
                />
                <label className="flex items-center gap-1">
                  <input
                    type="radio"
                    name="correct"
                    checked={correctIndex === i}
                    onChange={() => setCorrectIndex(i)}
                  />
                  Correcta
                </label>
              </div>
            ))}
            <button onClick={addOption} className="underline mb-4 text-black">
              + Añadir opción
            </button>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black"
              >
                Cancelar
              </button>
              <button
                onClick={submitActivity}
                className="px-4 py-2 rounded bg-orange-400 text-white hover:bg-orange-500"
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Progreso */}
      {isProgOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setIsProgOpen(false)}
        >
          <div
            className="bg-white p-6 rounded-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold mb-4 text-black">Progreso de la actividad</h2>

            {!progressData && (
              <p>No hay actividades recientes en los últimos 10 min.</p>
            )}

            {progressData && (
              <>
                <p className="font-semibold mb-2 text-black">
                  {progressData.statement}
                </p>
                <p className="mb-4 text-black">
                  {progressData.totalRespondidos} de{" "}
                  {progressData.totalAlumnos} alumnos entregaron.
                </p>
                <ul className="space-y-1 mb-4 text-black">
                  {progressData.distribution.map((d) => (
                    <li key={d.option}>
                      Opción {d.option + 1}: {d.count} respuestas
                    </li>
                  ))}
                </ul>
              </>
            )}

            <div className="flex justify-end">
              <button
                onClick={() => setIsProgOpen(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-black"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
