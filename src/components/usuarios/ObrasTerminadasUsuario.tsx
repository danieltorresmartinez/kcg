import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

interface Obra {
  id: string;
  nombre: string;
  jefeObra: string;
  ordenDeCompraURL: string;
  administradores?: string[];
  fechaInicio: string;
  fechaTermino: string;
  terminadaPor: string;
}

function ObrasTerminadasUsuario() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "obras_terminadas"));
        const obrasData: Obra[] = [];

        for (const docSnap of querySnapshot.docs) {
          const data = docSnap.data();
          obrasData.push({
            id: docSnap.id,
            nombre: data.codigo,
            jefeObra: data.creadoPor,
            ordenDeCompraURL: data.ordenDeCompraURL,
            administradores: data.administradores || [],
            fechaInicio: data.fechaCreacion,
            fechaTermino: data.fechaTerminacion,
            terminadaPor: data.terminadaPor,
          });
        }

        setObras(obrasData);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar obras:", error);
      }
    };

    fetchObras();
  }, []);

  if (loading)
    return <p className="text-center mt-6">Cargando tur obras terminadas...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-4 px-4 ">
      {obras.map((obra) => (
        <div
          key={obra.id}
          className="flex justify-between border p-4 rounded-lg shadow hover:bg-gray-100 transition"
        >
          <div>
            <h2 className="text-xl font-bold">{obra.nombre}</h2>
            <p className="text-sm text-gray-800">
              Jefe de obra: {obra.jefeObra}
            </p>
            {obra.administradores?.length ? (
              <p className="text-sm text-gray-800">
                Administradores de obra: {obra.administradores.join(" - ")}
              </p>
            ) : (
              ""
            )}
            <p
              className={`mt-2 text-sm font-semibold ${
                obra.ordenDeCompraURL ? "text-green-600" : "text-red-600"
              }`}
            >
              Orden de compra: {obra.ordenDeCompraURL}
            </p>

            <button
              className="mt-3 mr-2 px-4 py-1 text-sm bg-blue-600 text-black border rounded hover:bg-blue-700"
              onClick={() => window.open(obra.ordenDeCompraURL, "_blank")}
            >
              Ver orden
            </button>
          </div>
          <div>
            <p className="text-sm text-gray-800">
              Fecha inicio: {obra.fechaInicio}
            </p>

            <p className="text-sm text-gray-800">
              Fecha termino: {obra.fechaTermino}
            </p>

            <p className="text-sm text-gray-800">
              Terminada por: {obra.terminadaPor}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default ObrasTerminadasUsuario;
