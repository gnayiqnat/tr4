import LockOpenIcon from '@mui/icons-material/LockOpen';
import {
    Alert,
    Button,
    InputAdornment,
    Snackbar,
    Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import checkIfSignedIn from './supabaseClient';
import { motion, useAnimate } from 'framer-motion';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { Check } from '@mui/icons-material';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

export default function Auth({
    setRedirectSnackbarOpen,
    setSuccessSnackbarOpen,
}) {
    const navigate = useNavigate();
    const email = import.meta.env.VITE_APP_EMAIL;
    const pw = 'foo1';
    /* import.meta.env.VITE_APP_PASSWORD; */
    const [scope, animate] = useAnimate();

    const [CPV, setCPV] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    /* Snackbar */

    async function signInRequest() {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email,
            password: CPV,
        });
        if (data) {
            if (data.user.aud) {
                setIsAuthenticated(true);
                console.log('Authenticated');
                handleSignedIn();
            }
        }
    }

    async function handleSignedIn() {
        setSuccessSnackbarOpen(true);
        setTimeout(() => {
            setRedirectSnackbarOpen(true);
        }, 1000);

        setIsAuthenticated(true);
        setCPV('');
        setTimeout(() => {
            animate(scope.current, { opacity: 0 }, { duration: 0.5 });
        }, 1000);
        setTimeout(() => {
            navigate('/dashboard');
        }, 2500);
    }

    // check if signed in not working
    /*  useEffect(() => {
        const isSignedIn = checkIfSignedIn();
        if (isSignedIn) {
            console.log('You are signed in, redirecting...');
            handleSignedIn();
        }
    }, []); */

    useEffect(() => {
        if (pw === CPV) {
            handleSignedIn();
        }
    }, [CPV]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
        >
            <Box ref={scope}>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',

                        width: '99vw',
                        height: '96dvh',
                    }}
                >
                    {' '}
                    <Typography
                        variant='h5'
                        sx={{
                            fontFamily: 'Inter',
                            fontWeight: '600',
                            mb: 1.5,
                            mt: -3,
                        }}
                    >
                        Login
                    </Typography>
                    <Box
                        noValidate
                        sx={{
                            width: 'clamp(70vw, 80vw, 400px)',
                            maxWidth: '400px',
                        }}
                    >
                        <TextField
                            margin='normal'
                            required
                            fullWidth
                            variant='standard'
                            name='password'
                            type='password'
                            id='password'
                            placeholder='Enter password'
                            autoComplete='current-password'
                            color='primary'
                            value={CPV}
                            inputProps={{
                                style: { fontSize: CPV ? '23px' : '16px' },
                            }}
                            onChange={(e) => {
                                !isAuthenticated && setCPV(e.target.value);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment
                                        position='start'
                                        sx={{ mr: '14px' }}
                                    >
                                        <LockOpenIcon
                                            sx={{ color: '#000000' }}
                                        />
                                    </InputAdornment>
                                ),

                                sx: {
                                    padding: CPV ? '5px 10px' : '10px 10px',
                                },
                            }}
                        />
                    </Box>
                </Box>
            </Box>
        </motion.div>
    );
}
