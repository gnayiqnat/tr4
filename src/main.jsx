import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider, createTheme } from '@mui/material';

// Local files: React Components
import App from './App.jsx';
import './index.css';
import { AnimatePresence } from 'framer-motion';

const theme = createTheme({
    palette: { primary: { main: '#232932' }, secondary: { main: '#aeb8c6' } },
});

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <AnimatePresence>
            <ThemeProvider theme={theme}>
                <App />
            </ThemeProvider>
        </AnimatePresence>
    </React.StrictMode>
);
