import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

interface ConstructorData {
  id: string;
  nombre: string;
  apellido: string;
  [key: string]: any;
}

const Constructores: React.FC = () => {
  const [constructores, setConstructores] = useState<ConstructorData[]>([]);

  useEffect(() => {
    const fetchConstructores = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "constructores"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as ConstructorData[];

        setConstructores(data);
      } catch (error) {
        console.error("Error al obtener constructores:", error);
      }
    };

    fetchConstructores();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Constructores</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {constructores.map((constructor) => (
          <div
            key={constructor.id}
            className="fas fa-hard-hat bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center hover:shadow-xl transition duration-300"
          >
            <h3 className="text-lg font-semibold">
              {constructor.nombre} {constructor.apellido}
            </h3>
            {/* Puedes agregar más datos aquí si lo deseas */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Constructores;
