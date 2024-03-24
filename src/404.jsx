import { Box, Typography } from '@mui/material';

export default function FourOFourPage() {
    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    height: '100dvh',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Box sx={{ mt: -10 }}>
                    <Typography
                        variant='h1'
                        align='center'
                        sx={{
                            fontFamily: 'Nunito',
                            fontWeight: '500',
                            color: 'primary.main',
                            opacity: 0.9,
                        }}
                    >
                        404
                    </Typography>
                    <Typography
                        variant='h6'
                        sx={{
                            fontFamily: 'Nunito',
                            fontWeight: '600',
                            mt: -1,
                            opacity: 0.8,
                        }}
                    >
                        Are you sure you have typed the correct url?
                    </Typography>
                </Box>
            </Box>
        </>
    );
}
