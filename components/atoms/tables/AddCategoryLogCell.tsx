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
} from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { UpdateLogDto } from '../../../libs/log/session/dto/update.log.dto';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import GridViewIcon from '@mui/icons-material/GridView';
import { CategoryDto } from '../../../libs/category/session/dto/category.dto';
import { categoryLogUiController } from '../../../libs/category_log/presentation/category_log.ui.controller';
import { LogDto } from '../../../libs/log/session/dto/log.dto';

type Props = {
    log: LogDto;
};

const AddCategoryLogCell = (props: Props) => {
    const { log } = props;

    const { handleSubmit } = useForm();
    const [open, setOpen] = useState(false);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(
        [],
    );
    const categories = useAppSelector((state) => state.category.list);

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

        resetUiAll();
    };

    const resetUiAll = () => {
        setOpen(false);
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
            <TableCell align="right">
                <IconButton
                    className="p-0 m-0"
                    onClick={(event) => handleClickOpen()}
                >
                    <GridViewIcon className="text-lg" />
                </IconButton>
            </TableCell>

            <Dialog open={open} maxWidth="xs">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogTitle>Categories</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To save categories to log this website, please check
                            category and save here.
                        </DialogContentText>
                        {checkBoxes}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={resetUiAll} className="text-black">
                            Cancel
                        </Button>
                        <Button type="submit" variant="outlined">
                            Save
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </>
    );
};

export default AddCategoryLogCell;
