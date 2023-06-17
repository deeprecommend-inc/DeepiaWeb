import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState, useEffect } from 'react';
import Logo from '../atoms/Logo';
import LeftNav from '../organisms/LeftNav';
import { TabPanels } from '../molecules/TabPanels';
import AccountMenu from '../atoms/menu/AccountMenu';
import { useAppSelector } from '../../redux/hooks';
import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import AddIcon from '@mui/icons-material/Add';
import CreateContent from '../atoms/CreateContent';
import { SearchForm } from '../atoms/SearchFrom';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ToolbarMenu from './ToolbarMenu';
import LinearProgress from '@mui/material/LinearProgress';
import AccountProfile from './AccountProfile';

const drawerWidth = 240;
const drawerHeight = 148;

type Props = {
    isDetail: boolean;
    contents: any;
    window?: () => Window;
};

export const ResponsiveDrawer = (props: Props) => {
    const { window, isDetail } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const container =
        window !== undefined ? () => window().document.body : undefined;
    const dark = useAppSelector((state) => state.ui.dark);
    const isAfterLogin = useAppSelector((state) => state.auth.isAfterLogin);
    const router = useRouter();
    const currentUser = useAppSelector((state) => state.auth.currentUser);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        backgroundColor: dark ? '' : '#ffffff',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center',
                        }}
                    >
                        <SearchForm />
                    </Box>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            alignItems: 'center',
                        }}
                    >
                        <CreateContent />
                        <IconButton className="mx-2" disabled>
                            <NotificationsIcon />
                        </IconButton>
                        {isAfterLogin ? (
                            <AccountMenu />
                        ) : (
                            <Button
                                onClick={() => {
                                    router.push('/login');
                                }}
                            >
                                Log in
                            </Button>
                        )}
                    </Box>
                </Toolbar>
                <ToolbarMenu />
                {isDetail && <AccountProfile user={currentUser} />}
            </AppBar>
            <Box
                component="nav"
                sx={{
                    width: { sm: drawerWidth },
                    flexShrink: { sm: 0 },
                }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {<LeftNav key={'left-nav-1'} />}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {<LeftNav key={'left-nav-2'} />}
                </Drawer>
            </Box>
            <Box
                component="main"
                className="scroll-container"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    paddingTop: '64px!important',
                }}
            >
                {props.contents}
            </Box>
        </Box>
    );
};

export default ResponsiveDrawer;
