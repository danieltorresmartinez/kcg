import { useState, useEffect, type JSX } from "react";
import { useAuth } from "../../context/AuthContext";
import Constructores from "./Constructores";
import EstadosDePago from "./EstadosDePago";
import ObrasEnProceso from "./ObrasEnProceso";
import ObrasFacturadas from "./ObrasFacturadas";
import ObrasTerminadas from "./ObrasTerminadas";
import ExportarObras from "./ExportarObras";

const menuItems = [
  {
    title: "Obras",
    subItems: [
      "Obras en proceso",
      "Obras terminadas",
      "Obras facturadas",
      "Exportar datos",
    ],
  },
  {
    title: "Pagos",
    subItems: ["Estados de pago"],
  },
  {
    title: "Trabajadores",
    subItems: ["Constructores"],
  },
];

const AdminDashboard = () => {
  const { username } = useAuth();
  const [openTab, setOpenTab] = useState<string | null>(null);
  const [openSubTab, setOpenSubTab] = useState<string | null>(null);
  const [selectedComponent, setSelectedComponent] =
    useState<JSX.Element | null>(null);

  const toggleTab = (tab: string) => {
    setOpenTab((prev) => (prev === tab ? null : tab));
  };
  useEffect(() => {
    setOpenTab("Obras");
    handleSubItemClick("Obras en proceso");
  }, []);
  const handleSubItemClick = (componentName: string) => {
    setOpenSubTab(componentName);
    switch (componentName) {
      case "Obras en proceso":
        setSelectedComponent(<ObrasEnProceso />);
        break;
      case "Obras facturadas":
        setSelectedComponent(<ObrasFacturadas />);
        break;
      case "Obras terminadas":
        setSelectedComponent(<ObrasTerminadas />);
        break;
      case "Exportar datos":
        setSelectedComponent(<ExportarObras />);
        break;
      case "Estados de pago":
        setSelectedComponent(<EstadosDePago />);
        break;
      case "Constructores":
        setSelectedComponent(<Constructores />);
        break;
      default:
        setSelectedComponent(null);
    }
  };

  return (
    <>
      <div className="flex pt-28">
        {/* Sidebar */}
        <div className="fixed h-full w-1/4 bg-white shadow-lg p-4 overflow-y-auto">
          <h2 className="text-2xl font-[Alexandria] font-bold mb-6 text-black">
            {username}
          </h2>

          {menuItems.map((item) => (
            <div
              key={item.title}
              className="font-[Alexandria] mb-2 cursor-pointer"
            >
              <div
                onClick={() => toggleTab(item.title)}
                className={`text-xl w-full text-left px-4 py-2 transition-all text-black font-medium rounded-md flex justify-between items-center ${
                  openTab === item.title
                    ? "bg-gray-300"
                    : "hover:bg-gray-200 bg-gray-200"
                }`}
              >
                <p>{item.title}</p>
                <i
                  className={`p-1 fa-solid transition-all ${
                    openTab === item.title ? "fa-chevron-up" : "fa-chevron-down"
                  }`}
                ></i>
              </div>
              {openTab === item.title && (
                <div className="bg-gray-400 rounded-lg mt-1 ml-2">
                  {item.subItems.map((subItem) => (
                    <div
                      key={subItem}
                      onClick={() => handleSubItemClick(subItem)}
                      className={`block w-full text-left px-4 py-2 text-md text-black hover:bg-gray-300 rounded ${
                        openSubTab === subItem
                          ? "bg-gray-300"
                          : "hover:bg-gray-200 bg-gray-200"
                      }`}
                    >
                      {subItem}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="absolute w-3/4 right-0 p-8 overflow-y-auto">
          {selectedComponent ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              {selectedComponent}
            </div>
          ) : (
            <ObrasEnProceso />
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
