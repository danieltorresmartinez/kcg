import React from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import ExcelJS from "exceljs";

const ExportarObras: React.FC = () => {
  const columnas = [
    { header: "ID", key: "id", width: 20 },
    { header: "Código", key: "codigo", width: 15 },
    { header: "Jefe de Obra", key: "jefe", width: 25 },
    { header: "Administradores", key: "admins", width: 30 },
    { header: "Fecha Inicio", key: "inicio", width: 15 },
    { header: "Fecha Término", key: "termino", width: 15 },
    { header: "URL Orden Compra", key: "url_oc", width: 40 },
    { header: "Número OC", key: "numero_oc", width: 20 },
    { header: "Número Presupuesto", key: "numero_oc", width: 20 },
    { header: "Monto Neto", key: "monto", width: 15 },
    { header: "Cliente", key: "cliente", width: 30 },
  ];

  const aplicarEstilosEncabezado = (sheet: ExcelJS.Worksheet) => {
    sheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFFFF" } };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF1F4E78" },
      };
      cell.alignment = { horizontal: "center" };
    });
  };

  const exportarColeccion = async (
    nombreColeccion: string,
    nombreArchivo: string
  ) => {
    const obrasRef = collection(db, nombreColeccion);
    const snapshot = await getDocs(obrasRef);

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet(nombreColeccion);
    sheet.columns = columnas;

    snapshot.forEach((doc) => {
      const data = doc.data();
      sheet.addRow({
        id: doc.id,
        codigo: data.codigo || "",
        jefe: data.creadoPor || "",
        admins: Array.isArray(data.administradores)
          ? data.administradores.join(", ")
          : "",
        inicio: data.fechaCreacion || "",
        termino: data.fechaTermino || "",
        url_oc: data.ordenDeCompraURL || "",
        numero_oc: data.numeroPresupuesto || "",
        monto: data.montoPresupuesto || "",
        cliente: data.cliente || "",
      });
    });

    aplicarEstilosEncabezado(sheet);

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${nombreArchivo}.xlsx`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportarTodas = async () => {
    const colecciones = [
      "obras_activas",
      "obras_terminadas",
      "obras_facturadas",
    ];

    const workbook = new ExcelJS.Workbook();

    for (const col of colecciones) {
      const snapshot = await getDocs(collection(db, col));
      const sheet = workbook.addWorksheet(col);
      sheet.columns = columnas;

      snapshot.forEach((doc) => {
        const data = doc.data();
        sheet.addRow({
          id: doc.id,
          codigo: data.codigo || "",
          jefe: data.jefeObra || "",
          admins: Array.isArray(data.administradores)
            ? data.administradores.join(", ")
            : "",
          inicio: data.fechaInicio || "",
          termino: data.fechaTermino || "",
          url_oc: data.urlOrdenCompra || "",
          numero_oc: data.numeroOrdenCompra || "",
          monto: data.montoNetoPresupuesto || "",
          cliente: data.cliente || "",
        });
      });

      aplicarEstilosEncabezado(sheet);
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Todas_las_obras.xlsx";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={() => exportarColeccion("obras_activas", "Obras_Activas")}
        className="bg-green-600 text-black border px-4 py-2 rounded hover:bg-green-700"
      >
        Exportar Obras Activas
      </button>

      <button
        onClick={() =>
          exportarColeccion("obras_terminadas", "Obras_Terminadas")
        }
        className="bg-blue-600 text-black border px-4 py-2 rounded hover:bg-blue-700"
      >
        Exportar Obras Terminadas
      </button>

      <button
        onClick={() =>
          exportarColeccion("obras_facturadas", "Obras_Facturadas")
        }
        className="bg-yellow-600 text-black border px-4 py-2 rounded hover:bg-yellow-700"
      >
        Exportar Obras Facturadas
      </button>

      <button
        onClick={exportarTodas}
        className="bg-purple-600 text-black border px-4 py-2 rounded hover:bg-purple-700"
      >
        Exportar Todas
      </button>
    </div>
  );
};

export default ExportarObras;
