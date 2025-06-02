"use client";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResultadoPage() {
  const searchParams = useSearchParams();
  const puntaje = parseInt(searchParams.get("puntaje")) || 0;
  const nivel   = searchParams.get("nivel")   || "Desconocido";
  const porcentaje = Math.min((puntaje / 20) * 100, 100);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#FFF5EB] to-[#FFF1E7] p-6 text-gray-800">
      <h1 className="mb-8 text-center text-5xl font-extrabold tracking-tight text-[#FF7A00]">
        🎉 ¡Test Completado! 🎉
      </h1>

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        <p className="mb-1 text-xl sm:text-2xl">Tu <strong>puntaje</strong> es:</p>
        <p className="mb-4 text-5xl font-extrabold text-[#FF7A00]">{puntaje} / 20</p>

        <p className="mb-1 text-xl sm:text-2xl">Te corresponde el <strong>nivel</strong>:</p>
        <p className="mb-6 text-4xl font-extrabold text-[#FF7A00]">Nivel {nivel}</p>

        <div className="mb-4 h-6 w-full overflow-hidden rounded-full bg-[#FFEAD9]">
          <div
            className="h-full rounded-full bg-[#FF7A00] transition-all duration-700"
            style={{ width: `${porcentaje}%` }}
          />
        </div>

        <p className="mb-6 text-center text-sm text-gray-500">
          Progreso del test: {porcentaje.toFixed(0)}%
        </p>

        <Link
          href="/fracciones/niveles"
          className="inline-block rounded-full bg-[#FF7A00] px-6 py-3 font-semibold text-white transition hover:bg-[#ff8c1a]"
        >
          Ver mis niveles
        </Link>
      </div>
    </div>
  );
}
