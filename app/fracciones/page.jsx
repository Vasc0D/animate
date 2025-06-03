// fracciones/page.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TestDiagnostico from "./test_diagnostico";

const rangosNiveles = {
  básico: [1],
  intermedio: Array.from({ length: 11 }, (_, i) => i + 1),  // 1 a 11
  avanzado: Array.from({ length: 10 }, (_, i) => i + 21),   // 21 a 30
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

  const onTerminar = async ({ preguntas, respuestas }) => {
    // Calcular score igual
    const score = preguntas.reduce((sum, p) => {
      const respuesta = respuestas[p.id]?.trim().toLowerCase();
      const correcta = p.respuesta_correcta.trim().toLowerCase();
      return sum + (respuesta === correcta ? p.valor : 0);
    }, 0);
  
    // Enviar respuestas al backend
    try {
      const res = await fetch("http://localhost:5001/fracciones/resultados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, respuestas }),
      });
      const data = await res.json();
  
      // Usar datos del backend
      const { puntaje, nivel, niveles } = data;
  
      // Actualizar estados con la info del backend
      setTestRealizado(true);
      setNivelesDesbloqueados(niveles);
      setNivelGeneral(nivel);
  
      // Navegar a resultado con parámetros correctos
      const params = new URLSearchParams({
        puntaje: String(puntaje),
        nivel,
        niveles: niveles.join(","),
      });
      router.push(`/fracciones/resultado?${params.toString()}`);
    } catch (err) {
      console.error("Error guardando diagnóstico:", err);
    }
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
