import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Alert,
  Snackbar,
  Grid,
  Chip,
} from '@mui/material';
import { TableChart, Storage } from '@mui/icons-material';
import EditableTable from './EditableTable';
import ActionButtons from './ActionButtons';
import { VariableRow } from '@/types/excel';
import { generateSampleExcel, loadExcelFromPublic } from '@/utils/excelUtils';

const ExcelManager: React.FC = () => {
  const [sheet1Data, setSheet1Data] = useState<VariableRow[]>([]);
  const [sheet2Data, setSheet2Data] = useState<VariableRow[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({ open: false, message: '', severity: 'info' });

  // Cargar datos de sesión al iniciar
  useEffect(() => {
    const savedData = sessionStorage.getItem('excelData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSheet1Data(parsed.sheet1 || []);
        setSheet2Data(parsed.sheet2 || []);
        showSnackbar('Datos recuperados de la sesión', 'info');
      } catch (e) {
        console.error('Error parsing session data:', e);
      }
    }
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error' | 'info') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSaveSession = () => {
    const dataToSave = {
      sheet1: sheet1Data,
      sheet2: sheet2Data,
      savedAt: new Date().toISOString(),
    };
    sessionStorage.setItem('excelData', JSON.stringify(dataToSave));
    showSnackbar('✅ Datos guardados en la sesión correctamente', 'success');
  };

  const handlePostApi = async () => {
    setIsPosting(true);
    try {
      const payload = {
        sheet1: sheet1Data,
        sheet2: sheet2Data,
        timestamp: new Date().toISOString(),
      };

      // Simular POST a API (reemplazar con URL real)
      const response = await fetch('https://httpbin.org/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const result = await response.json();
      console.log('API Response:', result);
      showSnackbar('✅ Datos enviados a la API correctamente', 'success');
    } catch (error) {
      console.error('Error posting to API:', error);
      showSnackbar('❌ Error al enviar datos a la API', 'error');
    } finally {
      setIsPosting(false);
    }
  };

  const handleDownloadSample = () => {
    generateSampleExcel();
    showSnackbar('📥 Archivo Excel de ejemplo descargado', 'success');
  };

  const handleLoadFromPublic = async () => {
    try {
      const data = await loadExcelFromPublic('datos.xlsx');
      setSheet1Data(data.sheet1);
      setSheet2Data(data.sheet2);
      showSnackbar('✅ Archivo cargado desde carpeta public', 'success');
    } catch (error) {
      console.error('Error loading file:', error);
      showSnackbar('⚠️ No se encontró datos.xlsx en public. Descarga el ejemplo primero.', 'error');
    }
  };

  const totalVariables = sheet1Data.length + sheet2Data.length;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        sx={{
          textAlign: 'center',
          mb: 5,
          p: 4,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)',
          color: 'white',
          boxShadow: '0 10px 40px rgba(30, 64, 175, 0.3)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
          <TableChart sx={{ fontSize: 48 }} />
          <Typography variant="h4" component="h1">
            Gestor de Variables Excel
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
          Lee, edita y envía variables desde archivos Excel con facilidad
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Chip
            icon={<Storage />}
            label={`${totalVariables} variables cargadas`}
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
          />
        </Box>
      </Box>

      {/* Action Buttons */}
      <ActionButtons
        onSaveSession={handleSaveSession}
        onPostApi={handlePostApi}
        onDownloadSample={handleDownloadSample}
        onLoadFile={handleLoadFromPublic}
        isPosting={isPosting}
      />

      {/* Tables Grid */}
      <Grid container spacing={3} sx={{ mt: 3 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <EditableTable
            title="📊 Hoja 1 - Configuración"
            data={sheet1Data}
            onChange={setSheet1Data}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <EditableTable
            title="⚙️ Hoja 2 - Sistema"
            data={sheet2Data}
            onChange={setSheet2Data}
          />
        </Grid>
      </Grid>

      {/* Info Alert */}
      <Alert
        severity="info"
        sx={{
          mt: 4,
          borderRadius: 2,
          '& .MuiAlert-icon': { alignItems: 'center' },
        }}
      >
        <strong>Instrucciones:</strong> Descarga el archivo Excel de ejemplo, colócalo en la carpeta{' '}
        <code>public/datos.xlsx</code> y luego carga los datos. Puedes editar las variables
        directamente en las tablas y guardarlas en sesión o enviarlas a una API.
      </Alert>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ExcelManager;
