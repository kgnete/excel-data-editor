import * as XLSX from 'xlsx';
import { VariableRow, ExcelData } from '@/types/excel';

export const generateSampleExcel = (): void => {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Configuración General
  const sheet1Data = [
    ['Variable', 'Valor'],
    ['temperatura_max', Math.floor(Math.random() * 50) + 20],
    ['temperatura_min', Math.floor(Math.random() * 20)],
    ['humedad_objetivo', Math.floor(Math.random() * 40) + 40],
    ['presion_atmosferica', Math.floor(Math.random() * 100) + 1000],
    ['velocidad_viento', (Math.random() * 30).toFixed(2)],
  ];

  // Sheet 2: Parámetros de Sistema
  const sheet2Data = [
    ['Variable', 'Valor'],
    ['timeout_conexion', Math.floor(Math.random() * 60) + 10],
    ['max_reintentos', Math.floor(Math.random() * 5) + 1],
    ['intervalo_muestreo', Math.floor(Math.random() * 1000) + 100],
    ['buffer_size', Math.floor(Math.random() * 1024) + 256],
    ['debug_mode', Math.random() > 0.5 ? 1 : 0],
  ];

  const ws1 = XLSX.utils.aoa_to_sheet(sheet1Data);
  const ws2 = XLSX.utils.aoa_to_sheet(sheet2Data);

  XLSX.utils.book_append_sheet(wb, ws1, 'Configuracion');
  XLSX.utils.book_append_sheet(wb, ws2, 'Sistema');

  XLSX.writeFile(wb, 'datos_ejemplo.xlsx');
};

export const parseExcelFile = async (file: File | ArrayBuffer): Promise<ExcelData> => {
  const data = file instanceof File ? await file.arrayBuffer() : file;
  const workbook = XLSX.read(data, { type: 'array' });

  const sheetNames = workbook.SheetNames;
  
  const parseSheet = (sheetName: string): VariableRow[] => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return [];
    
    const jsonData = XLSX.utils.sheet_to_json<{ Variable: string; Valor: string | number }>(sheet);
    
    return jsonData.map((row, index) => ({
      id: `${sheetName}-${index}`,
      variable: row.Variable || '',
      valor: row.Valor ?? '',
    }));
  };

  return {
    sheet1: parseSheet(sheetNames[0] || ''),
    sheet2: parseSheet(sheetNames[1] || ''),
  };
};

export const loadExcelFromPublic = async (filename: string): Promise<ExcelData> => {
  const response = await fetch(`/${filename}`);
  if (!response.ok) {
    throw new Error(`No se pudo cargar el archivo: ${filename}`);
  }
  const arrayBuffer = await response.arrayBuffer();
  return parseExcelFile(arrayBuffer);
};
