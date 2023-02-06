import * as React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import {
    Alert,
    FormControlLabel,
    Link,
    Snackbar,
    Switch,
    Tooltip,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { LogDto } from '../../libs/log/session/dto/log.dto';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setLogList, setSelectedLogs } from '../../redux/reducers/logSlice';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Order } from '../../general/types/Order';
import TableToolbar from '../atoms/tables/EnhancedTableToolbar';
import EnhancedTableHead from '../atoms/tables/EnhancedTableHead';
import { stableSort } from '../../general/functions/stableSort';
import { getComparator } from '../../general/functions/getComparator';
import { snackbarPosition } from '../../general/constants/snackbarPosition';
import Favicon from '../atoms/Favicon';
import TableEditLogCell from '../atoms/tables/TableEditLogCell';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import { setIFrames, updateTabNum } from '../../redux/reducers/uiSlice';
import AddCategoryLogCell from '../atoms/tables/AddCategoryLogCell';
import { asyncLocalStorage } from '../../general/utils/asyncLocalStorage';
import {
    denseKey,
    iFramesKey,
    likeNativeKey,
    perPageKey,
} from '../../general/constants/localStorageKey';
import LikeNatvie from '../template/LikeNative';
import {
    DragDropContext,
    Draggable,
    DraggableLocation,
    Droppable,
    DropResult,
} from 'react-beautiful-dnd';
import { logUiController } from '../../libs/log/presentation/log.ui.controler';
import { useLocale } from '../../hooks/useLocale';

