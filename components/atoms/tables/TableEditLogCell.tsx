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

type Props = {
    editLog: LogDto;
};

const TableEditLogCell = (props: Props) => {
    const { editLog } = props;

    const dispatch = useAppDispatch();
    const { handleSubmit, control, reset, setValue } = useForm();
    const [hasOpenedLogEditorDialog, setLogEditorDialogState] = useState(false);

    useEffect(() => {
        if (hasOpenedLogEditorDialog) {
            setValue('title', editLog.title);
            setValue('link', editLog.link);
            setValue('memo', editLog.memo ?? '');
        } else {
            resetUiAll();
        }
    }, [hasOpenedLogEditorDialog]);

    const handleClickOpenEditorDialog = () => {
        setLogEditorDialogState(true);
        dispatch(setSelectedLogs([]));
    };

    const onSubmit = async (data: UpdateLogDto) => {
        if (!editLog.id) return;

        await logUiController.update(Number(editLog.id), data);
        const list = await logUiController.findAll();
        dispatch(setLogList(list));

        resetUiAll();
    };

    const resetUiAll = () => {
        resetFormValue();
        reset();
        setLogEditorDialogState(false);
        dispatch(setSelectedLogs([]));
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
            <TableCell align="right">
                <IconButton
                    onClick={(event) => handleClickOpenEditorDialog()}
                    className="p-0 m-0"
                >
                    <EditIcon className="text-lg" />
                </IconButton>
            </TableCell>

            <Dialog open={hasOpenedLogEditorDialog} maxWidth="xs">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>Edit log</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To update log to this website, please rewrite your
                            title and link here.
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
                                    label="Title"
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
                                required: 'title required',
                                maxLength: {
                                    value: 128,
                                    message: 'Max length exceded',
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
                                    label="Link"
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
                                required: 'Link required',
                                pattern: {
                                    value: REGEXP.URL,
                                    message: 'Link should be url',
                                },
                                maxLength: {
                                    value: 512,
                                    message: 'Max length exceded',
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
                                    label="Memo"
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
                                    message: 'Max length exceeded',
                                },
                            }}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={resetUiAll} className="text-black">
                            Cancel
                        </Button>
                        <Button type="submit" variant="outlined">
                            Update
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default TableEditLogCell;
