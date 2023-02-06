import React, { useEffect } from 'react';
import { alpha } from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Checkbox,
    FormControlLabel,
    TextField,
    InputAdornment,
} from '@mui/material';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setLogList, setSelectedLogs } from '../../../redux/reducers/logSlice';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { logUiController } from '../../../libs/log/presentation/log.ui.controler';
import ReplayIcon from '@mui/icons-material/Replay';
import { useForm } from 'react-hook-form';
import { CategoryDto } from '../../../libs/category/session/dto/category.dto';
import { categoryLogUiController } from '../../../libs/category_log/presentation/category_log.ui.controller';
import GridViewIcon from '@mui/icons-material/GridView';
import SearchIcon from '@mui/icons-material/Search';
import { setCategoryIdForGetLog } from '../../../redux/reducers/categorySlice';
import { asyncLocalStorage } from '../../../general/utils/asyncLocalStorage';
import { categoryIdForGetLogKey } from '../../../general/constants/localStorageKey';
import { useLocale } from '../../../hooks/useLocale';

type Props = {
    numSelected: number;
};

const EnhancedTableToolbar = (props: Props) => {
    const dispatch = useAppDispatch();
    const { numSelected } = props;
    const { handleSubmit } = useForm();
    const [hasOpenedLogRemoverDialog, setLogRemoverDialogState] =
        useState(false);
    const [saveCategoriesDialogState, setSaveCategoriesDialogState] =
        useState(false);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
        [],
    );
    const selectedLogs = useAppSelector((state) => state.log.selected);
    const categories = useAppSelector((state) => state.category.list);
    const [logsAll, setLogsAll] = useState([]);
    const { t } = useLocale();

    useEffect(() => {
        const init = async () => {
            const list = await logUiController.findAll();
            setLogsAll(list);
        };

        init();
    }, []);

    const reload = async () => {
        const logsAll = await logUiController.findAll();
        setLogsAll(logsAll)
        dispatch(setLogList(logsAll));
        dispatch(setCategoryIdForGetLog(null));
        await asyncLocalStorage.removeItem(categoryIdForGetLogKey);
    };

    const search = async (e) => {
        const value = e.target.value;
        const regexp = new RegExp(value, 'i');
        const searchedList = logsAll.filter((log) => log.title.match(regexp));

        dispatch(setLogList(searchedList));
    };

    const handleClickOpenUrls = () => {
        selectedLogs.forEach((log) => {
            window.open(log.link);
        });
    };

    const handleCloseDialog = () => {
        setLogRemoverDialogState(false);
        dispatch(setSelectedLogs([]));
    };

    const select = (category: CategoryDto, exists: boolean) => {
        if (exists) {
            const pushedData: number[] = selectedCategoryIds.filter(
                (selected) => selected !== category.id,
            );
            setSelectedCategoryIds(pushedData);
            return;
        }

        const pushedData: number[] = selectedCategoryIds.concat(category.id);
        setSelectedCategoryIds(pushedData);
    };

    const onSubmitToSaveCategories = async () => {
        await categoryLogUiController.addMany({
            logIds: selectedLogs.map((log) => log.id),
            categoryIds: selectedCategoryIds,
        });

        setSaveCategoriesDialogState(false);
    };

    const onSubmitToDeleteLogs = async () => {
        if (selectedLogs.length === 0) return;

        await logUiController.delete({
            ids: selectedLogs.map((log) => log.id),
        });
        const list = await logUiController.findAll();
        dispatch(setLogList(list));
        setLogRemoverDialogState(false);
        dispatch(setSelectedLogs([]));
    };

    const checkBoxes = categories.map((category) => {
        const exists = !!selectedCategoryIds.find(
            (selected) => selected === category.id,
        );

        return (
            <div key={category.id}>
                <FormControlLabel
                    value={exists}
                    checked={exists}
                    control={<Checkbox />}
                    label={category.name}
                    labelPlacement="end"
                    onChange={(e) => {
                        select(category, exists);
                    }}
                />
            </div>
        );
    });

    return (
        <Toolbar
            sx={{
                pl: { sm: 2 },
                pr: { xs: 1, sm: 1 },
                ...(numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(
                            theme.palette.primary.main,
                            theme.palette.action.activatedOpacity,
                        ),
                }),
            }}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: '1 1 100%' }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} {t.selected}
                </Typography>
            ) : (
                <>
                    <Tooltip
                        title={t.reload}
                        onClick={reload}
                        style={{ margin: '14px 0px 0 -10px' }}
                    >
                        <IconButton>
                            <ReplayIcon />
                        </IconButton>
                    </Tooltip>
                    <TextField
                        label={t.form.search}
                        type="search"
                        variant="standard"
                  
                        onInput={(e) => {
                            search(e);
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </>
            )}
            {numSelected > 0 ? (
                <>
                    <Tooltip title="Open">
                        <IconButton onClick={handleClickOpenUrls}>
                            <OpenInNewIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Open">
                        <IconButton
                            onClick={() => {
                                setSaveCategoriesDialogState(true);
                            }}
                        >
                            <GridViewIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                        <IconButton
                            onClick={() => {
                                setLogRemoverDialogState(true);
                            }}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </>
            ) : (
                <></>
            )}

            <Dialog open={hasOpenedLogRemoverDialog} maxWidth="xs">
                <DialogTitle>
                    <DeleteIcon color="error" className="p-0 mr-4" />
                    {t.dialog.deleteLog.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t.dialog.deleteLog.contentText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} className="text-black">
                        {t.form.canncel}
                    </Button>
                    <Button
                        type="submit"
                        variant="outlined"
                        color="error"
                        onClick={onSubmitToDeleteLogs}
                    >
                        {t.form.delete}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={saveCategoriesDialogState} maxWidth="xs">
                <form onSubmit={handleSubmit(onSubmitToSaveCategories)}>
                    <DialogTitle>{t.dialog.addCategories.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t.dialog.addCategories.contentText}
                        </DialogContentText>
                        {checkBoxes}
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                setSaveCategoriesDialogState(false);
                            }}
                            className="text-black"
                        >
                            {t.form.canncel}
                        </Button>
                        <Button type="submit" variant="outlined">
                            {t.form.save}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Toolbar>
    );
};

export default EnhancedTableToolbar;
