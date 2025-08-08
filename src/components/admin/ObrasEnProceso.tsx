import { useEffect, useState } from "react";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

interface Obra {
  id: string;
  nombre: string;
  jefeObra: string;
  ordenDeCompraURL?: string;
  administradores?: string[];
  fechaInicio: string;
}

function ObrasEnProceso() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "obras_activas"));
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

  const enviarNotificacion = (obra: Obra) => {
    // Aquí va la lógica para enviar notificación.
    alert(
      `Notificación enviada al jefe de obra: ${
        obra.jefeObra
      } y administradores: ${obra.administradores?.join(", ")}`
    );
  };

  if (loading)
    return <p className="text-center mt-6">Cargando obras en proceso...</p>;

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
              Orden de pago: {obra.ordenDeCompraURL ? "al día" : "pendiente"}
            </p>

            {obra.ordenDeCompraURL ? (
              <button
                className="mt-3 px-4 py-1 text-sm bg-blue-600 text-black border rounded hover:bg-blue-700"
                onClick={() => {
                  if (obra.ordenDeCompraURL) {
                    window.open(obra.ordenDeCompraURL, "_blank");
                  } else {
                    alert("Esta obra no tiene orden de pago subida.");
                  }
                }}
              >
                Ver orden de pago
              </button>
            ) : (
              <button
                className="mt-3 px-4 py-1 text-sm bg-blue-600 text-black border rounded hover:bg-blue-700"
                onClick={(e) => {
                  e.stopPropagation();
                  enviarNotificacion(obra);
                }}
              >
                Enviar notificación
              </button>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-800">
              Fecha inicio: {obra.fechaInicio}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
export default ObrasEnProceso;
