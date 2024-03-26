import { Box, Typography } from '@mui/material';
import { isMobile } from 'react-device-detect';

export default function Profile() {
    return (
        <>
            <Box
                sx={{
                    mt: 13,
                    padding: isMobile ? '0px 20px' : '0px 90px',
                }}
            >
                <Typography sx={{ fontFamily: 'Nunito', fontSize: '2rem' }}>
                    Profile
                </Typography>
            </Box>
        </>
    );
}
