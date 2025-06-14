import React, { useState } from 'react';
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
import { Button, ListItemText } from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingMenu from './SettingMenu';
import { useLocale } from '../../../hooks/useLocale';
import { updateIsAfterLogin } from '../../../redux/reducers/authSlice';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import { red } from '@mui/material/colors';
import { CurrentUserId } from '../../../libs/auth/domain/current.user.id';
import { ContentDto } from '../../../libs/content/session/dto/content.dto';
import { CONTENT_CATEGORY } from '../../../general/constants/contentCategory';
import downloadImage from '../../../general/constants/downloadImage';
import DownloadIcon from '@mui/icons-material/Download';

type Props = {
    content: ContentDto;
    currentUserId: number;
    onDelete: (id) => void;
    onEdit?: (content: ContentDto) => void;
};

const ContentMenu = ({ content, currentUserId, onDelete, onEdit }: Props) => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { t } = useLocale();

    const openMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <React.Fragment>
            <IconButton onClick={openMenu}>
                <MoreVertIcon />
            </IconButton>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={closeMenu}
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
                transformOrigin={{
                    horizontal: 'right',
                    vertical: 'top',
                }}
                anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'bottom',
                }}
            >
                {content.categoryId === CONTENT_CATEGORY.IMAGE && (
                    <MenuItem
                        onClick={() => {
                            downloadImage(
                                content.deliverables,
                                content.prompt + '.png',
                            );
                            closeMenu();
                        }}
                    >
                        <ListItemIcon>
                            <DownloadIcon />
                        </ListItemIcon>
                        <ListItemText primary={t.form.download} />
                    </MenuItem>
                )}
                <MenuItem
                    onClick={async () => {
                        await navigator.clipboard.writeText(content.prompt);
                        closeMenu();
                    }}
                >
                    <ListItemIcon>
                        <ContentCopyIcon />
                    </ListItemIcon>
                    {t.form.copy}
                </MenuItem>
                {content.user.id === currentUserId && onEdit && (
                    <MenuItem
                        onClick={() => {
                            onEdit(content);
                            closeMenu();
                        }}
                    >
                        <ListItemIcon>
                            <EditIcon />
                        </ListItemIcon>
                        <ListItemText primary="編集" />
                    </MenuItem>
                )}
                {content.user.id === currentUserId && (
                    <MenuItem
                        onClick={() => {
                            onDelete(content.id);
                            closeMenu();
                        }}
                        sx={{ color: red[500] }}
                    >
                        <ListItemIcon sx={{ color: red[500] }}>
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText primary={t.form.delete} />
                    </MenuItem>
                )}
            </Menu>
        </React.Fragment>
    );
};

export default ContentMenu;
