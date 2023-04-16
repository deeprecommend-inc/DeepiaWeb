import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import React from 'react';
import ListCommonItem from '../atoms/listItems/ListCommonItem';
import {
    Avatar,
    List,
    ListItemText,
    Tab,
    Tabs,
    Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import LogoutIcon from '@mui/icons-material/Logout';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { BasicTabs } from '../atoms/BasicTabs';
import Adsense from '../template/Adsence';
import InstallDesktopIcon from '@mui/icons-material/InstallDesktop';
import { asyncLocalStorage } from '../../general/utils/asyncLocalStorage';
import { accessTokenKey } from '../../general/constants/localStorageKey';
import ExtensionIcon from '@mui/icons-material/Extension';
import { spacing } from '@mui/system';
import { useLocale } from '../../hooks/useLocale';
import { useAnotherServices } from '../../hooks/anotherServices';
import { useAppSelector } from '../../redux/hooks';
import ListTipItem from '../atoms/listItems/ListTipItem';
import PaidIcon from '@mui/icons-material/Paid';
import Logo from '../atoms/Logo';
import { CopyrightContent } from '../molecules/CopyrightContent';
import { useMenus } from '../../hooks/menu';
import { AuthCurrentUserDto } from '../../libs/auth/session/dto/auth.current.user.dto';
import PersonIcon from '@mui/icons-material/Person';
import SimpleBar from 'simplebar-react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import 'simplebar/dist/simplebar.min.css';
import { UserDto } from '../../libs/user/session/dto/user.dto';

export const LeftNav = () => {
    const router = useRouter();
    const { t } = useLocale();
    const anotherServices = useAnotherServices();
    const menus = useMenus();
    const dark = useAppSelector((state) => state.ui.dark);
    const currentUser: AuthCurrentUserDto = useAppSelector(
        (state) => state.auth.currentUser,
    );
    const following: UserDto[] = useAppSelector(
        (state) => state.user.following,
    );

    const logout = async () => {
        await asyncLocalStorage.removeItem(accessTokenKey);
        router.push('login');
    };

    return (
        <div
            className="overflow-hidden"
            style={{ backgroundColor: dark ? '' : '#ffffff' }}
        >
            <Toolbar
                onClick={() => {
                    router.push('/');
                }}
            >
                <Logo />
                <Typography
                    variant="h5"
                    noWrap
                    component="div"
                    sx={{
                        color: dark ? '#B8B8B8' : '#000000',
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                        fontWeight: 600,
                    }}
                >
                    Deepia
                </Typography>
            </Toolbar>
            <Divider />
            <SimpleBar
                style={{
                    height: 'calc(100% - 64px)',
                }}
            >
                <List>
                    {menus.map((menu) => {
                        return (
                            <div key={menu.title}>
                                <ListCommonItem
                                    text={menu.title}
                                    iconElement={menu.iconElement}
                                    callback={() => {
                                        router.push(menu.link);
                                    }}
                                />
                            </div>
                        );
                    })}
                </List>
                <Divider />
                <List>
                    <div className="ml-4">{t.leftNav.following}</div>
                    {following.map((sample, index) => {
                        return (
                            <div key={index}>
                                <ListCommonItem
                                    text={currentUser?.name}
                                    iconElement={
                                        currentUser?.image ? (
                                            <Avatar
                                                src={currentUser?.image}
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                }}
                                            />
                                        ) : (
                                            <Avatar
                                                sx={{
                                                    width: 32,
                                                    height: 32,
                                                }}
                                            >
                                                <PersonIcon />
                                            </Avatar>
                                        )
                                    }
                                    callback={() => {
                                        router.push(currentUser?.name);
                                    }}
                                    isPurple={true}
                                />
                            </div>
                        );
                    })}
                </List>
                <List
                    sx={{
                        width: '100%',
                        bottom: 0,
                        left: 0,
                    }}
                >
                    <Divider />
                    {anotherServices.map((service) => {
                        return (
                            <div key={service.title}>
                                <ListCommonItem
                                    text={service.title}
                                    link={service.link}
                                    iconElement={service.iconElement}
                                />
                            </div>
                        );
                    })}
                    <CopyrightContent />
                </List>
            </SimpleBar>
        </div>
    );
};

export default LeftNav;
