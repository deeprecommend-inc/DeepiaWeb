import React, { useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { AuthCurrentUserDto } from '../../../libs/auth/session/dto/auth.current.user.dto';
import { useAppSelector } from '../../../redux/hooks';
import EmailIcon from '@mui/icons-material/Email';
import { Button, DialogActions, ListItemIcon } from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';

const ListAccountItem = () => {
    const [open, setOpen] = useState(false);
    const currentUser: AuthCurrentUserDto = useAppSelector(
        (state) => state.auth.currentUser,
    );
    const dark = useAppSelector((state) => state.ui.dark);

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    return (
        <>
            <ListItem button key={'Account'} onClick={openDialog}>
                <ListItemIcon>
                    <PersonIcon />
                </ListItemIcon>
                <ListItemText primary={'Account'} style={{ color: dark ? '#B8B8B8' : '#707070' }}/>
            </ListItem>

            <Dialog open={open} maxWidth="xs">
                <DialogTitle>Account</DialogTitle>
                <List sx={{ pt: 0 }}>
                    <ListItem button key={`name:${currentUser?.name}`}>
                        <ListItemIcon>
                            <DriveFileRenameOutlineIcon />
                        </ListItemIcon>
                        <ListItemText primary={currentUser?.name} />
                    </ListItem>
                    <ListItem button key={`email:${currentUser?.email}`}>
                        <ListItemIcon>
                            <EmailIcon />
                        </ListItemIcon>
                        <ListItemText primary={currentUser?.email} />
                    </ListItem>
                </List>
                <DialogActions>
                    <Button onClick={closeDialog}  style={{ color: dark ? '#B8B8B8' : '#707070' }}>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ListAccountItem;
