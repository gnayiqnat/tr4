import { Box, Card, Typography } from '@mui/material';
import { motion } from 'framer-motion';

export default function Chat() {
    return (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ padding: '20px' }}
            >
                {' '}
                <Typography
                    sx={{
                        fontFamily: 'Nunito',
                        fontWeight: '600',
                        fontSize: '1.4rem',
                        ml: 0.5,
                    }}
                >
                    Chat
                </Typography>
                <Box
                    sx={{
                        mt: 3,
                        height: '60dvh',
                        display: 'grid',
                        gridTemplateRows: '1fr 1fr',
                        justifyContent: 'center',
                    }}
                >
                    <Card >
                        a
                    </Card>
                </Box>
            </motion.div>
        </>
    );
}
