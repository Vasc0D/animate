export default function HomePage() {
  return (
    <main className="min-h-screen bg-orange-50 flex flex-col items-center justify-between py-10 px-6">
      {/* Logo y título */}
      <div className="flex items-center justify-between w-full max-w-5xl">
        <img src="/images/logo-fe.png" alt="Logo Fe y Alegría" className="w-20" />
        <h1 className="text-4xl font-bold text-orange-500">AniMate</h1>
        <div className="w-20" /> {/* Espaciador simétrico */}
      </div>

      {/* Cuerpo central */}
      <div className="flex flex-col items-center gap-8 mt-10">
        <div className="flex gap-16">
          {/* Botón Estudiante */}
          <a href="/estudiante/login" className="bg-orange-400 rounded-xl shadow-lg hover:bg-orange-500 transition p-6 flex flex-col items-center">
            <img src="/images/estudiante.png" alt="Estudiante" className="w-28 h-28 rounded-full mb-4" />
            <button className="bg-white text-black font-bold px-6 py-2 rounded-full">ESTUDIANTE</button>
          </a>

          {/* Botón Profesor */}
          <a href="/profesor/login" className="bg-orange-400 rounded-xl shadow-lg hover:bg-orange-500 transition p-6 flex flex-col items-center">
            <img src="/images/profesor.png" alt="Profesor" className="w-28 h-28 rounded-full mb-4" />
            <button className="bg-white text-black font-bold px-6 py-2 rounded-full">PROFESOR</button>
          </a>
        </div>
      </div>

      {/* Animales */}
      <div className="flex justify-between w-full max-w-5xl mt-12">
        <img src="/images/cuy.png" alt="Cuy" className="w-24" />
        <img src="/images/capibara.png" alt="Capibara" className="w-24" />
      </div>
    </main>
  );
}
