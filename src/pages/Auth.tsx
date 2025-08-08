import { useState, useEffect } from "react";
import Login from "../components/auth/Login";
import Registro from "../components/auth/Registro";
import { useLocation } from "react-router-dom";
function Auth() {
  const location = useLocation();
  const [loginActivo, setLoginActivo] = useState(true);

  useEffect(() => {
    if (location.state?.loginActivo !== undefined) {
      setLoginActivo(location.state.loginActivo);
    }
  }, [location.state]);

  return (
    <>
      {loginActivo && <Login cambiarComponente={() => setLoginActivo(false)} />}
      {!loginActivo && (
        <Registro cambiarComponente={() => setLoginActivo(true)} />
      )}
    </>
  );
}

export default Auth;
