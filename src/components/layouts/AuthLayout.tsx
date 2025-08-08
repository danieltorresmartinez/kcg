import NavBar from "../NavBar";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;
