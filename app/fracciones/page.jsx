// fracciones/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TestDiagnostico from "./test_diagnostico";

const rangosNiveles = {
  básico: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  intermedio: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  avanzado: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
};

export default function Fracciones({}) {
  const [testRealizado, setTestRealizado] = useState(null);
  const [nivelesDesbloqueados, setNivelesDesbloqueados] = useState([]);
  const [nivelGeneral, setNivelGeneral] = useState("");
  const router = useRouter();
  const [email, setEmail] = useState(null);

  // Carga el email solo en el cliente
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const mail = localStorage.getItem("email");
      setEmail(mail);
      console.log("email leído de localStorage (efecto):", mail);
    }
  }, []);

  // Al montar, consultamos si el alumno ya hizo el test
  useEffect(() => {
    if (!email) return;
    fetch("http://localhost:5001/user/test-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, tema: "fracciones" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.test_realizado) {
          setTestRealizado(true);
          setNivelesDesbloqueados(data.niveles_desbloqueados);
          setNivelGeneral(data.nivel_general);
        } else {
          setTestRealizado(false);
        }
      })
      .catch(() => {
        // En caso de error, consideramos que no hizo el test
        setTestRealizado(false);
      });
  }, [email]);

  // Cuando el TestDiagnostico llama a onTerminar
  const onTerminar = ({ preguntas, respuestas }) => {
    // Calculamos score
    const score = preguntas.reduce((sum, p) => {
      const respuesta = respuestas[p.id]?.trim().toLowerCase();
      const correcta = p.respuesta_correcta.trim().toLowerCase();
      return sum + (respuesta === correcta ? p.valor : 0);
    }, 0);

    // Determinamos nivel general y desbloqueos
    const claveNivel =
      score <= 7 ? "básico" : score <= 14 ? "intermedio" : "avanzado";
    const desbloqueados = rangosNiveles[claveNivel];

    // Guardamos en backend
    fetch("/user/guardar_test_diagnostico", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        tema: "fracciones",
        score,
        niveles_desbloqueados: desbloqueados,
        nivel_general: claveNivel,
      }),
    })
      .then(() => {
        setTestRealizado(true);
        setNivelesDesbloqueados(desbloqueados);
        setNivelGeneral(claveNivel);
      })
      .catch((err) => {
        console.error("Error guardando diagnóstico:", err);
      });

      // Redirigir a la página de resultado pasándole puntaje, nivel y lista
      const params = new URLSearchParams({
        puntaje: String(score),
        nivel: claveNivel,
        niveles: nivelesDesbloqueados.join(","),
      });
      router.push(`/fracciones/resultado?${params.toString()}`);
  };

  // --- RENDERIZADO ---

  // Si aún no tienes el email, muestra cargando
  if (email === null) {
    return <div>Cargando email…</div>;
  }

  if (testRealizado === null) {
    return <div>Cargando…</div>;
  }

  if (testRealizado === false) {
    return (
      <TestDiagnostico tema="fracciones" onTerminar={onTerminar} />
    );
  }

  router.push("/fracciones/niveles");
}
