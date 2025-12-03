import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { VariableRow } from '@/types/excel';

interface EditableTableProps {
  title: string;
  data: VariableRow[];
  onChange: (data: VariableRow[]) => void;
}

const EditableTable: React.FC<EditableTableProps> = ({ title, data, onChange }) => {
  const handleValueChange = (id: string, field: 'variable' | 'valor', value: string) => {
    const updated = data.map(row =>
      row.id === id ? { ...row, [field]: value } : row
    );
    onChange(updated);
  };

  const handleAddRow = () => {
    const newRow: VariableRow = {
      id: `new-${Date.now()}`,
      variable: '',
      valor: '',
    };
    onChange([...data, newRow]);
  };

  const handleDeleteRow = (id: string) => {
    onChange(data.filter(row => row.id !== id));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        background: 'linear-gradient(180deg, #ffffff 0%, #fafbfc 100%)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" color="primary.dark">
          {title}
        </Typography>
        <Tooltip title="Agregar fila">
          <IconButton
            onClick={handleAddRow}
            size="small"
            sx={{
              bgcolor: 'primary.main',
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            <Add fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '45%' }}>Variable</TableCell>
              <TableCell sx={{ width: '45%' }}>Valor</TableCell>
              <TableCell sx={{ width: '10%' }} align="center">Acción</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                  No hay datos. Carga un archivo Excel o agrega filas manualmente.
                </TableCell>
              </TableRow>
            ) : (
              data.map(row => (
                <TableRow
                  key={row.id}
                  sx={{
                    '&:hover': { bgcolor: 'action.hover' },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell>
                    <TextField
                      value={row.variable}
                      onChange={e => handleValueChange(row.id, 'variable', e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="Nombre de variable"
                    />
                  </TableCell>
                  <TableCell>
                    <TextField
                      value={row.valor}
                      onChange={e => handleValueChange(row.id, 'valor', e.target.value)}
                      variant="outlined"
                      size="small"
                      fullWidth
                      placeholder="Valor"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Eliminar fila">
                      <IconButton
                        onClick={() => handleDeleteRow(row.id)}
                        size="small"
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default EditableTable;
