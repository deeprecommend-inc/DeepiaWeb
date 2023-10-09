import { Avatar, Box, ThemeProvider, Toolbar, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import { UserDto } from '../../libs/user/session/dto/user.dto';
import PersonIcon from '@mui/icons-material/Person';
import { useAppSelector } from '../../redux/hooks';
import { darkMode, lightMode } from '../../general/constants/theme';

const avatarSize = 100;

type Props = {
    user: UserDto;
    followers: number;
    contentsLength: number;
};

const AccountProfile = ({ user, followers, contentsLength }: Props) => {
    const dark = useAppSelector((state) => state.ui.dark);

    return (
        <ThemeProvider theme={dark ? darkMode : lightMode}>
            <Toolbar
                sx={{
                    width: '100%',
                    height: '120px',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                    }}
                >
                    {user?.image ? (
                        <Avatar
                            src={user?.image}
                            sx={{ width: avatarSize, height: avatarSize }}
                        />
                    ) : (
                        <Avatar sx={{ width: avatarSize, height: avatarSize }}>
                            <PersonIcon />
                        </Avatar>
                    )}
                    <Box
                        sx={{
                            marginLeft: 2, // ユーザ名と名前の左のスペース
                        }}
                    >
                        <Typography color="text.primary" className="">
                            <h1>{user?.username}</h1>
                        </Typography>
                        <Typography color="text.primary" className="">
                            <h1>{user?.name}</h1>
                        </Typography>
                        <Typography color="text.primary" className="">
                            <strong>{followers}</strong> Followers
                        </Typography>
                        <Typography color="text.primary" className="">
                            <strong>{contentsLength}</strong> Contents
                        </Typography>
                    </Box>
                </Box>
                <Typography color="text.primary">{user?.bio}</Typography>
            </Toolbar>
        </ThemeProvider>
    );
};

export default AccountProfile;
