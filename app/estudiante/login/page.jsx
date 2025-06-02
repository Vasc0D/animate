"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginEstudiante() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // Para manejar errores

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de campos vacíos
    if (!usuario || !password) {
      setError("Completa todos los campos.");
      return;
    }

    try {
      // Enviar la solicitud POST al backend para hacer login
      const res = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: usuario, password }),
      });

      const data = await res.json();

      // Si la respuesta no es OK, mostrar el error
      if (!res.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }

      // Guardar token en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", usuario);
      console.log("email guardado:", usuario);

      // Decodificar el token para obtener el rol
      const decodedToken = JSON.parse(atob(data.token.split('.')[1])); // Decodificar el JWT
      const role = decodedToken.role;

      // Si el rol es 'estudiante', redirigir a la página de inicio del estudiante
      if (role === "estudiante") {
        router.push("/estudiante/inicio");
      } else {
        setError("Acceso denegado. Este login es solo para estudiantes.");
      }
    } catch (error) {
      setError("Error de conexión al servidor. Intenta de nuevo.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="relative bg-orange-400 rounded-[2rem] p-10 w-full max-w-md shadow-xl">
        {/* Botón atrás */}
        <a href="/" className="absolute -left top-8 bg-orange-300 rounded-full w-14 h-14 flex items-center justify-center shadow-md hover:bg-orange-500">
          <span className="text-3xl text-white">←</span>
        </a>

        {/* Imagen central */}
        <div className="flex justify-center mb-6">
          <img src="/images/libros.png" alt="Login" className="w-24 h-24 rounded-full shadow-md" />
        </div>

        {/* Mostrar error si lo hay */}
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white font-bold block mb-1">Usuario</label>
            <input
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              className="w-full p-2 rounded-full bg-orange-100 focus:outline-none text-black"
            />
          </div>
          <div>
            <label className="text-white font-bold block mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded-full bg-orange-100 focus:outline-none text-black"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-100 text-black font-semibold py-3 rounded-full mt-4 hover:bg-orange-200"
          >
            INGRESAR
          </button>
        </form>
      </div>
    </main>
  );
}
