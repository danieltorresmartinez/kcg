import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const [isUserOpen, setIsUserOpen] = useState(false);
  const { rol } = useAuth();
  const { isAuthenticated } = useAuth();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  return (
    <>
      <nav className="flex justify-between fixed w-full bg-white z-[999]">
        <div className="">
          <img
            src="https://constructoraminimal.cl/wp-content/uploads/2025/01/MINIMAL-HORIZONTAL-R.png"
            className="h-28 justify-self-center cursor-pointer"
            onClick={() => {
              if (rol === "admin") {
                navigate("/admin");
              } else {
                navigate("/");
              }
            }}
          ></img>
        </div>
        <div
          onMouseEnter={() => setIsUserOpen(true)}
          onMouseLeave={() => setIsUserOpen(false)}
          className="flex justify-center items-center mr-20 text-black "
        >
          <Link
            to={isAuthenticated ? "/perfil" : "/auth"}
            className="hover:text-gray-600 cursor-pointer"
          >
            <i className="z-[999] fa-solid fa-user text-center"></i>
          </Link>
          <ul
            className={`z-[997] justify-items-center rounded-b-md absolute p-2 w-40 transition-all duration-300 transform right-2 ${
              isUserOpen
                ? "opacity-100 visible translate-y-16"
                : "opacity-0 invisible -translate-y-2"
            }`}
          >
            {isAuthenticated && (
              <>
                {rol === "admin" ? (
                  <>
                    <li className="text-black p-2">
                      <Link
                        to="/admin"
                        className="hover:text-gray-600 cursor-pointer underline"
                      >
                        Dashboard
                      </Link>
                    </li>
                    <li
                      onClick={handleLogout}
                      className="text-red-800 font-bold hover:text-red-700 cursor-pointer p-2 underline"
                    >
                      Cerrar sesión
                    </li>
                  </>
                ) : (
                  <>
                    <li className="text-black p-2">
                      <Link
                        to="/perfil"
                        className="hover:text-gray-600 cursor-pointer underline"
                      >
                        Perfil
                      </Link>
                    </li>
                    <li
                      onClick={handleLogout}
                      className="text-red-800 font-bold hover:text-red-700 cursor-pointer p-2 underline"
                    >
                      Cerrar sesión
                    </li>
                  </>
                )}
              </>
            )}
            {!isAuthenticated && (
              <>
                <li
                  className="p-2 hover:text-gray-600 cursor-pointer underline font-semibold"
                  onClick={() =>
                    navigate("/auth", { state: { loginActivo: true } })
                  }
                >
                  Iniciar Sesión
                </li>
                <li
                  className="p-2 hover:text-gray-600 cursor-pointer underline font-semibold"
                  onClick={() =>
                    navigate("/auth", { state: { loginActivo: false } })
                  }
                >
                  Crear Cuenta
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </>
  );
}

export default NavBar;
