import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase/firebaseConfig";
import { setDoc, doc } from "firebase/firestore";

type RegistroProps = {
  cambiarComponente: () => void;
};

function Registro({ cambiarComponente }: RegistroProps) {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    nombre: "",
    apellido: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password.length < 6) {
      return setError("La contraseña debe tener al menos 6 caracteres.");
    }

    if (form.password !== form.confirmPassword) {
      return setError("Las contraseñas no coinciden.");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await setDoc(doc(db, "usuarios", userCredential.user.uid), {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        rol: "constructor",
      });
      await setDoc(doc(db, "constructores", userCredential.user.uid), {
        nombre: form.nombre + " " + form.apellido,
      });

      navigate("/");
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <>
      <div className="justify-self-center pb-12 w-full max-w-lg mx-auto pt-28">
        <form
          onSubmit={handleRegister}
          className="bg-white rounded-xl p-6 shadow-lg w-full font-[Alexandria] text-black"
        >
          <h2 className="text-2xl font-medium mb-6 text-center">
            Crear Cuenta
          </h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <input
            name="nombre"
            type="text"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border rounded"
          />
          <input
            name="apellido"
            type="text"
            placeholder="Apellido"
            value={form.apellido}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border rounded"
          />
          <input
            name="email"
            type="email"
            placeholder="Correo"
            value={form.email}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border rounded"
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña (mínimo 6 caracteres)"
            value={form.password}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border rounded"
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirmar contraseña"
            value={form.confirmPassword}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-black border border-[#080808] py-2 rounded mt-2"
            onClick={handleRegister}
          >
            Crear cuenta
          </button>

          <p className="text-center mt-4">
            ¿Ya tienes cuenta?{" "}
            <button
              onClick={cambiarComponente}
              className="text-blue-500 hover:underline ml-1"
            >
              Iniciar sesión
            </button>
          </p>
        </form>
      </div>
    </>
  );
}

export default Registro;
