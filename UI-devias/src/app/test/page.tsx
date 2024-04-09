"use client"; 
import * as React from 'react';
import type { Metadata } from 'next';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { config } from '@/config';
import { paths } from '@/paths';

export default function NotFound(): React.JSX.Element {
    const [url, setUrl] = React.useState('');

    const handleSend = () => {
        // Handle sending the URL here
        console.log('Sending URL:', url);
        fetch(url)
            .then(response => {
                if (response.ok) {
                    // Handle successful response here
                    console.log('Success:', response);
                } else {
                    // Handle error response here
                    console.log('Error:', response);
                }
            })
            .catch(error => {
                // Handle fetch error here
                console.log('Fetch Error:', error);
            });
    };

    return (
        <Box component="main" sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: '100%' }}>
            <Stack spacing={3} sx={{ alignItems: 'center', maxWidth: 'md' }}>
                <Box>
                    <Box
                        component="img"
                        alt="Under development"
                        src="/assets/error-404.png"
                        sx={{ display: 'inline-block', height: 'auto', maxWidth: '100%', width: '400px' }}
                    />
                </Box>
                <Typography variant="h3" sx={{ textAlign: 'center' }}>
                    404: The page you are looking for isn&apos;t here
                </Typography>
                <Typography color="text.secondary" variant="body1" sx={{ textAlign: 'center' }}>
                    You either tried some shady route or you came here by mistake. Whichever it is, try using the navigation
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
                    <Button
                        onClick={handleSend}
                        startIcon={<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />}
                        variant="contained"
                    >
                        Send
                    </Button>
                </Box>
                <Button
                    component={RouterLink}
                    href={paths.home}
                    startIcon={<ArrowLeftIcon fontSize="var(--icon-fontSize-md)" />}
                    variant="contained"
                >
                    Go back to home
                </Button>
            </Stack>
        </Box>
    );
}