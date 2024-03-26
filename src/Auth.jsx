import HCaptcha from '@hcaptcha/react-hcaptcha';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonOutlineRoundedIcon from '@mui/icons-material/PersonOutlineRounded';
import { Button, Card, Grid, InputAdornment, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { motion, useAnimate } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function Auth() {
    const navigate = useNavigate();

    const [scope, animate] = useAnimate();
    const [inputValue, setInputValue] = useState('');

    const [CEV, setCEV] = useState('');
    const [verifyOTPstep, setVerifyOTPstep] = useState(false);
    const [COTPV, setCOTPV] = useState('');

    function handleSignInSuccess() {
        enqueueSnackbar("You're now logged in.", {
            variant: 'success',
        }),
            setTimeout(() => {
                enqueueSnackbar('Redirecting, please wait.', {
                    variant: 'info',
                    preventDuplicate: true,
                });
            }, 1000),
            animate(ref.scope, { opacity: 0 }, { duration: 0.5 });
        setTimeout(() => {
            navigate('/dashboard');
        }, 2500);
    }
    async function signInRequest() {
        enqueueSnackbar('Processing request...', { variant: 'info' });
        supabase.auth
            .signInWithOtp({
                email: CEV,
                options: { shouldCreateUser: false },
            })
            .then((response) => {
                response.error === null && response.data.user === null
                    ? (enqueueSnackbar('Please check your inbox', {
                          variant: 'info',
                      }),
                      setVerifyOTPstep(true))
                    : enqueueSnackbar(response.error.message, {
                          variant: 'error',
                          preventDuplicate: true,
                      });
            });
        }
        useEffect(() => {
            if (COTPV.length === 6) {
                supabase.auth
                    .verifyOtp({
                        CEV,
                        token: COTPV,
                        type: 'email',
                    })
                    .then((response) =>
                        response.error
                            ? (enqueueSnackbar(response.error.message, {
                                  variant: 'error',
                                  preventDuplicate: true,
                              }),
                              setCOTPV(''))
                            : enqueueSnackbar(
                                  'User authenticated.',
                                  {
                                      variant: 'info',
                                  },
                                  handleSignInSuccess()
                              )
                    );
            }
        }, [COTPV]);
    

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

                        width: '96vw',
                        height: '96dvh',
                    }}
                >
                    <>
                        {verifyOTPstep ? (
                            <>
                                <VerifyOTP COTPV={COTPV} setCOTPV={setCOTPV} />
                            </>
                        ) : (
                            <>
                                <Typography
                                    align='center'
                                    sx={{
                                        fontSize: '1.8rem',
                                        fontFamily: 'Nunito',
                                        fontWeight: '500',
                                        mb: 3,
                                        mt: -2,
                                    }}
                                >
                                    Log in
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
                                        name='email'
                                        type='email'
                                        placeholder='Email'
                                        color='primary'
                                        value={CEV}
                                        inputProps={{
                                            style: { fontSize: '18px' },
                                        }}
                                        onChange={(e) => {
                                            setCEV(e.target.value);
                                        }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment
                                                    position='start'
                                                    sx={{ mr: '14px' }}
                                                >
                                                    <PersonOutlineRoundedIcon
                                                        sx={{
                                                            color: '#000000',
                                                        }}
                                                    />
                                                </InputAdornment>
                                            ),

                                            sx: {
                                                padding: '10px 10px',
                                            },
                                        }}
                                    />

                                    <Box
                                        sx={{
                                            mt: 5,
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Button
                                            sx={{
                                                backgroundColor: 'primary.main',
                                                padding: '15px',
                                                width: '100%',
                                                borderRadius: '80px',
                                                '&:hover': {
                                                    backgroundColor:
                                                        'primary.main',
                                                },
                                            }}
                                            onClick={() => {
                                                signInRequest();
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    opacity: 0.7,
                                                    fontFamily: 'Nunito',
                                                    textTransform: 'none',
                                                    color: 'hsl(216, 18%, 85%)',
                                                    fontWeight: '600',
                                                    fontSize: '18px',
                                                }}
                                            >
                                                Submit
                                            </Typography>
                                        </Button>{' '}
                                    </Box>
                                </Box>
                            </>
                        )}
                    </>
                </Box>
            </Box>
        </motion.div>
    );
}

function VerifyOTP({ COTPV, setCOTPV }) {
    return (
        <Grid container sx={{ justifyContent: 'center' }}>
            <Grid item>
                <Grid
                    container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        whiteSpace: 'nowrap',
                    }}
                >
                    <Box
                        noValidate
                        sx={{
                            width: 'clamp(70vw, 80vw, 400px)',
                            maxWidth: '400px',
                        }}
                    >
                        <Typography
                            align='center'
                            sx={{
                                fontSize: '1.8rem',
                                fontFamily: 'Nunito',
                                fontWeight: '500',
                                mb: 3,
                                mt: -2,
                            }}
                        >
                            Please verify your email address
                        </Typography>
                        <TextField
                            onKeyDown={(e) => {
                                e.key === 'Enter' &&
                                    COTPV.length !== 6 &&
                                    enqueueSnackbar('OTP contains 6 numbers', {
                                        variant: 'error',
                                    });
                            }}
                            margin='normal'
                            required
                            fullWidth
                            variant='standard'
                            name='email'
                            type='text'
                            placeholder='Enter OTP'
                            color='primary'
                            value={COTPV}
                            inputProps={{
                                style: { fontSize: '18px' },
                            }}
                            onChange={(e) => {
                                setCOTPV(e.target.value);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment
                                        position='start'
                                        sx={{ mr: '14px' }}
                                    >
                                        <LockOpenIcon
                                            sx={{
                                                color: '#000000',
                                            }}
                                        />
                                    </InputAdornment>
                                ),

                                sx: {
                                    padding: '10px 10px',
                                },
                            }}
                        />
                    </Box>
                </Grid>
            </Grid>
        </Grid>
    );
}
