import { useState } from 'react';
import { supabase } from './supabaseClient';
import { Box, TextField, Typography } from '@mui/material';
import { motion, useAnimate } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
export default function SetPassword() {
    const [scope, animate] = useAnimate();

    // Password
    const [newPassword, setNewPassword] = useState('');

    function handleSubmit() {
        supabase.auth.updateUser({ password: newPassword });
        enqueueSnackbar('Password change success', { variant: 'success' });
    }

    return (
        <>
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
                        <TextField></TextField>
                    </Box>
                </Box>
            </motion.div>
        </>
    );
}
