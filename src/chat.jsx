import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import {
	Avatar,
	Box,
	Button,
	Card,
	CircularProgress,
	FormControl,
	Grid,
	IconButton,
	OutlinedInput,
	Typography,
} from '@mui/material';
import { AnimatePresence, motion, useAnimate } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabaseClient';

export default function Root({ chatViewActive, setchatViewActive }) {
	const navigate = useNavigate();
	const isMobile = useMediaQuery({ query: '(max-width: 600px)' });

	const [thisDudesUsername, setThisDudesUsername] = useState('');
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [messagesList, setMessagesList] = useState(['']);
	const [shouldAnimate, setShouldAnimate] = useState(false);

	useEffect(() => {
		if (messagesList == '') {
			supabase
				.from('chat_messages')
				.select('*')
				.order('created_at', { ascending: false }) // Descending order
				.limit(100)
				.then((response) => {
					!response.error &&
						(setMessagesList(response.data.reverse()),
						setShouldAnimate(true),
						document
							.getElementById('scrollToBottom')
							.scrollIntoView({ behavior: 'instant' }));
				});
		}

		const channel = supabase
			.channel('schema-db-changes')
			.on(
				'postgres_changes',
				{
					event: 'INSERT',
					schema: 'public',
					table: 'chat_messages',
				},
				(payload) => {
					if (payload.errors === null) {
						setMessagesList((prev) => [...prev, payload.new]);
					}
				}
			)
			.subscribe();

		return () => {
			channel.unsubscribe();
		};
	}, []);

	useEffect(() => {
		if (shouldAnimate) {
			document
				.getElementById('scrollToBottom')
				.scrollIntoView({ behavior: 'smooth' });
		}
	}, [messagesList]);

	const [userID, setUserID] = useState('');
	useEffect(() => {
		if (userID) {
			return;
		} else {
			supabase.auth
				.getUser()
				.then((r) => {
					setUserID(r.data.user.id);
					return r;
				})
				.then((r) => {
					supabase
						.from('usernames')
						.select('username')
						.eq('user_id', r.data.user.id)
						.then((response) => {
							console.log(response);
							response.data[0].username != null
								? setThisDudesUsername(response.data[0].username)
								: console.error('Username not found for this user');
						});
				});
		}
	}, []);

	useEffect(() => {
		supabase.auth
			.getSession()

			.then((response) => {
				response
					? response.data.session === null
						? (enqueueSnackbar('Please log in', {
								variant: 'error',
								preventDuplicate: true,
						  }),
						  navigate('/'))
						: setIsLoggedIn(true)
					: enqueueSnackbar('Server error, please try again later.', {
							variant: 'error',
					  });
			});
	}, []);

	return (
		<AnimatePresence>
			{shouldAnimate ? (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.25 }}
				>
					<Box sx={{ overflow: 'hidden' }}>
						<>
							{/* 
                            <Box
                                sx={{
                                    width: '100vw',
                                    position: 'fixed',
                                    backgroundColor: '#ffffff',
                                    padding: '10px 20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    gap: '0px 5px',
                                    
                                    zIndex: 999,
                                }}
                            >
                               
                                <Typography
                                    sx={{
                                        fontFamily: 'Nunito',
                                        fontWeight: '500',
                                        fontSize: '1.25rem',
                                        ml: 1,
                                    }}
                                >
                                   Chat
                                </Typography>
                            </Box>
                            */}

							<Grid
								container
								sx={{
									display: 'grid',
									justifyContent: 'end',
									height: '95lvh',
									paddingTop: !isMobile && '10px',
									paddingBottom: isMobile && '50px',
									maxWidth: '100vw',
									overflow: 'hidden',
								}}
							>
								<Grid
									item
									sx={{
										overflowY: 'scroll',
										width: '100vw',
										padding: '0px 20px',
										overflowX: 'hidden',
									}}
								>
									<Box sx={{ paddingTop: '60px' }} />
									<Typography align='center' sx={{mt:1,}}>You have reached the top. </Typography>
									{messagesList.length >= 1 &&
										messagesList.map((e, i) => {
											const isConsecutiveMessage =
												i > 0 && messagesList[i - 1].userID === e.userID;

											if (e.userID == userID) {
												return (
													<Sender
														text={e.text}
														key={i}
														isConsecutive={isConsecutiveMessage}
													/>
												);
											} else
												return (
													<Receiver
														text={e.text}
														username={e.username}
														key={i}
														isConsecutive={isConsecutiveMessage}
														isMobile={isMobile}
													/>
												);
										})}
									<Box id='scrollToBottom' sx={{ height: '70px' }} />
								</Grid>
								<Grid item>
									<Grid
										container
										sx={{
											alignItems: 'center',
											justifyContent: 'center',
										}}
									>
										<ChatBox
											userID={userID}
											isMobile={isMobile}
											thisDudesUsername={thisDudesUsername}
											setThisDudesUsername={setThisDudesUsername}
										/>
									</Grid>
								</Grid>
							</Grid>
						</>
					</Box>
				</motion.div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5 }}
				>
					<Box
						sx={{
							height: '100lvh',
							display: 'flex',
							flexDirection: 'column',
							justifyContent: 'center',
							alignItems: 'center',
							gap: '25px',
						}}
					>
						<CircularProgress />
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 5 }}
						>
							<a style={{ color: '#232932' }} href='/chat'>
								{' '}
								<Typography align='center' sx={{ maxWidth: '70vw' }}>
									Something seems to have went wrong. Reload page?
								</Typography>
							</a>{' '}
						</motion.div>
					</Box>
				</motion.div>
			)}
		</AnimatePresence>
	);
}

