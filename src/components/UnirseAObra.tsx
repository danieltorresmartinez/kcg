import { useEffect, useState } from "react";
import { db } from "../firebase/firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext"; // Ajusta la ruta según tu proyecto

interface Obra {
  id: string;
  nombre: string;
  jefeObra: string;
  ordenDePagoURL?: string;
  administradores?: string[];
  fechaInicio: string;
}

function UnirseAObra() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const { username } = useAuth();

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
            ordenDePagoURL: data.ordenDePagoURL,
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

  const handleUnirseAObra = async (obra: Obra) => {
    if (!username) return;

    try {
      const obraRef = doc(db, "obras_activas", obra.id);

      // Actualizar lista de administradores
      const nuevosAdmins = [...(obra.administradores || []), username];

      await updateDoc(obraRef, {
        administradores: nuevosAdmins,
      });

      // Actualizar estado local
      setObras((prev) =>
        prev.map((o) =>
          o.id === obra.id ? { ...o, administradores: nuevosAdmins } : o
        )
      );

      alert("¡Te has unido exitosamente a la obra!");
    } catch (error) {
      console.error("Error al unirse a la obra:", error);
    }
  };

  if (loading)
    return <p className="text-center mt-6">Cargando obras activas...</p>;

  return (
    <div className="max-w-4xl mx-auto pt-44 space-y-4 px-4">
      {obras.map((obra) => {
        const yaEsAdmin = obra.administradores?.includes(username || "");

        return (
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

              {!yaEsAdmin && (
                <button
                  className="mt-3 px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => handleUnirseAObra(obra)}
                >
                  Unirse a obra
                </button>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-800">
                Fecha inicio: {obra.fechaInicio}
              </p>
            </div>
          </div>
        );
      })}
      {obras.length === 0 && (
        <p className="text-center text-gray-600">No hay ninguna obra activa.</p>
      )}
    </div>
  );
}

export default UnirseAObra;
