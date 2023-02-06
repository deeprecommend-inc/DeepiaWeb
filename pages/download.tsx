import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import StarIcon from '@mui/icons-material/StarBorder';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import GlobalStyles from '@mui/material/GlobalStyles';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Logo from '../components/atoms/Logo';
import { NextSeo } from 'next-seo';

const tiers = [
    {
        title: 'Windows',
        osImg: '/windows.png',
        buttonDisabled: false,
        downloadFile:
            'https://deep-log.s3.ap-northeast-1.amazonaws.com/DeepLog+Setup+0.0.2.exe',
    },
    {
        title: 'MacOS',
        osImg: '/mac.png',
        buttonDisabled: false,
        downloadFile:
            'https://deep-log.s3.ap-northeast-1.amazonaws.com/DeepLog-0.0.2.dmg',
    },
    {
        title: 'Linux',
        buttonDisabled: false,
        osImg: '/linux.png',
        downloadFile:
            'https://deep-log.s3.ap-northeast-1.amazonaws.com/DeepLog-0.0.2.AppImage',
    },
];

function DownloadContent() {
    return (
        <>
            <NextSeo title="DeepLog" description="Download DeepLog Desktop" />
            <React.Fragment>
                <GlobalStyles
                    styles={{
                        ul: { margin: 0, padding: 0, listStyle: 'none' },
                    }}
                />
                <CssBaseline />
                <AppBar
                    position="fixed"
                    elevation={0}
                    sx={{
                        width: '100vw',
                    }}
                >
                    <Toolbar className="bg-white">
                        <Logo />
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            className="text-black"
                        >
                            DeepLog
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Container
                    disableGutters
                    maxWidth="sm"
                    component="main"
                    sx={{ pt: 12, pb: 6 }}
                >
                    <Typography
                        component="h1"
                        variant="h2"
                        align="center"
                        color="text.primary"
                        gutterBottom
                    >
                        Download
                    </Typography>
                    <Typography
                        variant="h5"
                        align="center"
                        color="text.secondary"
                        component="p"
                    >
                        Choose the right application for your environment.
                    </Typography>
                </Container>
                {/* End hero unit */}
                <Container maxWidth="md" component="main">
                    <Grid container spacing={5} alignItems="flex-end">
                        {tiers.map((tier) => (
                            // Enterprise card is full width at sm breakpoint
                            <Grid
                                item
                                key={tier.title}
                                xs={12}
                                sm={tier.title === 'Enterprise' ? 12 : 6}
                                md={4}
                            >
                                <Card>
                                    <CardHeader
                                        title={tier.title}
                                        titleTypographyProps={{
                                            align: 'center',
                                        }}
                                        subheaderTypographyProps={{
                                            align: 'center',
                                        }}
                                        sx={{
                                            backgroundColor: (theme) =>
                                                theme.palette.mode === 'light'
                                                    ? theme.palette.grey[200]
                                                    : theme.palette.grey[700],
                                        }}
                                    />
                                    <CardContent>
                                        <img src={tier.osImg} />
                                    </CardContent>
                                    <CardActions>
                                        <Button
                                            fullWidth
                                            disabled={tier.buttonDisabled}
                                            variant={'outlined'}
                                            href={tier.downloadFile}
                                        >
                                            Download
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </React.Fragment>
        </>
    );
}

export default function Download() {
    return <DownloadContent />;
}
