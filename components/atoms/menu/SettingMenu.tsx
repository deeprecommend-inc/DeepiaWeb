import Settings from '@mui/icons-material/Settings';
import {
    MenuItem,
    ListItemIcon,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Switch,
    FormControlLabel,
    FormControl,
    InputLabel,
    Select,
    SelectChangeEvent,
    Box,
    Divider,
    Drawer,
    List,
    ListItem,
    ListItemText,
    Toolbar,
    TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { darkModeKey } from '../../../general/constants/localStorageKey';
import { asyncLocalStorage } from '../../../general/utils/asyncLocalStorage';
import { useLocale } from '../../../hooks/useLocale';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setDark } from '../../../redux/reducers/uiSlice';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import PersonIcon from '@mui/icons-material/Person';
import { Controller, useForm } from 'react-hook-form';
import { toDataUrl } from '../../../general/functions/toDataurl';
import { userUiController } from '../../../libs/user/presentation/user.ui.controller';
import { CurrentUserId } from '../../../libs/auth/domain/current.user.id';
import { UserDto } from '../../../libs/user/session/dto/user.dto';
import { authUiController } from '../../../libs/auth/presentation/auth.ui.controller';
import { setCurrentUser } from '../../../redux/reducers/authSlice';

const SettingMenu = ({ close }) => {
    const [open, setOpen] = useState(false);
    const dispatch = useAppDispatch();
    const dark = useAppSelector((state) => state.ui.dark);
    const { t } = useLocale();
    const [lang, setLang] = useState('');
    const router = useRouter();
    const [isApplicationSetting, setApplicationSetting] = useState(false);
    const { handleSubmit, control, reset, setValue, getValues } = useForm();
    const [dataurl, setDataurl] = useState('');
    const [fileName, setFileName] = useState('');
    const currentUser = useAppSelector((state) => state.auth.currentUser);

    useEffect(() => {
        setValue('name', currentUser?.name);
        setDataurl(currentUser?.image);
        setFromLocalStorage();
    }, []);

    const handleChange = (event: SelectChangeEvent) => {
        setLang(event.target.value as string);
        router.push('/', '/', { locale: event.target.value });
    };

    const setFromLocalStorage = async () => {
        const dark = await asyncLocalStorage.getItem(darkModeKey);

        Boolean(dark) ? dispatch(setDark(true)) : dispatch(setDark(false));
    };

    const setDense = async (bool: boolean) => {
        if (bool) {
            dispatch(setDark(true));
            await asyncLocalStorage.setItem(darkModeKey, 'true');
        } else {
            dispatch(setDark(false));
            await asyncLocalStorage.removeItem(darkModeKey);
        }
    };

    const inputImage = async (event: any) => {
        const file = event.target.files[0];
        const dataurl = await toDataUrl(file, { maxWidth: 640 });
        setDataurl(dataurl);
        setFileName(file.name);
        event.target.value = null;
    };

    return (
        <>
            <MenuItem
                onClick={() => {
                    setOpen(true);
                }}
            >
                <ListItemIcon>
                    <Settings fontSize="small" />
                </ListItemIcon>
                {t.account.setting}
            </MenuItem>

            <Dialog open={open}>
                <DialogTitle>{t.account.setting}</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex' }}>
                        <Box sx={{ overflow: 'auto', marginRight: '8px' }}>
                            <List>
                                <ListItem
                                    button
                                    key={'Account'}
                                    onClick={() => {
                                        setApplicationSetting(false);
                                    }}
                                >
                                    <ListItemIcon>
                                        <PersonIcon />
                                    </ListItemIcon>
                                    <ListItemText primary={t.account.name} />
                                </ListItem>
                                <ListItem
                                    button
                                    key={'Setting'}
                                    onClick={() => {
                                        setApplicationSetting(true);
                                    }}
                                >
                                    <ListItemIcon>
                                        <Settings />
                                    </ListItemIcon>
                                    <ListItemText primary={t.account.setting} />
                                </ListItem>
                            </List>
                        </Box>
                        <Box
                            component="main"
                            sx={{ width: '300px', margin: '0 24px' }}
                        >
                            {isApplicationSetting ? (
                                <>
                                    <FormControl fullWidth className="mt-2">
                                        <InputLabel id="demo-simple-select-label">
                                            {t.account.lang}
                                        </InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={lang}
                                            label={t.account.lang}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value={'en'}>
                                                English
                                            </MenuItem>
                                            <MenuItem value={'ja'}>
                                                日本語
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControlLabel
                                        className="mt-4"
                                        control={
                                            <Switch
                                                checked={dark}
                                                onChange={(e) => {
                                                    setDense(e.target.checked);
                                                }}
                                            />
                                        }
                                        label={t.darkMode}
                                    />
                                </>
                            ) : (
                                <>
                                    <Controller
                                        name={'name'}
                                        control={control}
                                        defaultValue=""
                                        render={({
                                            field: { onChange, value },
                                            fieldState: { error },
                                        }) => (
                                            <TextField
                                                label={t.user.name}
                                                margin="dense"
                                                fullWidth
                                                required
                                                variant="standard"
                                                value={value}
                                                onChange={onChange}
                                                error={!!error}
                                                helperText={
                                                    error ? error.message : null
                                                }
                                            />
                                        )}
                                        rules={{
                                            required: t.form.err.required.name,
                                            maxLength: {
                                                value: 128,
                                                message: t.form.err.maxLen,
                                            },
                                        }}
                                    />
                                    <div className="flex my-4">
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            size="small"
                                        >
                                            {t.form.icon}
                                            <input
                                                type="file"
                                                accept="image/png, image/jpg"
                                                hidden
                                                onInput={inputImage}
                                            />
                                        </Button>
                                        <div className="ml-2">{fileName}</div>
                                    </div>
                                </>
                            )}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        className="text-black"
                        onClick={async () => {
                            setOpen(false);
                            close();
                            if (
                                currentUser.name !== getValues('name') ||
                                currentUser.image !== dataurl
                            ) {
                                await userUiController.update(currentUser.id, {
                                    name: getValues('name'),
                                    email: currentUser.email,
                                    image: dataurl,
                                });
                                const user =
                                    await authUiController.currentUser();
                                dispatch(setCurrentUser(user));
                            }
                        }}
                    >
                        {t.form.close}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SettingMenu;
