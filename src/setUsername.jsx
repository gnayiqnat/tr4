import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import {
    Box,
    Button,
    Grid,
    InputAdornment,
    TextField,
    Typography,
} from '@mui/material';
import { motion, useAnimate } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from 'react-responsive';
import { PersonOutlineRounded } from '@mui/icons-material';

export default function SetUsername() {
    const [scope, animate] = useAnimate();
    const navigate = useNavigate();
    const isMobile = useMediaQuery({ query: '(max-width: 600px)' });

    const [userEmail, setUserEmail] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // Password
    const [newUsername, setNewUsername] = useState('');

    useEffect(() => {
        if (!userEmail) {
            supabase.auth.getSession().then((response) => {
                if (response.data.session) {
                    supabase.auth.getUser().then((response) => {
                        response.data.user.email &&
                            (setUserEmail(response.data.user.email),
                            setIsLoggedIn(true));
                    });
                } else {
                    enqueueSnackbar('Please log in', {
                        variant: 'error',
                        preventDuplicate: true,
                    });
                    navigate('/');
                }
            });
        }
    }, []);

    function handleSubmit() {
        if (newUsername) {
            supabase
                .from('usernames')
                .insert([{ username: newUsername }])
                .select()

                .then((response) => {
                    response.status === 201
                        ? (enqueueSnackbar('Username change success', {
                              variant: 'success',
                          }),
                          enqueueSnackbar('Redirecting you', {
                              variant: 'info',
                          }),
                          animate(
                              scope.current,
                              { opacity: 0 },
                              { duration: 0.5 },
                              setTimeout(() => {
                                  navigate('/dashboard');
                              }, 750)
                          ))
                        : (enqueueSnackbar(response.error.message, {
                              variant: 'error',
                          }),
                          setNewUsername(''));
                });
        } else {
            enqueueSnackbar('Fields cannot be empty', { variant: 'success' });
        }
    }

    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
            >
                {isLoggedIn && (
                    <Box
                        ref={scope}
                        sx={{ display: 'flex', padding: '0px 40px' }}
                    >
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                flexDirection: 'column',

                                width: '90vw',
                                maxWidth: '450px',
                                height: '96dvh',
                                margin: '0 auto',
                            }}
                        >
                            {' '}
                            <Typography
                                align='center'
                                sx={{
                                    fontSize: isMobile ? '1.6rem' : '1.8rem',
                                    fontFamily: 'Nunito',
                                    fontWeight: '500',
                                    mb: 1,
                                }}
                            >
                                Create a username
                            </Typography>
                            <TextField
                                margin='normal'
                                required
                                fullWidth
                                variant='standard'
                                name='username'
                                type='text'
                                placeholder='Username'
                                color='primary'
                                value={newUsername}
                                onKeyDown={(e) =>
                                    e.key === 'Enter' && handleSubmit()
                                }
                                inputProps={{
                                    style: { fontSize: '18px' },
                                }}
                                onChange={(e) => {
                                    setNewUsername(e.target.value);
                                }}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment
                                            position='start'
                                            sx={{ mr: '14px' }}
                                        >
                                            <PersonOutlineRounded
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
                            <SubmitButton handleSubmit={handleSubmit} />
                        </Box>
                    </Box>
                )}
            </motion.div>
        </>
    );
}

function SubmitButton({ handleSubmit }) {
    return (
        <>
            <Box
                sx={{
                    mt: 5,
                    display: 'flex',
                    justifyContent: 'center',
                    width: '110%',
                }}
            >
                <Button
                    sx={{
                        backgroundColor: 'primary.main',
                        padding: '15px',
                        width: '100%',
                        borderRadius: '80px',
                        '&:hover': {
                            backgroundColor: 'primary.main',
                        },
                    }}
                    onClick={() => {
                        handleSubmit();
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
        </>
    );
}
