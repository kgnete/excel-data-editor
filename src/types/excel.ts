export interface VariableRow {
  id: string;
  variable: string;
  valor: string | number;
}

export interface SheetData {
  name: string;
  data: VariableRow[];
}

export interface ExcelData {
  sheet1: VariableRow[];
  sheet2: VariableRow[];
}
