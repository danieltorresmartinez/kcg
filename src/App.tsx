import PublicLayout from "./components/layouts/PublicLayout.tsx";
import InternLayout from "./components/layouts/InternLayout.tsx";
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute.tsx";
import AdminDashboard from "./components/admin/AdminDashboard.tsx";
import EstadosDePago from "./components/admin/EstadosDePago.tsx";
import Index from "./pages/Index";
import Perfil from "./components/usuarios/Perfil.tsx";
import Obras from "./pages/Obras";
import CrearObra from "./components/CrearObra";
import UnirseAObra from "./components/UnirseAObra.tsx";
import Auth from "./pages/Auth";
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        {/* Rutas públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Index />}></Route>
          <Route path="/auth" element={<Auth />}></Route>
          <Route element={<PrivateRoute />}>
            <Route path="/obras" element={<Obras />}></Route>
            <Route path="/unirse-a-obra" element={<UnirseAObra />}></Route>

            <Route path="/estados-de-pago" element={<EstadosDePago />}></Route>
            <Route path="/crear-obra" element={<CrearObra />}></Route>
          </Route>
        </Route>
        {/* Rutas Internas */}
        <Route element={<InternLayout />}>
          <Route element={<PrivateRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route path="/perfil" element={<Perfil />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
