import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Link,
    ListItemIcon,
    ListItemText,
    MenuItem,
    Snackbar,
    SnackbarOrigin,
    TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import EditIcon from '@mui/icons-material/Edit';
import { Controller, useForm } from 'react-hook-form';
import { REGEXP } from '../../../general/utils/regExp';
import { useAppDispatch } from '../../../redux/hooks';
import { setLogList, setSelectedLogs } from '../../../redux/reducers/logSlice';
import { UpdateLogDto } from '../../../libs/log/session/dto/update.log.dto';
import { logUiController } from '../../../libs/log/presentation/log.ui.controler';
import { LogDto } from '../../../libs/log/session/dto/log.dto';
import { categoryIdForGetLogKey } from '../../../general/constants/localStorageKey';
import { asyncLocalStorage } from '../../../general/utils/asyncLocalStorage';
import { categoryLogUiController } from '../../../libs/category_log/presentation/category_log.ui.controller';
import { useLocale } from '../../../hooks/useLocale';

type Props = {
    editLog: LogDto;
    close: () => void;
};

const TableEditLogMenu = (props: Props) => {
    const { editLog , close } = props;
    const dispatch = useAppDispatch();
    const { handleSubmit, control, reset, setValue } = useForm();
    const [hasOpenedLogEditorDialog, setLogEditorDialogState] = useState(false);
    const { t } = useLocale();

    useEffect(() => {
        if (hasOpenedLogEditorDialog) {
            setValue('title', editLog.title);
            setValue('link', editLog.link);
            setValue('memo', editLog.memo ?? '');
        } 
    }, [hasOpenedLogEditorDialog]);

    const handleClickOpenEditorDialog = () => {
        setLogEditorDialogState(true);
        dispatch(setSelectedLogs([]));
    };

    const onSubmit = async (data: UpdateLogDto) => {
        if (!editLog.id) return;

        await logUiController.update(Number(editLog.id), data);

        const categoryId = await asyncLocalStorage.getItem(categoryIdForGetLogKey);
        const list = categoryId
            ? await categoryLogUiController.findAll(Number(categoryId))
            : await logUiController.findAll();
        dispatch(setLogList(list));

        resetUiAll();
    };

    const resetUiAll = () => {
        resetFormValue();
        reset();
        setLogEditorDialogState(false);
        dispatch(setSelectedLogs([]));
        close();
    };

    const resetFormValue = () => {
        reset({
            title: '',
            link: '',
            memo: '',
        });
    };

    return (
        <>
            <MenuItem
                onClick={(event) => handleClickOpenEditorDialog()}
            >
                <ListItemIcon>
                    <EditIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>{t.menu.edit}</ListItemText>
            </MenuItem>

            <Dialog open={hasOpenedLogEditorDialog} maxWidth="xs">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{t.dialog.editCategory.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t.dialog.editCategory.contentText}
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
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={resetUiAll} className="text-black">
                            {t.form.canncel}
                        </Button>
                        <Button type="submit" variant="outlined">
                            {t.form.update}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default TableEditLogMenu;
