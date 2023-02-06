import {
    Avatar,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Grid,
    Link,
    ListItemText,
    Menu,
    MenuItem,
    Switch,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import React, { useState, useEffect, useRef } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import AddIcon from '@mui/icons-material/Add';
import { ButtonBase } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { CreateCategoryDto } from '../../libs/category/session/dto/create.category.dto';
import { categoryUiController } from '../../libs/category/presentation/category.ui.controller';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
    setCategoryIdForGetLog,
    setCategoryList,
} from '../../redux/reducers/categorySlice';
import { FromAction, fromAction } from '../../general/utils/from.action';
import { UpdateCategoryDto } from '../../libs/category/session/dto/update.category.dto';
import { CategoryDto } from '../../libs/category/session/dto/category.dto';
import { categoryLogUiController } from '../../libs/category_log/presentation/category_log.ui.controller';
import { setLogList } from '../../redux/reducers/logSlice';
import { updateTabNum } from '../../redux/reducers/uiSlice';
import Favicon from '../atoms/Favicon';
import {
    DragDropContext,
    Draggable,
    Droppable,
    DropResult,
    resetServerContext,
} from 'react-beautiful-dnd';
import { GetServerSideProps } from 'next';
import {
    GridContextProvider,
    GridDropZone,
    GridItem,
    swap,
    move,
} from 'react-grid-dnd';
import { asyncLocalStorage } from '../../general/utils/asyncLocalStorage';
import { categoryIdForGetLogKey } from '../../general/constants/localStorageKey';
import EditIcon from '@mui/icons-material/Edit';
import ListItemIcon from '@mui/material/ListItemIcon';
import DeleteIcon from '@mui/icons-material/Delete';
import { toDataUrl } from '../../general/functions/toDataurl';
import { useLocale } from '../../hooks/useLocale';
import PersonIcon from '@mui/icons-material/Person';
import CircularProgress from '@mui/material/CircularProgress';