export default function EnhancedTable() {
    const dispatch = useAppDispatch();
    const rows = useAppSelector((state) => state.log.list);
    const selected = useAppSelector((state) => state.log.selected);
    const iFrames = useAppSelector((state) => state.ui.iFrames);
    const categoryIdForGetLog = useAppSelector(
        (state) => state.category.categoryIdForGetLog,
    );

    const [mount, setMounted] = useState(false);
    const [order, setOrder] = useState<Order>('asc');
    const [orderBy, setOrderBy] = useState<keyof LogDto>('id');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [dense, setDenseState] = useState(false);
    const [likeNative, setLikeNativeState] = useState(false);
    const [openCopiedSnackbar, setOpenCopiedSnackbar] = useState(false);

    const { t } = useLocale();

    useEffect(() => {
        const init = async () => {
            setMounted(true);
            await setFromLocalStorage();
            await setRowPerPageFromLocalStorage();
        };

        init();
    }, []);

    const setFromLocalStorage = async () => {
        const dense = await asyncLocalStorage.getItem(denseKey);
        const likeNative = await asyncLocalStorage.getItem(likeNativeKey);

        Boolean(dense) ? await setDense(true) : await setDense(false);

        Boolean(likeNative)
            ? await setLikeNative(true)
            : await setLikeNative(false);
    };

    const setRowPerPageFromLocalStorage = async () => {
        const perPage = await asyncLocalStorage.getItem(perPageKey);

        setRowsPerPage(Number(perPage) ?? 20);
    };

    const setDense = async (bool: boolean) => {
        if (bool) {
            setDenseState(true);
            await asyncLocalStorage.setItem(denseKey, 'true');
        } else {
            setDenseState(false);
            await asyncLocalStorage.removeItem(denseKey);
        }
    };

    const setLikeNative = async (bool: boolean) => {
        if (bool) {
            setLikeNativeState(true);
            await asyncLocalStorage.setItem(likeNativeKey, 'true');
        } else {
            setLikeNativeState(false);
            await asyncLocalStorage.removeItem(likeNativeKey);
        }
    };

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof LogDto,
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (event.target.checked) {
            dispatch(setSelectedLogs(rows));
            return;
        }

        dispatch(setSelectedLogs([]));
    };

    const handleClickCheckBox = (
        event: React.MouseEvent<unknown>,
        log: LogDto,
    ) => {
        const selectedIndex = selected.map((val) => val.id).indexOf(log.id);
        let newSelected: LogDto[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, log);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        dispatch(setSelectedLogs(newSelected));
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        await asyncLocalStorage.setItem(perPageKey, event.target.value);
        setPage(0);
    };

    const isSelected = (log: LogDto) =>
        selected.map((o) => o.id).indexOf(log.id) !== -1;

    // Avoid a layout jump when reaching the last page with empty rows.
    const emptyRows = page;
    // page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

    const copyToClipboard = (link: string) => {
        navigator.clipboard.writeText(link).then(() => {
            successCopiedSnackbar();
        });
    };

    const successCopiedSnackbar = (reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpenCopiedSnackbar(true);
    };

    const handleCloseCopiedSnackbar = () => {
        setOpenCopiedSnackbar(false);
    };

    const handleChangeDense = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        await setDense(event.target.checked);
    };

    const handleChangeLikeNative = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        await setLikeNative(event.target.checked);
    };

    const addIFrame = async (link: string) => {
        const pushedData = iFrames.concat([link]);

        if (iFrames.length >= 4) pushedData.shift();

        await setIframeForLocalStorage(pushedData);
        dispatch(setIFrames(pushedData));
        dispatch(updateTabNum(4));
    };

    const setIframeForLocalStorage = async (data: string[]) => {
        const jsonData = JSON.stringify(data);
        await asyncLocalStorage.setItem(iFramesKey, jsonData);
    };

    const toDto = (model: any): LogDto => {
        return {
            id: Number(model.id),
            title: model.title,
            memo: model.memo,
            link: model.link,
            index: model.index,
            categories: model.categories,
            edit: `edit$${model.id}`,
            copy: `copy${model.id}`,
            iFrame: `iFrame${model.id}`,
            category: `category${model.id}`,
        };
    };

    const onDragEnd = async (result: any) => {
        if (
            result.source?.index === undefined ||
            result.source?.index === null ||
            result.destination?.index === undefined ||
            result.destination?.index === null
        )
            return;

        const logs = rows.slice(
            page * rowsPerPage,
            page * rowsPerPage + rowsPerPage,
        );
        const sourceIndex = result.source.index;
        const targetIndex = result.destination.index;

        if (
            sourceIndex > logs.length ||
            targetIndex > logs.length ||
            sourceIndex === targetIndex
        )
            return;

        const source = logs[sourceIndex];
        const target = logs[targetIndex];

        const newLogs = await logUiController.dragAndDrop({
            sourceId: source.id,
            targetId: target.id,
            categoryId: categoryIdForGetLog,
        });
        dispatch(setLogList(newLogs));
    };

    if (!mount) return <></>;

    return (
        <Box sx={{ width: '100%' }}>
            <Paper
                sx={{ width: '98%', mb: 2 }}
                style={{
                    background: 'transparent',
                    margin: '32px auto',
                }}
            >
                <TableToolbar numSelected={selected.length} />
                <div className="flex justify-end">
                    {/* <FormControlLabel
                        control={
                            <Switch
                                checked={likeNative}
                                onChange={handleChangeLikeNative}
                            />
                        }
                        label="Mobile"
                    /> */}
                    <FormControlLabel
                        control={
                            <Switch
                                checked={dense}
                                onChange={handleChangeDense}
                            />
                        }
                        label={t.dense}
                    />
                    <TablePagination
                        rowsPerPageOptions={[10, 20, 50, 100]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </div>
                <TableContainer>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                        />
                        <DragDropContext onDragEnd={onDragEnd}>
                            <Droppable droppableId="tableRows">
                                {(provided) => {
                                    return (
                                        <TableBody
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {/* if you don't need to support IE11, you can replace the `stableSort` call with:
                                            rows.slice().sort(getComparator(order, orderBy)) */}
                                            {rows
                                                .slice(
                                                    page * rowsPerPage,
                                                    page * rowsPerPage +
                                                        rowsPerPage,
                                                )
                                                .map((row, index) => {
                                                    const isItemSelected =
                                                        isSelected(toDto(row));
                                                    const labelId = `enhanced-table-checkbox-${index}`;

                                                    return (
                                                        <Draggable
                                                            key={String(row.id)}
                                                            draggableId={String(
                                                                row.id,
                                                            )}
                                                            index={index}
                                                        >
                                                            {(_provided) => {
                                                                return (
                                                                    <TableRow
                                                                        hover
                                                                        role="checkbox"
                                                                        aria-checked={
                                                                            isItemSelected
                                                                        }
                                                                        tabIndex={
                                                                            -1
                                                                        }
                                                                        key={Number(
                                                                            row.id,
                                                                        )}
                                                                        selected={
                                                                            isItemSelected
                                                                        }
                                                                        ref={
                                                                            _provided.innerRef
                                                                        }
                                                                        {..._provided.draggableProps}
                                                                        {..._provided.dragHandleProps}
                                                                    >
                                                                        <TableCell padding="checkbox">
                                                                            <Checkbox
                                                                                color="primary"
                                                                                checked={
                                                                                    isItemSelected
                                                                                }
                                                                                onClick={(
                                                                                    event,
                                                                                ) => {
                                                                                    handleClickCheckBox(
                                                                                        event,
                                                                                        toDto(
                                                                                            row,
                                                                                        ),
                                                                                    );
                                                                                }}
                                                                                inputProps={{
                                                                                    'aria-labelledby':
                                                                                        labelId,
                                                                                }}
                                                                            />
                                                                        </TableCell>
                                                                        <TableCell
                                                                            component="th"
                                                                            id={
                                                                                labelId
                                                                            }
                                                                            scope="row"
                                                                            padding="none"
                                                                        >
                                                                            <Favicon
                                                                                url={String(
                                                                                    row.link,
                                                                                )}
                                                                                width={
                                                                                    24
                                                                                }
                                                                                sz={
                                                                                    64
                                                                                }
                                                                            />
                                                                        </TableCell>
                                                                        <Tooltip
                                                                            title={
                                                                                row.memo
                                                                                    ? `${t.memo}: ${row.memo}`
                                                                                    : `${t.memo}: ${t.nothing}`
                                                                            }
                                                                            enterDelay={
                                                                                500
                                                                            }
                                                                            enterNextDelay={
                                                                                500
                                                                            }
                                                                            placement="right"
                                                                            arrow
                                                                        >
                                                                            <TableCell align="right">
                                                                                {
                                                                                    row.title
                                                                                }
                                                                            </TableCell>
                                                                        </Tooltip>
                                                                        <TableCell align="right">
                                                                            <Link
                                                                                href={String(
                                                                                    row.link,
                                                                                )}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                            >
                                                                                {
                                                                                    row.link
                                                                                }
                                                                            </Link>
                                                                        </TableCell>
                                                                        <TableCell align="left">
                                                                            <IconButton
                                                                                onClick={(
                                                                                    event,
                                                                                ) =>
                                                                                    copyToClipboard(
                                                                                        String(
                                                                                            row.link,
                                                                                        ),
                                                                                    )
                                                                                }
                                                                                className="p-0 m-0"
                                                                            >
                                                                                <ContentCopyIcon className="text-lg" />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                        <TableCell align="right">
                                                                            <IconButton
                                                                                onClick={async (
                                                                                    event,
                                                                                ) =>
                                                                                    await addIFrame(
                                                                                        String(
                                                                                            row.link,
                                                                                        ),
                                                                                    )
                                                                                }
                                                                                className="p-0 m-0"
                                                                            >
                                                                                <ScreenShareIcon className="text-lg" />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                        <AddCategoryLogCell
                                                                            log={toDto(
                                                                                row,
                                                                            )}
                                                                        />
                                                                        <TableEditLogCell
                                                                            editLog={toDto(
                                                                                row,
                                                                            )}
                                                                        />
                                                                    </TableRow>
                                                                );
                                                            }}
                                                        </Draggable>
                                                    );
                                                })}
                                            {provided.placeholder}
                                        </TableBody>
                                    );
                                }}
                            </Droppable>
                        </DragDropContext>
                    </Table>
                </TableContainer>
            </Paper>

            <Snackbar
                open={openCopiedSnackbar}
                anchorOrigin={snackbarPosition}
                autoHideDuration={1000}
                onClose={handleCloseCopiedSnackbar}
            >
                <Alert
                    onClose={handleCloseCopiedSnackbar}
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    {t.copied}
                </Alert>
            </Snackbar>
        </Box>
    );
}
