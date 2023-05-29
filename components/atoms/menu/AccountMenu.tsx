import * as React from 'react';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import ListAccountMenu from './ListAccountMenu';
import router from 'next/router';
import { accessTokenKey } from '../../../general/constants/localStorageKey';
import { asyncLocalStorage } from '../../../general/utils/asyncLocalStorage';
import { AuthCurrentUserDto } from '../../../libs/auth/session/dto/auth.current.user.dto';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { Button } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingMenu from './SettingMenu';
import { useLocale } from '../../../hooks/useLocale';
import { updateIsAfterLogin } from '../../../redux/reducers/authSlice';

const AccountMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const currentUser: AuthCurrentUserDto = useAppSelector(
        (state) => state.auth.currentUser,
    );
    const { t } = useLocale();
    const dispatch = useAppDispatch();

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = async () => {
        await asyncLocalStorage.removeItem(accessTokenKey);
        dispatch(updateIsAfterLogin(false));
    };

    return (
        <React.Fragment>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                }}
            >
                {/* <Typography sx={{ minWidth: 100 }}>Contact</Typography>
        <Typography sx={{ minWidth: 100 }}>Profile</Typography> */}
                <Tooltip title={t.account.title}>
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 2 }}
                        aria-controls={open ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                    >
                        {currentUser?.image ? (
                            <Avatar
                                src={currentUser?.image}
                                sx={{ width: 32, height: 32 }}
                            />
                        ) : (
                            <Avatar sx={{ width: 32, height: 32 }}>
                                <PersonIcon />
                            </Avatar>
                        )}
                    </IconButton>
                </Tooltip>
            </Box>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: 'visible',
                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                        mt: 1.5,
                        '& .MuiAvatar-root': {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        '&:before': {
                            content: '""',
                            display: 'block',
                            position: 'absolute',
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: 'background.paper',
                            transform: 'translateY(-50%) rotate(45deg)',
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <ListAccountMenu close={handleClose} />
                <Divider />
                <SettingMenu close={handleClose} />
                <MenuItem onClick={logout}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    {t.account.logout}
                </MenuItem>
            </Menu>
        </React.Fragment>
    );
};

export default AccountMenu;
