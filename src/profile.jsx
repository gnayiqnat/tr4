import {
	Avatar,
	Box,
	Button,
	IconButton,
	Skeleton,
	Typography,
} from '@mui/material';
import { isMobile } from 'react-device-detect';
import { supabase } from './supabaseClient';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogoutRounded } from '@mui/icons-material';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';


export default function Profile({ isLoggedIn, setIsLoggedIn }) {
	const navigate = useNavigate();
	const isFlexing = useMediaQuery({ query: '(max-width: 439px)' });
	function handleLogout() {
		supabase.auth.signOut().then((r) => {
			r.error
				? console.log(r.error)
				: supabase.auth
						.getSession()

						.then((response) => {
							response.data.session
								? enqueueSnackbar(
										'Log out failed. Check console for more details.',
										{ variant: 'error', preventDuplicate: true }
								  )
								: setIsLoggedIn(false);
						});
		});
	}

	// Get username
	const [userID, setUserID] = useState('');
	const [thisDudesUsername, setThisDudesUsername] = useState('');
	useEffect(() => {
		if (isLoggedIn) {
			if (!userID) {
				supabase.auth.getUser().then((r) => {
					if (r.data) {
						setUserID(r.data.user.id);

						supabase
							.from('usernames')
							.select('username')
							.eq('user_id', r.data.user.id)
							.then((res) => {
								res.data && setThisDudesUsername(res.data[0].username);
							});
					} else {
						console.log(r);
					}
				});
			}
		}
	}, [isLoggedIn]);

	return (
		<motion.div initial={{opacity: 0}} animate={{opacity: 1}} transition={{duration: 0.5}}>
			{/* Design copied from the NextDNS account page */}
			<Box
				sx={{
					mt: 13,
					mb: 10,
					padding: isMobile ? '20px 20px' : '0px 90px',
					display: 'flex',
					justifyContent: 'center',

					flexDirection: 'column',
				}}
			>
				{/* 
                <Avatar
                    align='center'
                    sx={{ margin: 'auto', width: '100px', height: '100px' }}
                />
                */}
				<Box
					sx={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
						alignItems: 'center',
						gap: '20px',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-between',
							width: '80vw',
							maxWidth: '700px',
						}}
					>
						<Typography
							align='center'
							sx={{ fontFamily: 'Nunito', fontSize: '2rem', fontWeight: '500' }}
						>
							Profile
						</Typography>
					</Box>
					<Box
						sx={{
							/*
							borderColor: '#C8C8C8',
							borderStyle: 'solid',
							borderWidth: '1px',
							borderRadius: '5px',
							*/

							width: '75vw',
							maxWidth: '700px',
							padding: '15px',

							display: 'flex',
							flexDirection: 'row',
							flexWrap: 'wrap',
							alignItems: 'center',
							gap: '10px 50px',
						}}
					>
						<Box>
							<Typography
								sx={{
									fontFamily: 'Nunito',
									fontSize: '1.3rem',
									mr: 1,
								}}
							>
								Username:
							</Typography>
							<Typography
								sx={{ fontFamily: 'Nunito', fontSize: '1.1rem', opacity: 0.5 }}
							>
								{' '}
								{thisDudesUsername ? (
									thisDudesUsername
								) : (
									<Skeleton
										variant='text'
										animation='pulse'
										sx={{ fontSize: '1.1rem' }}
									/>
								)}
							</Typography>
						</Box>
						<Box>
							<Typography
								sx={{
									fontFamily: 'Nunito',
									fontSize: '1.3rem',
									mr: 1,
								}}
							>
								User ID:
							</Typography>
							<Typography
								sx={{ fontFamily: 'Nunito', fontSize: '1rem', opacity: 0.5 }}
							>
								{' '}
								{userID ? (
									userID
								) : (
									<Skeleton
										variant='text'
										animation='pulse'
										sx={{
											fontSize: '1rem',
											width: isFlexing ? '175px' : '350px',
											height: isFlexing && '48px',
										}}
									/>
								)}
							</Typography>
						</Box>
					</Box>

					<Box
						sx={{
							borderColor: '#dc3545',
							borderStyle: 'solid',
							borderWidth: '1px',
							borderRadius: '5px',

							width: '75vw',
							maxWidth: '700px',
							padding: '25px',

							display: 'flex',
							flexDirection: 'column',
							gap: '12px',
						}}
					>
						<Box>
							<Button
								sx={{
									textTransform: 'none',

									padding: '6px 20px',

									backgroundColor: '#dc3545',

									opacity: 0.9,
								}}
								onClick={() => {
									handleLogout();
								}}
							>
								<Typography
									sx={{
										color: '#ffffff',
										fontFamily: 'Nunito',
										fontWeight: '500',
										fontSize: '1.1rem',
									}}
								>
									Sign out
								</Typography>
							</Button>
						</Box>
						<Typography
							sx={{
								color: 'primary.main',
								fontFamily: 'Nunito',
								fontWeight: '400',
								opacity: 0.8,

								lineHeight: '1.1',
							}}
						>
							This will only take effect for your current session.
						</Typography>
					</Box>
				</Box>
			</Box>
		</motion.div>
	);
}
