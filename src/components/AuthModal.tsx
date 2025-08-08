import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebase/firebaseConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

interface Props {
  visible: boolean;
  onClose: () => void;
}

const AuthModal: React.FC<Props> = ({ visible, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Guardar la redirección pendiente
  useEffect(() => {
    if (location.pathname !== "/login" && !isAuthenticated) {
      sessionStorage.setItem("redirectAfterLogin", location.pathname);
    }
  }, [location.pathname, isAuthenticated]);

  if (!visible) return null;

  const handleClose = () => {
    const prevPath = sessionStorage.getItem("previous") || "/";
    onClose();
    navigate(prevPath);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      // Buscar el rol del usuario
      const userDocRef = doc(db, "usuarios", uid); // Asegúrate de que la colección se llame así
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const rol = userData.rol;

        // Redirigir según el rol
        if (rol === "admin") {
          navigate("/admin");
        } else {
          const from = (location.state as any)?.from?.pathname || "/";
          navigate(from);
        }

        onClose();
      } else {
        setError("No se encontró la información del usuario.");
      }
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
        <button
          className="fas fa-x absolute top-3 right-3 text-gray-500 hover:text-gray-700"
          onClick={handleClose}
        ></button>
        <h2 className="text-2xl font-bold text-center mb-4">Iniciar sesión</h2>

        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded-md p-2"
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded-md p-2"
            required
          />
          <button
            type="submit"
            className="w-full bg-indigo-600 text-black border border-[#080808] py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
