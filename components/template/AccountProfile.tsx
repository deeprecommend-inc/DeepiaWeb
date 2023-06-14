import { Avatar } from '@mui/material';
import React, { useEffect } from 'react';
import { UserDto } from '../../libs/user/session/dto/user.dto';
import PersonIcon from '@mui/icons-material/Person';

type Props = {
    user: UserDto;
};

const AccountProfile = ({ user }: Props) => {
    return (
        <div>
            {user?.image ? (
                <Avatar src={user?.image} sx={{ width: 32, height: 32 }} />
            ) : (
                <Avatar sx={{ width: 32, height: 32 }}>
                    <PersonIcon />
                </Avatar>
            )}
            {user?.name}
        </div>
    );
};

export default AccountProfile;
