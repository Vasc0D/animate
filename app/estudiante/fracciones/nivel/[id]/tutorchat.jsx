"use client";
import { useState } from "react";

export default function TutorChat({ enunciado, opciones, imagen }) {
  const [pregunta, setPregunta] = useState("");
  const [respuestas, setRespuestas] = useState([]);
  const [cargando, setCargando] = useState(false);

  const enviarPregunta = async (e) => {
    e.preventDefault();
    if (!pregunta.trim()) return;
    setCargando(true);

    setRespuestas((r) => [...r, { rol: "user", texto: pregunta }]);

    // Arma el contexto
    let contexto = `Enunciado del ejercicio: ${enunciado}. `;
    if (opciones && opciones.length) contexto += `Opciones: ${opciones.join(", ")}. `;
    if (imagen) contexto += `Imagen: ${imagen}. `;
    contexto += `\nPregunta del alumno: ${pregunta}`;

    try {
      const res = await fetch("http://localhost:5001/openai/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pregunta: contexto }),
      });
      const data = await res.json();
      setRespuestas((r) => [...r, { rol: "tutor", texto: data.respuesta }]);
    } catch (err) {
      setRespuestas((r) => [...r, { rol: "tutor", texto: "Error al conectar con el tutor IA." }]);
    }
    setPregunta("");
    setCargando(false);
  };

  return (
    <div className="mt-10 w-full max-w-xl mx-auto bg-gray-50 rounded-xl p-4 shadow-md">
      <h2 className="text-lg font-bold mb-2 text-orange-700">¿Tienes dudas? Pregunta al tutor IA:</h2>
      <div className="max-h-56 overflow-y-auto bg-white rounded p-2 mb-2 border border-orange-100 text-black">
        {respuestas.map((msg, i) => (
          <div key={i} className={`mb-2 ${msg.rol === "user" ? "text-right" : "text-left"}`}>
            <span className={msg.rol === "user" ? "text-blue-800" : "text-green-700 font-semibold"}>
              {msg.rol === "user" ? "Tú: " : "Tutor: "}
            </span>
            <span>{msg.texto}</span>
          </div>
        ))}
      </div>
      <form onSubmit={enviarPregunta} className="flex gap-2">
        <input
          className="flex-1 border rounded p-2 text-black"
          type="text"
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Escribe tu pregunta sobre este nivel..."
          disabled={cargando}
        />
        <button
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
          type="submit"
          disabled={cargando}
        >
          {cargando ? "Enviando..." : "Preguntar"}
        </button>
      </form>
    </div>
  );
}
