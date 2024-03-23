import React, { useEffect, useState } from 'react';
import {
    BrowserRouter,
    Route,
    Router,
    RouterProvider,
    Routes,
    createBrowserRouter,
    useNavigate,
} from 'react-router-dom';
import Auth from './Auth';

// Local files: React Components
import {
    Alert,
    AppBar,
    Avatar,
    Snackbar,
    Toolbar,
    Typography,
} from '@mui/material';
import { motion } from 'framer-motion';
import Dashboard from './Dashboard.jsx';

export default function App() {
    const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
    const [redirectSnackbarOpen, setRedirectSnackbarOpen] = useState(false);

    useEffect(() => {
        console.log('pasda');
    }, []);
    return (
        <>
            {' '}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                <SuccessSnackbar
                    successSnackbarOpen={successSnackbarOpen}
                    setSuccessSnackbarOpen={setSuccessSnackbarOpen}
                />
                <RedirectSnackbar
                    redirectSnackbarOpen={redirectSnackbarOpen}
                    setRedirectSnackbarOpen={setRedirectSnackbarOpen}
                />
                <BrowserRouter>
                    <NavBar />
                    <Routes>
                        <Route
                            path='/'
                            element={
                                <Auth
                                    setSuccessSnackbarOpen={
                                        setSuccessSnackbarOpen
                                    }
                                    setRedirectSnackbarOpen={
                                        setRedirectSnackbarOpen
                                    }
                                />
                            }
                        />
                        <Route path='/dashboard' element={<Dashboard />} />
                    </Routes>
                </BrowserRouter>
            </motion.div>{' '}
        </>
    );
}

function NavBar() {
    const navigate = useNavigate();
    return (
        <>
            <AppBar
                elevation={0}
                sx={{ backgroundColor: 'transparent', mt: 1.75 }}
            >
                <Toolbar sx={{}}>
                    <div
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            console.log('asda');
                            navigate('/');
                        }}
                    >
                        <Avatar
                            sx={{
                                borderRadius: 0,
                                width: '50px',
                                height: '50px',
                            }}
                            src='/logo.png'
                        />
                    </div>
                    {/* <Grid container sx={{ justifyContent: 'center' }}>
                        <Grid item>
                            <Tabs value={tabValue} centered>
                            <Tab
                                    sx={{
                                        textTransform: 'none',
                                        color: 'primary.main',
                                        fontFamily: 'Inter',
                                        fontWeight: '600',
                                        fontSize: '16px',
                                    }}
                                    label='Home'
                                /><Tab
                                sx={{
                                    textTransform: 'none',
                                    color: 'primary.main',
                                    opacity: 0.5,
                                    fontFamily: 'Inter',
                                    fontWeight: '500',
                                    fontSize: '16px',
                                }}
                                label='Pricing'
                            /><Tab
                            sx={{
                                textTransform: 'none',
                                color: 'primary.main',
                                fontFamily: 'Inter',
                                opacity: 0.5,
                                fontWeight: '500',
                                fontSize: '16px',
                            }}
                            label='About'
                        />
                            </Tabs>
                        </Grid>
                    </Grid> */}
                </Toolbar>
            </AppBar>
        </>
    );
}

function SuccessSnackbar({ successSnackbarOpen, setSuccessSnackbarOpen }) {
    return (
        <>
            {' '}
            <Snackbar
                open={successSnackbarOpen}
                onClose={() => {
                    setSuccessSnackbarOpen(false);
                }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                autoHideDuration={4000}
            >
                <Alert
                    severity='success'
                    sx={{
                        backgroundColor: 'rgba(56, 142, 60, 0.25)',
                        padding: '5px 80px 5px 18px',
                        borderRadius: '10px',
                        borderStyle: 'solid',
                        borderColor: 'rgba(56, 142, 60, 0.1)',
                        boxShadow: '0px 0px 25px rgba(56, 142, 60, 0.25)',
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: 'Inter',
                            fontWeight: '500',
                            color: '#388e3c',
                            mt: -0.2,
                        }}
                    >
                        Login Successful
                    </Typography>
                </Alert>
            </Snackbar>
        </>
    );
}

function RedirectSnackbar({ redirectSnackbarOpen, setRedirectSnackbarOpen }) {
    return (
        <>
            <Snackbar
                open={redirectSnackbarOpen}
                onClose={() => {
                    setRedirectSnackbarOpen(false);
                }}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                sx={{ mt: '70px' }}
                autoHideDuration={4000}
            >
                <Alert
                    severity='info'
                    sx={{
                        backgroundColor: 'rgba(2, 136, 209, 0.25)',
                        padding: '5px 50px 5px 18px',
                        borderRadius: '10px',
                        borderStyle: 'solid',
                        borderColor: 'rgba(2, 136, 209, 0.1)',
                        boxShadow: '0px 0px 25px rgba(2, 136, 209, 0.25)',
                    }}
                >
                    <Typography
                        sx={{
                            fontFamily: 'Inter',
                            fontWeight: '500',
                            color: '#0288d1',
                            mt: -0.2,
                        }}
                    >
                        Redirecting...
                    </Typography>
                </Alert>
            </Snackbar>
        </>
    );
}
