import { useEffect, useState } from "react";
import { db, storage } from "../../firebase/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Timestamp } from "firebase/firestore";
import { useAuth } from "../../context/AuthContext";

interface Obra {
  id: string;
  nombre: string;
  jefeObra: string;
  ordenDeCompraURL?: string;
  administradores?: string[];
  fechaInicio: string;
}

function MisObras() {
  const [obrasJefe, setObrasJefe] = useState<Obra[]>([]);
  const [obrasAdmin, setObrasAdmin] = useState<Obra[]>([]);
  const [loading, setLoading] = useState(true);
  const [subiendo, setSubiendo] = useState<string | null>(null);
  const { username } = useAuth();

  useEffect(() => {
    const fetchObras = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "obras_activas"));
        const obrasData: Obra[] = [];

        querySnapshot.forEach((docSnap) => {
          const data = docSnap.data();
          obrasData.push({
            id: docSnap.id,
            nombre: data.codigo,
            jefeObra: data.creadoPor,
            ordenDeCompraURL: data.ordenDeCompraUrl,
            administradores: data.administradores || [],
            fechaInicio: data.fechaCreacion,
          });
        });

        const comoJefe = obrasData.filter((obra) => obra.jefeObra === username);
        const comoAdmin = obrasData.filter((obra) => {
          if (username !== null) {
            obra.administradores?.includes(username) &&
              obra.jefeObra !== username;
          }
        });

        setObrasJefe(comoJefe);
        setObrasAdmin(comoAdmin);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar obras:", error);
      }
    };

    fetchObras();
  }, [username]);

  const subirOrdenDeCompra = async (obra: Obra, archivo: File) => {
    try {
      setSubiendo(obra.id);
      const refPDF = ref(storage, `ordenes_compra/${obra.id}.pdf`);
      await uploadBytes(refPDF, archivo);
      const url = await getDownloadURL(refPDF);

      const obraRef = doc(db, "obras_activas", obra.nombre);
      await updateDoc(obraRef, { ordenDeCompraUrl: url });

      alert("Orden de compra subida correctamente.");
      setSubiendo(null);
      location.reload();
    } catch (err) {
      console.error(err);
      alert("Error al subir la orden.");
      setSubiendo(null);
    }
  };

  const handleFecha = (fecha: string) => {
    const valores = fecha.split(" ");
    const dia = valores[2];
    let mes = valores[1];
    const año = valores[3];

    const mesesMap: Record<string, string> = {
      Jan: "Ene",
      Apr: "Abr",
      Aug: "Ago",
      Dec: "Dic",
    };

    mes = mesesMap[mes] || mes;

    return `${dia} ${mes} ${año}`;
  };

  const terminarObra = async (obra: Obra) => {
    try {
      const obraRef = doc(db, "obras_activas", obra.nombre);
      const nuevaRef = doc(db, "obras_terminadas", obra.nombre);

      const snapshot = await getDocs(collection(db, "obras_activas"));
      const data = snapshot.docs.find((d) => d.id === obra.nombre)?.data();

      if (data) {
        // Agregamos la información de quién y cuándo terminó
        const datosFinales = {
          ...data,
          terminadaPor: username,
          fechaTerminacion: handleFecha(
            Timestamp.now().toDate().toDateString()
          ),
        };

        // Guardamos en obras_terminadas
        await setDoc(nuevaRef, datosFinales);

        // Eliminamos de obras_activas
        await deleteDoc(obraRef);

        // Enviamos notificación
        notificarAdministradores(obra);

        alert("Obra terminada correctamente.");
        location.reload();
      }
    } catch (error) {
      console.error("Error al terminar la obra:", error);
      alert("Error al mover la obra.");
    }
  };
  const notificarAdministradores = (obra: Obra) => {
    const adminList = obra.administradores || [];
    if (adminList.length === 0) return;

    // Puedes reemplazar esto con tu lógica real de notificación
    alert(
      `Se notificó a los administradores: ${adminList.join(
        ", "
      )} que la obra "${obra.nombre}" fue terminada por ${username}.`
    );

    // Si quieres enviar un documento a Firestore o una colección de notificaciones, lo puedes hacer aquí
    // await addDoc(collection(db, "notificaciones"), { ... })
  };

  const renderTarjeta = (obra: Obra) => (
    <div
      key={obra.id}
      className="flex justify-between border p-4 rounded-lg shadow hover:bg-gray-100 transition"
    >
      <div>
        <h2 className="text-xl font-bold">{obra.nombre}</h2>
        <p className="text-sm text-gray-800">Jefe de obra: {obra.jefeObra}</p>
        {obra.administradores
          ? obra.administradores?.length > 0 && (
              <p className="text-sm text-gray-800">
                Administradores: {obra.administradores.join(" - ")}
              </p>
            )
          : ""}
        <p
          className={`mt-2 text-sm font-semibold ${
            obra.ordenDeCompraURL ? "text-green-600" : "text-red-600"
          }`}
        >
          Orden de compra: {obra.ordenDeCompraURL ? "al día" : "pendiente"}
        </p>

        {obra.ordenDeCompraURL ? (
          <>
            <button
              className="mt-3 mr-2 px-4 py-1 text-sm bg-blue-600 text-black border rounded hover:bg-blue-700"
              onClick={() => window.open(obra.ordenDeCompraURL, "_blank")}
            >
              Ver orden
            </button>
            <button
              className="mt-3 px-4 py-1 text-sm bg-green-500 text-black border rounded hover:bg-green-600"
              onClick={() => terminarObra(obra)}
            >
              Terminar obra
            </button>
          </>
        ) : (
          <label className="block mt-3">
            <span className="text-sm text-gray-700">Subir orden de compra</span>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const archivo = e.target.files?.[0];
                if (archivo) subirOrdenDeCompra(obra, archivo);
              }}
              className="block w-full mt-1 text-sm text-gray-900 file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 hover:file:bg-blue-100"
              disabled={subiendo === obra.id}
            />
          </label>
        )}
      </div>
      <div>
        <p className="text-sm text-gray-800">Fecha: {obra.fechaInicio}</p>
      </div>
    </div>
  );

  if (loading) {
    return <p className="text-center mt-6">Cargando tus obras...</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-8 px-4">
      {obrasJefe.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Obras como Jefe</h3>
          <div className="space-y-4">{obrasJefe.map(renderTarjeta)}</div>
        </div>
      )}

      {obrasAdmin.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold mb-2">
            Obras como Administrador
          </h3>
          <div className="space-y-4">{obrasAdmin.map(renderTarjeta)}</div>
        </div>
      )}

      {obrasJefe.length === 0 && obrasAdmin.length === 0 && (
        <p className="text-center text-gray-600">
          No estás asignado a ninguna obra activa.
        </p>
      )}
    </div>
  );
}

export default MisObras;
