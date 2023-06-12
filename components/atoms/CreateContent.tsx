import React, { useEffect, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { AuthCurrentUserDto } from '../../libs/auth/session/dto/auth.current.user.dto';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    IconButton,
    ListItemIcon,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Controller, useForm } from 'react-hook-form';
import { REGEXP } from '../../general/utils/regExp';
import { CreateContentDto } from '../../libs/content/session/dto/create.content.dto';
import { setContentList } from '../../redux/reducers/contentSlice';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import { useLocale } from '../../hooks/useLocale';
import AddIcon from '@mui/icons-material/Add';
import { contentUiController } from '../../libs/content/presentation/content.ui.controler';
import { CONTENT_CATEGORY } from '../../general/constants/contentCategory';
import { useRouter } from 'next/router';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const CreateContent = () => {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [isContinuous, setIsContinuous] = useState(false);
    const currentUser: AuthCurrentUserDto = useAppSelector(
        (state) => state.auth.currentUser,
    );
    const { handleSubmit, control, reset } = useForm();
    const dark = useAppSelector((state) => state.ui.dark);
    const { t } = useLocale();
    const isAfterLogin = useAppSelector((state) => state.auth.isAfterLogin);
    const router = useRouter();

    useEffect(() => {
        resetFormValue();
    }, [open]);

    const openDialog = () => {
        if (isAfterLogin) {
            setOpen(true);
        } else {
            router.push('/login');
        }
    };

    const closeDialog = () => {
        setOpen(false);
    };

    const createContent = async (data: CreateContentDto) => {
        closeDialog();
        await contentUiController.create(data);
        await setList();
        resetFormValue();
    };

    const setList = async () => {
        const list = await contentUiController.findAll();
        dispatch(setContentList(list));
    };

    const resetFormValue = () => {
        reset({
            prompt: '',
            category: '',
        });
    };

    return (
        <>
            <IconButton onClick={openDialog}>
                <AddIcon />
            </IconButton>

            <Dialog open={open} maxWidth="xs">
                <form onSubmit={handleSubmit(createContent)}>
                    <DialogTitle>{t.dialog.createContent.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t.dialog.createContent.contentText}
                        </DialogContentText>
                        <div
                            style={{
                                display: 'flex',
                                gap: '8px',
                            }}
                        >
                            {/* @ts-ignore */}
                            <Controller
                                name={'prompt'}
                                control={control}
                                defaultValue=""
                                render={({
                                    field: { onChange, value },
                                    fieldState: { error },
                                }) => (
                                    <TextField
                                        label={t.content.prompt}
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
                                    required: t.form.err.required.prompt,
                                    maxLength: {
                                        value: 128,
                                        message: t.form.err.maxLen,
                                    },
                                }}
                            />
                            <Controller
                                name="categoryId"
                                control={control}
                                defaultValue={0}
                                render={({ field }) => (
                                    <Select {...field}>
                                        <MenuItem
                                            value={CONTENT_CATEGORY.IMAGE}
                                        >
                                            {t.image}
                                        </MenuItem>
                                        <MenuItem value={CONTENT_CATEGORY.TEXT}>
                                            {t.text}
                                        </MenuItem>
                                        <MenuItem
                                            value={CONTENT_CATEGORY.MUSIC}
                                            disabled
                                        >
                                            {t.music}
                                        </MenuItem>
                                        <MenuItem
                                            value={CONTENT_CATEGORY.VIDEO}
                                            disabled
                                        >
                                            {t.video}
                                        </MenuItem>
                                        <MenuItem
                                            value={CONTENT_CATEGORY.SPACE}
                                            disabled
                                        >
                                            {t.space}
                                        </MenuItem>
                                    </Select>
                                )}
                                rules={{
                                    required: t.form.err.required.category,
                                }}
                            />
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={closeDialog} className="text-black">
                            {t.form.canncel}
                        </Button>
                        <Button type="submit" variant="outlined">
                            {t.form.create}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default CreateContent;
