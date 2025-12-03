import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { theme } from '@/theme/muiTheme';
import ExcelManager from '@/components/ExcelManager';

const Index = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          bgcolor: 'background.default',
          py: 2,
        }}
      >
        <ExcelManager />
      </Box>
    </ThemeProvider>
  );
};

export default Index;
