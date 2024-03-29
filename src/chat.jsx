import {
    Avatar,
    Box,
    Button,
    Card,
    FormControl,
    Grid,
    OutlinedInput,
    Typography,
} from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { IoIosSend } from 'react-icons/io';
import { useMediaQuery } from 'react-responsive';

export default function Root() {
    const isMobile = useMediaQuery({ query: '(max-width: 900px)' });
    const [messages, setMessages] = useState([
        {
            type: 'sender',
            message: 'sdgzsfgbxbxcbcx',
        },
        { type: 'receiver', message: 'qwrodo932' },
    ]);

    useEffect(() => {
        document.getElementById('scrollToBottom').scrollIntoView();
    }, [messages.length]);

    return (
        <>
            <Grid
                container
                sx={{
                    mt: isMobile ? 3 : 13,
                    height: isMobile ? '96%' : '77dvh',
                    overflow: 'hidden',
                    display: 'grid',
                    justifyContent: 'center',
                    gridTemplateRows: '1fr 75px',
                    maxHeight: '85dvh',
                    maxWidth: '100vw',
                }}
            >
                <Grid
                    item
                    sx={{
                        overflowY: 'scroll',
                        width: '100vw',
                        padding: '0px 20px',
                    }}
                >
                    {messages.map((e, i) => {
                        if (e.type === 'sender') {
                            return <Sender text={e.message} />;
                        } else if (e.type === 'receiver')
                            return <Receiver text={e.message} />;
                    })}
                    <Box id='scrollToBottom' sx={{ mt: 1 }} />
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
                            isMobile={isMobile}
                            setMessages={setMessages}
                            messages={messages}
                        />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

function Receiver(props) {
    const text = props.text;

    return (
        <>
            <Grid
                container
                sx={{
                    flexDirection: 'row',
                    justifyContent: 'start',
                    gap: '10px',
                    mt: 2,
                }}
            >
                <Grid item>
                    <Avatar sx={{ border: '1px solid primary.main' }} />
                </Grid>
                <Grid item>
                    <Typography
                        sx={{ marginLeft: '0.25rem', color: 'contrastColor' }}
                    >
                        Sir Lorem
                    </Typography>
                    <TextBlock type='receiver' text={text} />
                </Grid>
            </Grid>
        </>
    );
}

function Sender(props) {
    const text = props.text;

    return (
        <>
            <Grid
                container
                sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    padding: '5px 20px',
                    paddingRight: '0px',
                    flexWrap: 'nowrap',
                }}
            >
                <TextBlock type='sender' text={text} />
            </Grid>
        </>
    );
}

function TextBlock(props) {
    return (
        <>
            <Grid item>
                <Grid
                    container
                    sx={{
                        maxWidth: '60vw',
                        justifyContent:
                            props.type === 'sender' ? 'end' : 'start',
                    }}
                >
                    <Card
                        variant='outlined'
                        sx={{
                            backgroundColor: 'primary.main',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '13px',
                            borderTopRightRadius:
                                props.type === 'sender' && '0px',
                            borderTopLeftRadius:
                                props.type === 'receiver' && '0px',
                            lineBreak: 'anywhere',
                            borderColor: 'secondary.main',
                            borderWidth: '3px',
                        }}
                    >
                        <Typography>{props.text}</Typography>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
}

function ChatBox(props) {
    const [chatboxInputValue, setChatboxInputValue] = useState('');

    function pushValue() {
        if (chatboxInputValue !== '') {
            const inputMessage = {
                type: 'sender',
                message: chatboxInputValue,
            };
            props.setMessages([...props.messages, inputMessage]);
            setChatboxInputValue('');
        } else {
            window.alert('Please enter something');
        }
    }

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Grid
                container
                sx={{
                    margin: '0 auto',
                    backgroundColor: '#ffffff',
                    paddingTop: '10px',
                    width: props.isMobile ? '90vw' : '90%',
                    display: 'grid',
                    position: 'fixed',
                    bottom: -1,
                    justifyContent: 'center',
                    mb: props.isMobile && 10,
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
                        autoFocus
                        placeholder='Type a message'
                        multiline
                        fullWidth
                        onKeyDownCapture={(e) => {
                            e.key === 'Enter' &&
                                (e.preventDefault(), pushValue());
                        }}
                        sx={{ padding: '10px 15px', borderRadius: '10px' }}
                    ></OutlinedInput>
                </FormControl>
                <Button
                    onClick={() => {
                        pushValue();
                    }}
                    sx={{
                        maxHeight: '50px',
                        padding: '5px 0px',
                        backgroundColor: 'primary.main',
                        borderRadius: '10px',
                    }}
                >
                    <IoIosSend size={'30px'} color='white' />
                </Button>
            </Grid>
        </Box>
    );
}
