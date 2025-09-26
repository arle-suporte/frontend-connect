import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface FieldMap {
  [key: string]: string; // campo original → nome da coluna no Excel
}

/**
 * Exporta dados para XLSX, permitindo escolher colunas e renomear
 *
 * @param data - Array de objetos (ex: [{contato: "Levi", status: "in_progress"}])
 * @param filename - Nome do arquivo
 * @param fieldMap - Campos a exportar e seus rótulos no Excel
 */
export function exportToXLSX(
  data: any[],
  filename: string = "export.xlsx",
  fieldMap: FieldMap
) {
  if (!data || data.length === 0) {
    console.warn("Nenhum dado para exportar.");
    return;
  }

  // Montar apenas os campos definidos em fieldMap
  const filteredData = data.map((row) => {
    const newRow: any = {};
    for (const key in fieldMap) {
      newRow[fieldMap[key]] = row[key] ?? ""; // usa o label do mapa
    }
    return newRow;
  });

  const worksheet = XLSX.utils.json_to_sheet(filteredData);

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, filename);
}