function Receiver({ text, username, isConsecutive, isMobile }) {
	return (
		<>
			<motion.div initial={{ x: -100 }} animate={{ x: 0 }}>
				<Grid
					container
					sx={{
						flexDirection: isMobile ? 'column' : 'row',
						justifyContent: 'start',
						gap: '10px',
						mt: isConsecutive ? 0.5 : 2,
					}}
				>
					<Grid item>
						{!isConsecutive && (
							<Typography
								sx={{
									marginLeft: '0.25rem',
									color: 'contrastColor',
								}}
							>
								{username}
							</Typography>
						)}
						<TextBlock type='receiver' text={text} />
					</Grid>
				</Grid>
			</motion.div>
		</>
	);
}

function Sender({ text, isConsecutive }) {
	return (
		<>
			<motion.div
				initial={{ x: 100 }}
				animate={{ x: 0 }}
				transition={{ duration: 0.2, type: 'spring' }}
			>
				<Grid
					container
					sx={{
						display: 'flex',
						justifyContent: 'end',
						padding: isConsecutive ? '2px 20px' : '5px 20px',
						paddingRight: '0px',
						flexWrap: 'nowrap',
						marginTop: isConsecutive ? '-2px' : '10px',
						paddingBottom: '3px',
					}}
				>
					<TextBlock type='sender' text={text} />
				</Grid>
			</motion.div>
		</>
	);
}

function TextBlock({ text, type }) {
	return (
		<>
			<Grid item>
				<Grid
					container
					sx={{
						maxWidth: '60vw',
						justifyContent: type === 'sender' ? 'end' : 'start',
					}}
				>
					<Card
						variant='outlined'
						sx={{
							backgroundColor: 'primary.main',
							color: 'white',
							padding: '10px 20px',
							borderRadius: '8px',

							lineBreak: 'anywhere',
							borderColor: 'secondary.main',
							borderWidth: '3px',
						}}
					>
						<Typography>{text}</Typography>
					</Card>
				</Grid>
			</Grid>
		</>
	);
}

function ChatBox({
	userID,
	isMobile,
	thisDudesUsername,
	setThisDudesUsername,
}) {
	const [chatboxInputValue, setChatboxInputValue] = useState('');

	async function pushValue() {
		if (chatboxInputValue !== '') {
			console.log('f', thisDudesUsername);
			supabase
				.from('chat_messages')
				.insert({
					username: thisDudesUsername,
					text: chatboxInputValue,
				})
				.select()
				.then(() => {
					setChatboxInputValue('');
				});
		}
		{
			/* 
            else {
			enqueueSnackbar('Please enter something', {
				variant: 'error',
				preventDuplicate: true,
			});
		}
            */
		}
	}

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				backgroundColor: 'white',
				padding: '0px 20px',
			}}
		>
			<Grid
				container
				sx={{
					padding: '0px 20px',
					paddingBottom: '30px',
					backgroundColor: '#ffffff',
					paddingTop: '10px',
					width: '100%',
					margin: '0px 30px',
					display: 'grid',
					position: 'fixed',
					bottom: -1,
					justifyContent: 'center',
					mb: isMobile && 6,
					gridTemplateColumns: '1fr 60px',
					gap: '10px',
				}}
			>
				<FormControl sx={{ flexDirection: 'row', width: '100%' }}>
					<OutlinedInput
						onChange={(e) => {
							setChatboxInputValue(e.target.value);
						}}
						value={chatboxInputValue}
						placeholder='Type a message'
						multiline
						fullWidth
						onKeyDownCapture={(e) => {
							e.key === 'Enter' && (e.preventDefault(), pushValue());
						}}
						onFocus={() => {document
							.getElementById('scrollToBottom')
							.scrollIntoView({ behavior: 'smooth' });}}
						sx={{ padding: '10px 15px', borderRadius: '10px' }}
					></OutlinedInput>
				</FormControl>
				<motion.div
					style={{ height: '100%' }}
					whileHover={{ scale: 0.9 }}
					whileTap={{ scale: 0.6 }}
				>
					<Button
						onClick={() => {
							pushValue();
						}}
						sx={{
							height: '100%',
							backgroundColor: 'primary.main',
							borderRadius: '10px',
							'&:hover': {
								backgroundColor: 'primary.main',
							},
						}}
					>
						<IoSend size={'16px'} color='white' />
					</Button>
				</motion.div>
			</Grid>
		</Box>
	);
}
