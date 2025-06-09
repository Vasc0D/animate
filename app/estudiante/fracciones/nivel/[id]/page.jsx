"use client";
import { useEffect, useState } from "react";
import TutorChat from "./tutorchat";
import { useRouter } from "next/navigation";

export default function NivelFracciones({ params }) {
  const nivel = parseInt(params.id);
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seleccion, setSeleccion] = useState(null);        // índice opción seleccionada
  const [resultado, setResultado] = useState(null);        // 'correcto' | 'incorrecto' | null
  const router = useRouter();

  useEffect(() => {
    setSeleccion(null);
    setResultado(null);
    setLoading(true);
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

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFF5EB] to-[#FFF1E7] text-[#FF7A00]">
      Cargando ejercicios…
    </div>
  );

  if (!ejercicios.length) return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#FFF5EB] to-[#FFF1E7] text-gray-700">
      No hay ejercicios para este nivel.
    </div>
  );

  const ejercicio = ejercicios[0];

  const manejarSeleccion = async (index) => {
    if (seleccion !== null) return;  // prevenir re-selección
  
    setSeleccion(index);
    const opcionElegida = ejercicio.opciones[index];
  
    if (opcionElegida === ejercicio.respuesta_correcta) {
      setResultado("correcto");
  
      try {
        // Llama al endpoint para desbloquear el siguiente nivel
        const email = localStorage.getItem("email"); // o si tienes email en estado/propiedades, úsalo
        const res = await fetch("http://localhost:5001/user/desbloquear_nivel", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            tema: "fracciones",
            nivel_actual: nivel,
          }),
        });
  
        if (!res.ok) {
          console.error("Error desbloqueando nivel:", await res.text());
        } else {
          const data = await res.json();
          console.log("Niveles desbloqueados actualizados:", data);
        }
      } catch (err) {
        console.error("Error en fetch desbloquear nivel:", err);
      }
    } else {
      setResultado("incorrecto");
    }
  };  

  // Función para avanzar al siguiente nivel (redirigir a /fracciones/nivel/{nivel+1})
  const siguienteNivel = () => {
    router.push(`/estudiante/fracciones/nivel/${nivel + 1}`);
  };

  // Función para volver a la lista de niveles
  const volverANiveles = () => {
    router.push("/estudiante/fracciones/niveles");
  };

  // --- RENDERIZADO ---

  // Si el resultado es correcto, mostramos mensaje felicitación y botones
  if (resultado === "correcto") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#FFF5EB] to-[#FFF1E7] p-6">
        <div className="w-full max-w-md rounded-2xl bg-[#FF9E2C] p-8 shadow-2xl text-center text-white font-bold text-xl">
          FELICIDADES!!! <br />
          Terminaste el nivel {nivel} <br />
          ya puedes seguir con el nivel {nivel + 1}!
        </div>
        <div className="mt-8 flex gap-4">
          <button
            onClick={siguienteNivel}
            className="rounded-full bg-[#FF7A00] px-6 py-3 font-semibold text-white hover:bg-[#ff8c1a] transition"
          >
            Siguiente Nivel
          </button>
          <button
            onClick={volverANiveles}
            className="rounded-full bg-white px-6 py-3 font-semibold text-[#FF7A00] hover:bg-orange-100 transition"
          >
            Volver a los niveles
          </button>
        </div>
      </div>
    );
  }

  // Si el resultado es incorrecto, podemos mostrar un mensaje simple, y dejar que intente otra vez o volver
  if (resultado === "incorrecto") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#FFF5EB] to-[#FFF1E7] p-6 text-[#FF7A00] text-center">
        <p className="text-2xl font-bold mb-6">Respuesta incorrecta 😞</p>
        <p className="mb-6">Inténtalo de nuevo o vuelve a los niveles.</p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setSeleccion(null);
              setResultado(null);
            }}
            className="rounded-full bg-[#FF7A00] px-6 py-3 font-semibold text-white hover:bg-[#ff8c1a] transition"
          >
            Intentar otra vez
          </button>
          <button
            onClick={volverANiveles}
            className="rounded-full bg-white px-6 py-3 font-semibold text-[#FF7A00] hover:bg-orange-100 transition"
          >
            Volver a los niveles
          </button>
        </div>
      </div>
    );
  }

  // --- Mostrar ejercicio y opciones normales ---

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

        <div className="space-y-3">
          {ejercicio.opciones.map((op, i) => {
            const seleccionado = i === seleccion;
            return (
              <button
                key={i}
                onClick={() => manejarSeleccion(i)}
                disabled={seleccion !== null}
                className={`
                  w-full rounded-full px-4 py-3 text-left font-medium transition
                  ${
                    seleccionado
                      ? op === ejercicio.respuesta_correcta
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                      : "bg-[#FFE0C2] text-gray-800 hover:bg-[#FF7A00] hover:text-white"
                  }
                `}
              >
                {op}
              </button>
            );
          })}
        </div>

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
