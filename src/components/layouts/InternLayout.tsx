import NavBar from "../NavBar";
import { Outlet } from "react-router-dom";

const InternLayout = () => {
  return (
    <>
      <NavBar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default InternLayout;
