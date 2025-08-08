import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AuthModal from "./AuthModal";
import { useAuth } from "../context/AuthContext";

const PrivateRoute: React.FC = () => {
  const { user, authReady } = useAuth();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (authReady && !user) {
      setShowModal(true);
    }
  }, [user, authReady]);

  if (!authReady) {
    return <p className="text-center mt-10">Verificando sesión...</p>;
  }

  if (!user) {
    return (
      <AuthModal visible={showModal} onClose={() => setShowModal(false)} />
    );
  }

  return <Outlet />;
};

export default PrivateRoute;
