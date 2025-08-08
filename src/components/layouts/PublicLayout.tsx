import NavBarIndex from "../NavbarIndex";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <>
      <NavBarIndex />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default PublicLayout;
