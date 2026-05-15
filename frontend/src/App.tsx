import './App.css'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { ExplorerPage } from './pages/ExplorerPage'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
    },
    secondary: {
      main: '#7c3aed',
    },
    success: {
      main: '#059669',
    },
    background: {
      default: '#f6f8fc',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily:
      "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: {
      fontSize: 'clamp(2.2rem, 5vw, 4.5rem)',
      fontWeight: 800,
      letterSpacing: '-0.02em',
      lineHeight: 1,
    },
    h2: {
      fontSize: '1.35rem',
      fontWeight: 750,
    },
    button: {
      fontWeight: 700,
      textTransform: 'none',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ExplorerPage />
    </ThemeProvider>
  )
}

export default App
