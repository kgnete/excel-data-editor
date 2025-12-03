import React from 'react';
import { Button, Box, CircularProgress } from '@mui/material';
import { Save, Send, FileDownload, CloudUpload } from '@mui/icons-material';

interface ActionButtonsProps {
  onSaveSession: () => void;
  onPostApi: () => void;
  onDownloadSample: () => void;
  onLoadFile: () => void;
  isPosting: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSaveSession,
  onPostApi,
  onDownloadSample,
  onLoadFile,
  isPosting,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 2,
        justifyContent: 'center',
        mt: 4,
      }}
    >
      <Button
        variant="outlined"
        startIcon={<FileDownload />}
        onClick={onDownloadSample}
        sx={{
          borderColor: 'secondary.main',
          color: 'secondary.dark',
          '&:hover': {
            borderColor: 'secondary.dark',
            bgcolor: 'secondary.light',
            color: 'white',
          },
        }}
      >
        Descargar Excel Ejemplo
      </Button>

      <Button
        variant="outlined"
        startIcon={<CloudUpload />}
        onClick={onLoadFile}
        sx={{
          borderColor: 'primary.light',
          color: 'primary.main',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'primary.light',
            color: 'white',
          },
        }}
      >
        Cargar desde Public
      </Button>

      <Button
        variant="contained"
        startIcon={<Save />}
        onClick={onSaveSession}
        sx={{
          background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          },
        }}
      >
        Guardar en Sesión
      </Button>

      <Button
        variant="contained"
        startIcon={isPosting ? <CircularProgress size={20} color="inherit" /> : <Send />}
        onClick={onPostApi}
        disabled={isPosting}
      >
        {isPosting ? 'Enviando...' : 'Enviar a API'}
      </Button>
    </Box>
  );
};

export default ActionButtons;
