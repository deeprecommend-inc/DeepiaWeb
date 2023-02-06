import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    ListItemText,
    Menu,
    MenuItem,
    Tooltip,
} from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import Favicon from '../atoms/Favicon';
import { LogDto } from '../../libs/log/session/dto/log.dto';
import { ButtonBase } from '@mui/material';
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap,
    move,
} from 'react-grid-dnd';
import { alpha, styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { logUiController } from '../../libs/log/presentation/log.ui.controler';
import { setLogList } from '../../redux/reducers/logSlice';
import EditIcon from '@mui/icons-material/Edit';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCategoryLogCell from '../atoms/tables/AddCategoryLogCell';
import TableEditLogCell from '../atoms/tables/TableEditLogCell';
import ScreenShareIcon from '@mui/icons-material/ScreenShare';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Alert, FormControlLabel, Link, Snackbar, Switch } from '@mui/material';
import { snackbarPosition } from '../../general/constants/snackbarPosition';
import { iFramesKey } from '../../general/constants/localStorageKey';
import { asyncLocalStorage } from '../../general/utils/asyncLocalStorage';
import { setIFrames, updateTabNum } from '../../redux/reducers/uiSlice';
import AddCategoryLogMenu from '../atoms/menu/AddCategoryLogMenu';
import TableEditLogMenu from '../atoms/menu/TableEditLogMenu';
import { useLocale } from '../../hooks/useLocale';

const titleStyle = {
    maxWidth: '80px',
    margin: '0 auto',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    color: '#707070',
};

const LikeNatvie = () => {
    const dispatch = useAppDispatch();
    const logs = useAppSelector((state) =>
        state.log.list.filter((log, index) => index < 64),
    );
    const [hasEventDragEnd, setEvnetDragEnd] = useState(false);
    const [ready, setReady] = useState(false);
    const [selected, setSelected] = useState(null);
    const gridContextProviderRef = useRef(null);
    const [isDrag, setIsDrag] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenuState = Boolean(anchorEl);
    const iFrames = useAppSelector((state) => state.ui.iFrames);
    const [openCopiedSnackbar, setOpenCopiedSnackbar] = useState(false);
    const categoryIdForGetLog = useAppSelector(
        (state) => state.category.categoryIdForGetLog,
    );
    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.palette.text.secondary,
        wordBreak: 'break-word',
        wordWrap: 'break-word',
        fontSize: '16px',
    }));
    const [hasOpenedLogRemoverDialog, setLogRemoverDialogState] =
        useState(false);
    const { t } = useLocale();

    useEffect(() => {
        setReady(true);
    }, []);

    const onDragEnd = async (sourceId, sourceIndex, targetIndex, targetId) => {
        setEvnetDragEnd(!hasEventDragEnd);

        if (
            sourceIndex >= logs.length ||
            targetIndex >= logs.length ||
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

    const onSubmitToDeleteLog = async () => {
        await logUiController.delete({
            ids: [selected.id],
        });
        const list = await logUiController.findAll();
        dispatch(setLogList(list));
        setLogRemoverDialogState(false);
    };

    const openLink = (link: string) => {
        window.open(link, '_blank', 'noopener noreferrer');
    };

    const openMenu = (
        event: React.MouseEvent<HTMLButtonElement>,
        log: LogDto,
    ) => {
        setSelected(log);
        setAnchorEl(event.currentTarget);
    };

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

    const addIFrame = async (link: string) => {
        const pushedData = iFrames.concat([link]);

        if (iFrames.length >= 4) pushedData.shift();

        await setIframeForLocalStorage(pushedData);
        dispatch(setIFrames(pushedData));
        dispatch(updateTabNum(3));
    };

    const setIframeForLocalStorage = async (data: string[]) => {
        const jsonData = JSON.stringify(data);
        await asyncLocalStorage.setItem(iFramesKey, jsonData);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const handleCloseCopiedSnackbar = () => {
        setOpenCopiedSnackbar(false);
    };

    const handleCloseDialog = () => {
        setLogRemoverDialogState(false);
    };

    const toDto = (model: any): LogDto => {
        return {
            id: Number(model?.id),
            title: model?.title,
            memo: model?.memo,
            link: model?.link,
            index: model?.index,
            categories: model?.categories,
            edit: `edit$${model?.id}`,
            copy: `copy${model?.id}`,
            iFrame: `iFrame${model?.id}`,
            category: `category${model?.id}`,
        };
    };

    if (!ready) return <></>;

    return (
        <>
            <Box
                sx={{ width: '95%', margin: '48px auto 0' }}
                ref={gridContextProviderRef}
            >
                <GridContextProvider onChange={onDragEnd}>
                    <GridDropZone
                        style={{
                            flex: '1',
                            height: gridContextProviderRef.current?.scrollHeight
                                ? gridContextProviderRef.current?.scrollHeight +
                                  'px'
                                : '100vh',
                        }}
                        id="category"
                        boxesPerRow={8}
                        rowHeight={200}
                    >
                        {logs.map((log) => (
                            <GridItem
                                key={log.id}
                                style={{ textAlign: 'center' }}
                            >
                                <Tooltip
                                    title={
                                        log.memo
                                            ? `MEMO: ${log.memo}`
                                            : 'MEMO: Nothing'
                                    }
                                    enterDelay={500}
                                    enterNextDelay={500}
                                    placement="top"
                                    arrow
                                >
                                    <ButtonBase
                                        sx={{
                                            width: '70%',
                                            margin: '0 auto',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            display: 'block',
                                        }}
                                        disableRipple
                                        onMouseDown={() => {
                                            setIsDrag(false);
                                        }}
                                        onMouseMove={() => {
                                            setIsDrag(true);
                                        }}
                                        onMouseUp={(e) => {
                                            if (
                                                !isDrag &&
                                                e.nativeEvent.button === 0
                                            ) {
                                                openLink(log.link);
                                                return;
                                            }

                                            if (e.nativeEvent.button === 2) {
                                                openMenu(e, log);
                                            }
                                        }}
                                    >
                                        <Favicon
                                            url={String(log.link)}
                                            sz={64}
                                            width={80}
                                            isEffectedStyle={true}
                                        />
                                        <div
                                            style={titleStyle}
                                            className="text-sm whitespace-nowrap"
                                        >
                                            {log.title}
                                        </div>
                                    </ButtonBase>
                                </Tooltip>
                            </GridItem>
                        ))}
                    </GridDropZone>
                </GridContextProvider>
            </Box>

            <Menu
                anchorEl={anchorEl}
                open={openMenuState}
                onClose={closeMenu}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
            >
                <MenuItem
                    onClick={() => {
                        copyToClipboard(String(selected.link));
                        closeMenu();
                    }}
                >
                    <ListItemIcon>
                        <ContentCopyIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t.menu.copy}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={async (event) =>
                        await addIFrame(String(selected.link))
                    }
                >
                    <ListItemIcon>
                        <ScreenShareIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t.menu.iFrame}</ListItemText>
                </MenuItem>
                <AddCategoryLogMenu log={toDto(selected)} close={closeMenu} />
                <TableEditLogMenu editLog={toDto(selected)} close={closeMenu} />
                <MenuItem
                    onClick={async (event) => {
                        setLogRemoverDialogState(true);
                        closeMenu();
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t.menu.delete}</ListItemText>
                </MenuItem>
            </Menu>

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
                        onClick={onSubmitToDeleteLog}
                    >
                        {t.form.delete}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default LikeNatvie;
