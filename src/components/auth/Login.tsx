import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";

type LoginProps = {
  cambiarComponente: () => void;
};

function Login({ cambiarComponente }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userDocRef = doc(db, "usuarios", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        const rol = userData.rol;

        alert("Sesión iniciada correctamente");

        // Redirigir según el rol
        if (rol === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        alert("El usuario no tiene datos registrados");
      }
    } catch (error: any) {
      alert("Error al iniciar sesión: " + error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Por favor, escribe tu correo para recuperar la contraseña.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Correo de recuperación enviado. Revisa tu bandeja de entrada.");
    } catch (error: any) {
      alert("Error al enviar correo: " + error.message);
    }
  };

  return (
    <>
      <div className="justify-self-center font-[Alexandria] text-black w-full max-w-lg mx-auto pt-32">
        <form
          className="bg-white rounded-xl p-6 shadow-lg w-full"
          onSubmit={handleLogin}
        >
          <h2 className="text-2xl font-medium mb-6 text-center">
            Iniciar sesión
          </h2>

          <input
            type="email"
            placeholder="Correo"
            className="block w-full p-2 mb-4 border border-gray-300 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            className="block w-full p-2 mb-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <div className="flex justify-between items-center">
            {/*<label className="flex items-center text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
              />
              Mantener sesión iniciada
            </label>*/}
            <button
              type="button"
              className="text-sm text-blue-500 hover:underline"
              onClick={handleForgotPassword}
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-black border border-[#080808] hover:bg-blue-600 py-2 rounded mt-6"
          >
            Iniciar sesión
          </button>

          <p className="text-sm text-center mt-6">
            ¿No tienes cuenta?
            <button
              onClick={cambiarComponente}
              className="text-blue-500 hover:underline ml-1"
            >
              Regístrate
            </button>
          </p>
        </form>
      </div>
    </>
  );
}

export default Login;