const Category = () => {
    const dispatch = useAppDispatch();
    const [openCreateState, setOpenCreateState] = useState(false);
    const [openUpdateState, setOpenUpdateState] = useState(false);
    const [openDeleteState, setOpenDeleteState] = useState(false);
    const [isDrag, setIsDrag] = useState(false);
    const [ready, setReady] = useState(false);
    const [selected, setSelected] = useState(null);
    const [dataurl, setDataurl] = useState('');
    const [fileName, setFileName] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [publicShowAll, setPublicShowAll] = useState(false);
    const [itemRefClientHeight, setItemRefClientHeight] = useState(null);
    const openMenuState = Boolean(anchorEl);
    const [publicSwitch, setPublicSwitch] = useState(false);
    const { handleSubmit, control, setValue, reset } = useForm();
    const categories = useAppSelector((state) => state.category.list);
    const publicCategories = useAppSelector(
        (state) => state.category.publicList,
    );
    const gridContextProviderRef = useRef(null);
    const { t } = useLocale();
    const itemRef = useRef(null);
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

    useEffect(() => {
        setReady(true);
        resetServerContext();
    }, []);

    useEffect(() => {
        if (openUpdateState) {
            setValue('name', selected.name);
            setDataurl(selected.image);
            setPublicSwitch(Boolean(selected.public));
            return;
        }

        resetFormValue();
    }, [openCreateState, openUpdateState]);

    useEffect(() => {
        console.log(itemRef.current?.clientHeight);
        setItemRefClientHeight(itemRef.current?.clientHeight);
    }, [itemRef.current?.clientHeight]);

    const createCategory = async (data: CreateCategoryDto) => {
        await categoryUiController.create({
            name: data.name,
            image: dataurl,
            public: !!publicSwitch,
        });
        await closeAll(fromAction.create);
    };

    const inputImage = async (event: any) => {
        const file = event.target.files[0];
        const dataurl = await toDataUrl(file, { maxWidth: 640 });
        setDataurl(dataurl);
        setFileName(file.name);
        event.target.value = null;
    };

    const updateCategory = async (data: UpdateCategoryDto) => {
        await categoryUiController.update(selected.id, {
            name: data.name,
            image: dataurl,
            public: !!publicSwitch,
        });
        await closeAll(fromAction.update);
    };

    const deleteCategory = async () => {
        await categoryUiController.delete(selected.id);
        await closeAll(fromAction.delete);
    };

    const setList = async () => {
        const list = await categoryUiController.findAll();
        dispatch(setCategoryList(list));
    };

    const openTable = async (category: CategoryDto) => {
        const list = await categoryLogUiController.findAll(category.id);
        dispatch(setCategoryIdForGetLog(category.id));
        await asyncLocalStorage.setItem(
            categoryIdForGetLogKey,
            String(category.id),
        );
        dispatch(setLogList(list));
        dispatch(updateTabNum(1));
    };

    const openMenu = (
        event: React.MouseEvent<HTMLButtonElement>,
        category: CategoryDto,
    ) => {
        setSelected(category);
        setAnchorEl(event.currentTarget);
    };

    const openDialog = (from: FromAction, data?: CategoryDto) => {
        closeMenu();

        if (from === fromAction.create) {
            setOpenCreateState(true);
            return;
        }

        if (from === fromAction.update) {
            setOpenUpdateState(true);
            return;
        }

        if (from === fromAction.delete) {
            setOpenDeleteState(true);
            return;
        }
    };

    const closeAll = async (from: FromAction) => {
        await setList();
        closeDialog(from);
        closeMenu();
        setFileName(null);
        setPublicSwitch(false);
    };

    const closeDialog = (from: FromAction) => {
        if (from === fromAction.create) {
            setOpenCreateState(false);
            return;
        }

        if (from === fromAction.update) {
            setOpenUpdateState(false);
            return;
        }

        if (from === fromAction.delete) {
            setOpenDeleteState(false);
            return;
        }
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const resetFormValue = () => {
        reset({
            name: '',
        });
    };

    const onDragEnd = async (sourceId, sourceIndex, targetIndex, targetId) => {
        if (
            sourceIndex >= categories.length ||
            targetIndex >= categories.length ||
            sourceIndex === targetIndex
        )
            return;

        const source = categories[sourceIndex];
        const target = categories[targetIndex];

        const newCategories = await categoryUiController.dragAndDrop({
            sourceId: source.id,
            targetId: target.id,
        });
        dispatch(setCategoryList(newCategories));
    };

    if (!ready) return <></>;

    return (
        <>
            <Box
                sx={{ width: '95%', margin: '48px auto 0' }}
                ref={gridContextProviderRef}
            >
                <div className="flex justify-between">
                    <Typography>{t.public}</Typography>
                    {publicCategories.length > 8 ? (
                        <Typography>
                            <Link
                                onClick={() => {
                                    setPublicShowAll(!publicShowAll);
                                }}
                            >
                                {publicShowAll ? t.close : t.seeMore}
                            </Link>
                        </Typography>
                    ) : (
                        <></>
                    )}
                </div>
                <GridContextProvider onChange={onDragEnd}>
                    <GridDropZone
                        style={{
                            flex: '1',
                            height: '150px',
                        }}
                        disableDrag
                        disableDrop
                        id="category"
                        boxesPerRow={8}
                        rowHeight={200}
                    >
                        {publicCategories.map((category, index) => {
                            if (index >= 8 && !publicShowAll) return;

                            return (
                                <GridItem
                                    key={category.id}
                                    style={{ textAlign: 'center' }}
                                >
                                    <ButtonBase
                                        sx={{
                                            width: '90%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                        }}
                                        onClick={() => {
                                            openTable(category);
                                        }}
                                    >
                                        {category.image ? (
                                            <Item
                                                sx={{
                                                    width: '100%',
                                                    height: '0px',
                                                    paddingBottom: '100%',
                                                    position: 'relative',
                                                }}
                                                ref={itemRef}
                                            >
                                                <div
                                                    style={{
                                                        width: '80%',
                                                        height: '100%',
                                                        position: 'absolute',
                                                        bottom: '-10%',
                                                    }}
                                                >
                                                    <img
                                                        src={category.image}
                                                        alt={''}
                                                        style={{
                                                            width: '100%',
                                                            height: '60%',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px',
                                                            marginBottom: '5%',
                                                        }}
                                                        onError={(event: any) =>
                                                            (event.target.style.display =
                                                                'none')
                                                        }
                                                    />
                                                    <div className="flex items-center justify-center">
                                                        {category?.userIcon ? (
                                                            <Avatar
                                                                src={
                                                                    category?.userIcon
                                                                }
                                                                sx={{
                                                                    width: 28,
                                                                    height: 28,
                                                                }}
                                                            />
                                                        ) : (
                                                            <Avatar
                                                                sx={{
                                                                    width: 28,
                                                                    height: 28,
                                                                    marginTop:
                                                                        '4px',
                                                                }}
                                                            >
                                                                <PersonIcon />
                                                            </Avatar>
                                                        )}

                                                        <div
                                                            className="ml-2 whitespace-nowrap"
                                                            style={{
                                                                maxWidth:
                                                                    'calc(100% - 28px)',
                                                            }}
                                                        >
                                                            <div
                                                                className="text-xs font-bold"
                                                                style={{
                                                                    textOverflow:
                                                                        'ellipsis',
                                                                    overflow:
                                                                        'hidden',
                                                                }}
                                                            >
                                                                {
                                                                    category?.userName
                                                                }
                                                            </div>
                                                            <Tooltip
                                                                title={
                                                                    category?.name
                                                                }
                                                                enterDelay={500}
                                                                enterNextDelay={
                                                                    500
                                                                }
                                                                placement="bottom"
                                                                arrow
                                                            >
                                                                <div
                                                                    className="-mt-2"
                                                                    style={{
                                                                        textOverflow:
                                                                            'ellipsis',
                                                                        overflow:
                                                                            'hidden',
                                                                    }}
                                                                >
                                                                    {
                                                                        category?.name
                                                                    }
                                                                </div>
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Item>
                                        ) : (
                                            <Item
                                                sx={{
                                                    width: '100%',
                                                    height: '0px',
                                                    paddingBottom: '100%',
                                                }}
                                                ref={itemRef}
                                            >
                                                <div
                                                    style={{
                                                        marginTop: '100%',
                                                        width: '85%',
                                                    }}
                                                >
                                                    <img
                                                        src={category.image}
                                                        alt={''}
                                                        style={{
                                                            width: '100%',
                                                            height: itemRefClientHeight
                                                                ? itemRefClientHeight *
                                                                      0.7 +
                                                                  'px'
                                                                : '85px',
                                                            maxHeight: '128px',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px',
                                                        }}
                                                        onError={(event: any) =>
                                                            (event.target.style.display =
                                                                'none')
                                                        }
                                                    />

                                                    <div className="flex items-center justify-center">
                                                        {category?.userIcon ? (
                                                            <Avatar
                                                                src={
                                                                    category?.userIcon
                                                                }
                                                                sx={{
                                                                    width: 28,
                                                                    height: 28,
                                                                    marginTop:
                                                                        '4px',
                                                                }}
                                                            />
                                                        ) : (
                                                            <Avatar
                                                                sx={{
                                                                    width: 28,
                                                                    height: 28,
                                                                    marginTop:
                                                                        '4px',
                                                                }}
                                                            >
                                                                <PersonIcon />
                                                            </Avatar>
                                                        )}

                                                        <div
                                                            className="ml-2 whitespace-nowrap"
                                                            style={{
                                                                maxWidth:
                                                                    'calc(100% - 28px)',
                                                            }}
                                                        >
                                                            <div
                                                                className="text-xs font-bold"
                                                                style={{
                                                                    textOverflow:
                                                                        'ellipsis',
                                                                    overflow:
                                                                        'hidden',
                                                                }}
                                                            >
                                                                {
                                                                    category?.userName
                                                                }
                                                            </div>
                                                            <Tooltip
                                                                title={
                                                                    category?.name
                                                                }
                                                                enterDelay={500}
                                                                enterNextDelay={
                                                                    500
                                                                }
                                                                placement="bottom"
                                                                arrow
                                                            >
                                                                <div
                                                                    className="-mt-2"
                                                                    style={{
                                                                        textOverflow:
                                                                            'ellipsis',
                                                                        overflow:
                                                                            'hidden',
                                                                    }}
                                                                >
                                                                    {
                                                                        category?.name
                                                                    }
                                                                </div>
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Item>
                                        )}
                                    </ButtonBase>
                                </GridItem>
                            );
                        })}
                    </GridDropZone>
                </GridContextProvider>
            </Box>
            {publicShowAll ? (
                <></>
            ) : (
                <Box
                    sx={{ width: '95%', margin: '48px auto 0' }}
                    ref={gridContextProviderRef}
                >
                    <Typography>{t.private}</Typography>
                    <GridContextProvider onChange={onDragEnd}>
                        <GridDropZone
                            style={{
                                flex: '1',
                                height: gridContextProviderRef.current
                                    ?.scrollHeight
                                    ? gridContextProviderRef.current
                                          ?.scrollHeight + 'px'
                                    : '100vh',
                            }}
                            id="category"
                            boxesPerRow={8}
                            rowHeight={200}
                        >
                            {categories.map((category) => (
                                <GridItem
                                    key={category.id}
                                    style={{ textAlign: 'center' }}
                                >
                                    <ButtonBase
                                        sx={{
                                            width: '90%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                        }}
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
                                                openTable(category);
                                                return;
                                            }

                                            if (e.nativeEvent.button === 2) {
                                                openMenu(e, category);
                                            }
                                        }}
                                    >
                                        {category.image ? (
                                            <Item
                                                sx={{
                                                    width: '100%',
                                                    height: '0px',
                                                    paddingBottom: '100%',
                                                    position: 'relative',
                                                }}
                                                ref={itemRef}
                                            >
                                                <div
                                                    style={{
                                                        width: '80%',
                                                        height: '100%',
                                                        position: 'absolute',
                                                        bottom: '-10%',
                                                    }}
                                                >
                                                    <img
                                                        src={category.image}
                                                        alt={''}
                                                        style={{
                                                            width: '100%',
                                                            height: '65%',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px',
                                                            marginBottom: '5%',
                                                        }}
                                                        onError={(event: any) =>
                                                            (event.target.style.display =
                                                                'none')
                                                        }
                                                    />
                                                    <Tooltip
                                                        title={category?.name}
                                                        enterDelay={500}
                                                        enterNextDelay={500}
                                                        placement="bottom"
                                                        arrow
                                                    >
                                                        <div
                                                            className="whitespace-nowrap"
                                                            style={{
                                                                textOverflow:
                                                                    'ellipsis',
                                                                overflow:
                                                                    'hidden',
                                                            }}
                                                        >
                                                            {category?.name}
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            </Item>
                                        ) : (
                                            <Item
                                                sx={{
                                                    width: '100%',
                                                    height: '0px',
                                                    paddingBottom: '100%',
                                                }}
                                                ref={itemRef}
                                            >
                                                <div
                                                    style={{
                                                        marginTop: '100%',
                                                        width: '85%',
                                                    }}
                                                >
                                                    <Tooltip
                                                        title={category?.name}
                                                        enterDelay={500}
                                                        enterNextDelay={500}
                                                        placement="bottom"
                                                        arrow
                                                    >
                                                        <div
                                                            className="whitespace-nowrap"
                                                            style={{
                                                                textOverflow:
                                                                    'ellipsis',
                                                                overflow:
                                                                    'hidden',
                                                            }}
                                                        >
                                                            {category?.name}
                                                        </div>
                                                    </Tooltip>
                                                </div>
                                            </Item>
                                        )}
                                    </ButtonBase>
                                </GridItem>
                            ))}
                            <GridItem style={{ textAlign: 'center' }}>
                                <ButtonBase
                                    sx={{
                                        width: '90%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                    }}
                                    onClick={() => {
                                        openDialog(fromAction.create);
                                    }}
                                >
                                    <Item
                                        sx={{
                                            width: '100%',
                                            height: '0px',
                                            paddingBottom: '100%',
                                        }}
                                    >
                                        <div style={{ marginTop: '100%' }}>
                                            <AddIcon />
                                        </div>
                                    </Item>
                                </ButtonBase>
                            </GridItem>
                        </GridDropZone>
                    </GridContextProvider>
                </Box>
            )}
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
                        openDialog(fromAction.update);
                    }}
                >
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t.menu.edit}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        openDialog(fromAction.delete);
                    }}
                >
                    <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{t.menu.delete}</ListItemText>
                </MenuItem>
            </Menu>
            <Dialog open={openCreateState} maxWidth="xs">
                <form onSubmit={handleSubmit(createCategory)}>
                    <DialogTitle>{t.dialog.createCategory.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t.dialog.createCategory.contentText}
                        </DialogContentText>
                        <Controller
                            name={'name'}
                            control={control}
                            defaultValue=""
                            render={({
                                field: { onChange, value },
                                fieldState: { error },
                            }) => (
                                <TextField
                                    label={t.category.name}
                                    margin="dense"
                                    fullWidth
                                    variant="standard"
                                    value={value}
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error ? error.message : null}
                                />
                            )}
                            rules={{
                                required: 'Name required',
                                maxLength: {
                                    value: 32,
                                    message: 'Max length exceeded',
                                },
                            }}
                        />
                        <div className="flex my-4">
                            <Button
                                variant="outlined"
                                component="label"
                                size="small"
                            >
                                {t.form.uploadFile}
                                <input
                                    type="file"
                                    accept="image/png, image/jpg"
                                    hidden
                                    onInput={inputImage}
                                />
                            </Button>
                            <div className="ml-2">{fileName}</div>
                        </div>
                        <FormControlLabel
                            control={
                                <Switch
                                    onChange={(e) => {
                                        setPublicSwitch(e.target.checked);
                                    }}
                                    checked={publicSwitch}
                                />
                            }
                            label={t.category.public}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                closeDialog(fromAction.create);
                            }}
                            className="text-black"
                        >
                            {t.form.canncel}
                        </Button>
                        <Button type="submit" variant="outlined">
                            {t.form.create}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={openUpdateState} maxWidth="xs">
                <form onSubmit={handleSubmit(updateCategory)}>
                    <DialogTitle>{t.dialog.editCategory.title}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t.dialog.editCategory.contentText}
                        </DialogContentText>
                        <Controller
                            name={'name'}
                            control={control}
                            defaultValue=""
                            render={({
                                field: { onChange, value },
                                fieldState: { error },
                            }) => (
                                <TextField
                                    label={t.category.name}
                                    margin="dense"
                                    fullWidth
                                    variant="standard"
                                    value={value}
                                    onChange={onChange}
                                    error={!!error}
                                    helperText={error ? error.message : null}
                                />
                            )}
                            rules={{
                                required: 'Name required',
                                maxLength: {
                                    value: 128,
                                    message: 'Max length exceded',
                                },
                            }}
                        />
                        <div className="flex my-4">
                            <Button
                                variant="outlined"
                                component="label"
                                size="small"
                            >
                                {t.form.uploadFile}
                                <input
                                    type="file"
                                    accept="image/png, image/jpg"
                                    hidden
                                    onInput={inputImage}
                                />
                            </Button>
                            <div className="ml-2">{fileName}</div>
                        </div>
                        <FormControlLabel
                            control={
                                <Switch
                                    onChange={(e) => {
                                        setPublicSwitch(e.target.checked);
                                    }}
                                    checked={publicSwitch}
                                />
                            }
                            label={t.category.public}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            onClick={() => {
                                closeDialog(fromAction.update);
                            }}
                            className="text-black"
                        >
                            {t.form.canncel}
                        </Button>
                        <Button type="submit" variant="outlined">
                            {t.form.update}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
            <Dialog open={openDeleteState} maxWidth="xs">
                <DialogTitle>
                    <DeleteIcon color="error" className="p-0 mr-4" />
                    {t.dialog.deleteCategory.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t.dialog.deleteCategory.contentText}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            closeDialog(fromAction.delete);
                        }}
                        className="text-black"
                    >
                        {t.form.canncel}
                    </Button>
                    <Button
                        type="submit"
                        variant="outlined"
                        color="error"
                        onClick={deleteCategory}
                    >
                        {t.form.delete}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    resetServerContext();
    return { props: { data: [] } };
};

export default Category;
