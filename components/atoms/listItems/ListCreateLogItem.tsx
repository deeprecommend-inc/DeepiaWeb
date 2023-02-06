import React, { useEffect, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { AuthCurrentUserDto } from '../../../libs/auth/session/dto/auth.current.user.dto';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import {
    Button,
    DialogActions,
    DialogContent,
    DialogContentText,
    ListItemIcon,
    SelectChangeEvent,
    TextField,
} from '@mui/material';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Controller, useForm } from 'react-hook-form';
import { REGEXP } from '../../../general/utils/regExp';
import { CreateLogDto } from '../../../libs/log/session/dto/create.log.dto';
import { setLogList } from '../../../redux/reducers/logSlice';
import { logUiController } from '../../../libs/log/presentation/log.ui.controler';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { CategoryDto } from '../../../libs/category/session/dto/category.dto';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import FormControl from '@mui/material/FormControl';
import { useLocale } from '../../../hooks/useLocale';

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

const ListCreateLogItem = () => {
    const dispatch = useAppDispatch();
    const [open, setOpen] = useState(false);
    const [isContinuous, setIsContinuous] = useState(false);
    const currentUser: AuthCurrentUserDto = useAppSelector(
        (state) => state.auth.currentUser,
    );
    const { handleSubmit, control, reset } = useForm();
    const categories = useAppSelector((state) => state.category.list);
    const categoryIds = categories.map((val) => val.id.toString());
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>(
        [],
    );
    const dark = useAppSelector((state) => state.ui.dark);
    const { t } = useLocale()

    useEffect(() => {
        resetFormValue();
    }, [open]);

    const toggleIsContinuous = () => {
        setIsContinuous(!isContinuous);
    };

    const openDialog = () => {
        setOpen(true);
    };

    const closeDialog = () => {
        setOpen(false);
    };

    const createLog = async (data: CreateLogDto) => {
        await logUiController.create({
            ...data,
            categoryIds: selectedCategoryIds.map((id) => Number(id)),
        });
        await setList();
        resetFormValue();

        if (!isContinuous) setOpen(false);
    };

    const setList = async () => {
        const list = await logUiController.findAll();
        dispatch(setLogList(list));
    };

    const resetFormValue = () => {
        reset({
            title: '',
            link: '',
            memo: '',
        });
        setSelectedCategoryIds([]);
    };

    const select = (event: SelectChangeEvent<typeof selectedCategoryIds>) => {
        const {
            target: { value },
        } = event;
        setSelectedCategoryIds(
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <>
            <ListItem button key={'New'} onClick={openDialog}>
                <ListItemIcon>
                    <ControlPointIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={t.leftNav.new}  style={{ color: dark ? '#B8B8B8' : '#707070' }} />
            </ListItem>

            <Dialog open={open} maxWidth="xs">
                <form onSubmit={handleSubmit(createLog)}>
                    <DialogTitle>{t.dialog.createLog.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t.dialog.createLog.contentText}
                        </DialogContentText>
                        <Controller
                            name={'title'}
                            control={control}
                            defaultValue=""
                            render={({
                                field: { onChange, value },
                                fieldState: { error },
                            }) => (
                                <TextField
                                    label={t.log.title}
                                    margin="dense"
                                    fullWidth
                                    required
                                    variant="standard"
                                    value={value}
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error ? error.message : null}
                                />
                            )}
                            rules={{
                                required: t.form.err.required.title,
                                maxLength: {
                                    value: 128,
                                    message: t.form.err.maxLen,
                                },
                            }}
                        />
                        <Controller
                            name={'link'}
                            control={control}
                            defaultValue=""
                            render={({
                                field: { onChange, value },
                                fieldState: { error },
                            }) => (
                                <TextField
                                    label={t.log.link}
                                    margin="dense"
                                    fullWidth
                                    required
                                    variant="standard"
                                    value={value}
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error ? error.message : null}
                                />
                            )}
                            rules={{
                                required: t.form.err.required.link,
                                pattern: {
                                    value: REGEXP.URL,
                                    message: t.form.err.pattern.link,
                                },
                                maxLength: {
                                    value: 512,
                                    message: t.form.err.maxLen,
                                },
                            }}
                        />
                        <Controller
                            name={'memo'}
                            control={control}
                            defaultValue=""
                            render={({
                                field: { onChange, value },
                                fieldState: { error },
                            }) => (
                                <TextField
                                    label={t.log.memo}
                                    fullWidth
                                    variant="standard"
                                    value={value}
                                    onChange={onChange}
                                    error={!!error}
                                    multiline
                                    rows={3}
                                    helperText={error ? error.message : null}
                                />
                            )}
                            rules={{
                                maxLength: {
                                    value: 512,
                                    message: t.form.err.maxLen,
                                },
                            }}
                        />
                        <FormControl sx={{ width: '100%', margin: '32px 0 0' }}>
                            <InputLabel id="multiple-checkbox-label">
                                {t.log.category}
                            </InputLabel>
                            <Select
                                labelId="multiple-checkbox-label"
                                id="multiple-checkbox"
                                multiple
                                value={selectedCategoryIds}
                                onChange={select}
                                input={<OutlinedInput label="Category" />}
                                renderValue={(selected) =>
                                    selected
                                        .map(
                                            (id) =>
                                                categories.find(
                                                    (val) =>
                                                        val.id.toString() ===
                                                        id,
                                                ).name,
                                        )
                                        .join(', ')
                                }
                                MenuProps={MenuProps}
                            >
                                {categoryIds.map((id) => (
                                    <MenuItem key={id} value={id}>
                                        <Checkbox
                                            key={id}
                                            value={id}
                                            checked={
                                                selectedCategoryIds.indexOf(
                                                    id,
                                                ) > -1
                                            }
                                        />
                                        <ListItemText
                                            primary={
                                                categories.find(
                                                    (val) =>
                                                        val.id.toString() ===
                                                        id,
                                                ).name
                                            }
                                        />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <FormControlLabel
                            style={{ margin: '0 auto 0 0' }}
                            control={<Checkbox onChange={toggleIsContinuous} />}
                            label={t.form.coutinuous}
                            labelPlacement="end"
                        />
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

export default ListCreateLogItem;
