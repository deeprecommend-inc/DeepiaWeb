import {
    TableCell,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
    Button,
    Checkbox,
    FormControlLabel,
    ListItemIcon,
    ListItemText,
    MenuItem,
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UpdateLogDto } from '../../../libs/log/session/dto/update.log.dto';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import GridViewIcon from '@mui/icons-material/GridView';
import { CategoryDto } from '../../../libs/category/session/dto/category.dto';
import { categoryLogUiController } from '../../../libs/category_log/presentation/category_log.ui.controller';
import { LogDto } from '../../../libs/log/session/dto/log.dto';
import { categoryIdForGetLogKey } from '../../../general/constants/localStorageKey';
import { asyncLocalStorage } from '../../../general/utils/asyncLocalStorage';
import { logUiController } from '../../../libs/log/presentation/log.ui.controler';
import { setLogList } from '../../../redux/reducers/logSlice';
import { useLocale } from '../../../hooks/useLocale';

type Props = {
    log: LogDto;
    close: () => void;
};

const AddCategoryLogMenu = (props: Props) => {
    const { log, close } = props;
    
    const { t } = useLocale();
    const { handleSubmit } = useForm();
    const [open, setOpen] = useState(false);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
        [],
    );
    const categories = useAppSelector((state) => state.category.list);
    const dispatch = useAppDispatch();

    useEffect(() => {
        setSelectedCategoryIds(log.categories);
    }, [log]);

    const handleClickOpen = () => {
        setOpen(true);
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

    const onSubmit = async (data: UpdateLogDto) => {
        if (!log.id) return;

        await categoryLogUiController.update({
            logId: Number(log.id),
            categoryIds: selectedCategoryIds,
        });

        const categoryId = await asyncLocalStorage.getItem(categoryIdForGetLogKey);
        const list = categoryId
            ? await categoryLogUiController.findAll(Number(categoryId))
            : await logUiController.findAll();
        dispatch(setLogList(list));

        resetUiAll();
    };

    const resetUiAll = () => {
        setOpen(false);
        close();
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
        <>
            <MenuItem
                onClick={(event) => handleClickOpen()}
            >
                <ListItemIcon>
                    <GridViewIcon fontSize="small"/>
                </ListItemIcon>
                <ListItemText>{t.menu.category}</ListItemText>
            </MenuItem>

            <Dialog open={open} maxWidth="xs">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>{t.dialog.addCategories.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t.dialog.addCategories.contentText}
                        </DialogContentText>
                        {checkBoxes}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={resetUiAll} className="text-black">
                            {t.form.canncel}
                        </Button>
                        <Button type="submit" variant="outlined">
                            {t.form.save}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AddCategoryLogMenu;
