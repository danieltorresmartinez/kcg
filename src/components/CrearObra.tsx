import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  Timestamp,
} from "firebase/firestore";
import { db, storage } from "../firebase/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "../context/AuthContext";

type Obra = {
  codigo: string;
  montoPresupuesto: string;
  numeroPresupuesto: string;
  numeroOrdenDeCompra: string;
  razonSocial: string;
  estadoProyecto: string;
};

function CrearObra() {
  const navigate = useNavigate();
  const { username } = useAuth();

  const [obra, setObra] = useState<Obra>({
    codigo: "",
    montoPresupuesto: "",
    numeroPresupuesto: "",
    numeroOrdenDeCompra: "",
    razonSocial: "",
    estadoProyecto: "en proceso", // Oculto al usuario
  });

  const [archivoPDF, setArchivoPDF] = useState<File | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, setError] = useState("");

  const [administradoresDisponibles, setAdministradoresDisponibles] = useState<
    string[]
  >([]);
  const [administradoresSeleccionados, setAdministradoresSeleccionados] =
    useState<string[]>([]);

  useEffect(() => {
    const obtenerConstructores = async () => {
      const snapshot = await getDocs(collection(db, "constructores"));
      const nombres = snapshot.docs.map((doc) => doc.data().nombre);
      setAdministradoresDisponibles(nombres);

      // Seleccionar automáticamente al jefe de obra (usuario actual)
      if (username && nombres.includes(username)) {
        setAdministradoresSeleccionados((prev) =>
          prev.includes(username) ? prev : [username, ...prev]
        );
      }
    };
    obtenerConstructores();
  }, [username]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setObra((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setArchivoPDF(file);
    } else {
      alert("Por favor selecciona un archivo PDF válido.");
      setArchivoPDF(null);
    }
  };

  const validarDatos = () => {
    if (
      !obra.codigo ||
      !obra.montoPresupuesto ||
      !obra.numeroPresupuesto ||
      !obra.numeroOrdenDeCompra ||
      !obra.razonSocial
    ) {
      setError("Por favor completa todos los campos obligatorios.");
      return false;
    }
    return true;
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
  const guardarObra = async () => {
    try {
      const uid = crypto.randomUUID();
      let urlArchivo = "";

      if (archivoPDF) {
        const storageRef = ref(storage, `ordenes_compra/${uid}.pdf`);
        await uploadBytes(storageRef, archivoPDF);
        urlArchivo = await getDownloadURL(storageRef);
      }

      const nuevaObra = {
        ...obra,
        administradores: administradoresSeleccionados,
        ordenDeCompraUrl: urlArchivo || null,
        creadoPor: username || "Anónimo",
        fechaCreacion: handleFecha(Timestamp.now().toDate().toDateString()),
        id: uid,
      };

      await setDoc(doc(db, "obras_activas", obra.codigo), nuevaObra);
      alert("Obra creada exitosamente.");
      navigate("/obras");
    } catch (err) {
      console.error(err);
      alert("Error al crear la obra.");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validarDatos()) return;

    if (!archivoPDF) {
      setModalVisible(true);
    } else {
      guardarObra();
    }
  };

  const continuarSinPDF = () => {
    setModalVisible(false);
    guardarObra();
  };

  return (
    <>
      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black/80 z-[999] flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h3 className="text-lg font-semibold mb-4">
              Orden de compra no agregada
            </h3>
            <p className="mb-4">
              ¿Deseas continuar sin subir una orden de compra?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={continuarSinPDF}
                className="bg-green-500 text-black border border-[#080808] px-4 py-2 rounded"
              >
                Sí, continuar
              </button>
              <button
                onClick={() => setModalVisible(false)}
                className="bg-red-500 text-black border border-[#080808] px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario */}
      <div className="justify-self-center pb-12 w-full max-w-lg mx-auto pt-36">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl p-6 shadow-lg w-full font-[Alexandria] text-black"
        >
          <h2 className="text-2xl font-medium mb-6 text-center">Crear Obra</h2>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <input
            name="codigo"
            type="text"
            placeholder="Código de obra"
            value={obra.codigo}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border rounded"
          />

          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            className="block w-full p-2 mb-4 border rounded"
          />

          <input
            name="numeroOrdenDeCompra"
            type="text"
            placeholder="Número de orden de compra"
            value={obra.numeroOrdenDeCompra}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border rounded"
          />

          <input
            name="montoPresupuesto"
            type="text"
            placeholder="Monto de presupuesto"
            value={obra.montoPresupuesto}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border rounded"
          />

          <input
            name="numeroPresupuesto"
            type="text"
            placeholder="Número de presupuesto"
            value={obra.numeroPresupuesto}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border rounded"
          />

          <input
            name="razonSocial"
            type="text"
            placeholder="Razón social (cliente)"
            value={obra.razonSocial}
            onChange={handleChange}
            className="block w-full p-2 mb-4 border rounded"
          />

          <label className="block mb-2 font-semibold">
            Administradores de obra
          </label>

          <div className="border rounded mb-2 divide-y">
            {administradoresDisponibles.map((admin) => {
              const seleccionado = administradoresSeleccionados.includes(admin);
              const esJefe = admin === username;

              return (
                <div
                  key={admin}
                  onClick={() => {
                    if (esJefe) return; // El jefe no se puede des-seleccionar
                    setAdministradoresSeleccionados((prev) =>
                      seleccionado
                        ? prev.filter((a) => a !== admin)
                        : [...prev, admin]
                    );
                  }}
                  className={`flex items-center justify-between p-2 cursor-pointer ${
                    seleccionado ? "bg-green-100" : "hover:bg-gray-100"
                  } ${esJefe ? "font-semibold text-blue-700" : ""}`}
                >
                  <span>
                    {admin}
                    {esJefe && (
                      <span className="text-xs text-blue-500 ml-1">(Jefe)</span>
                    )}
                  </span>
                  <i
                    className={`fas ${
                      seleccionado ? "fa-minus" : "fa-plus"
                    } text-gray-600`}
                  ></i>
                </div>
              );
            })}
          </div>

          {administradoresSeleccionados.length > 0 && (
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Administradores seleccionados:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-800">
                {administradoresSeleccionados.map((admin) => (
                  <li key={admin}>{admin}</li>
                ))}
              </ul>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500  hover:bg-blue-600 text-black border border-[#080808] py-2 rounded mt-2"
          >
            Crear Obra
          </button>
        </form>
      </div>
    </>
  );
}

export default CrearObra;
