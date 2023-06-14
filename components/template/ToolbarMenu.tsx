import { Avatar, Chip, Grid, Toolbar } from '@mui/material';
import { CONTENT_CATEGORY } from '../../general/constants/contentCategory';
import { useLocale } from '../../hooks/useLocale';
import { contentUiController } from '../../libs/content/presentation/content.ui.controler';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setContentList } from '../../redux/reducers/contentSlice';
import { updateLoading } from '../../redux/reducers/uiSlice';

const ToolbarMenu = () => {
    const { t, locale } = useLocale();
    const dispatch = useAppDispatch();
    const dark = useAppSelector((state) => state.ui.dark);

    const narrowDown = async (categoryId?: number) => {
        dispatch(updateLoading(true));

        if (categoryId === undefined) {
            const contents = await contentUiController.findAll();
            dispatch(setContentList(contents));
        } else {
            const contents = await contentUiController.find({
                categoryId,
            });
            dispatch(setContentList(contents));
        }

        dispatch(updateLoading(false));
    };

    return (
        <Toolbar
            className="gap-4 fixed w-full z-50"
            style={{
                background: dark ? '#121212' : '#ffffff',
            }}
        >
            <Chip
                label={t.all}
                variant="outlined"
                onClick={async () => {
                    await narrowDown();
                }}
            />
            <Chip
                label={t.image}
                variant="outlined"
                onClick={() => {
                    narrowDown(CONTENT_CATEGORY.IMAGE);
                }}
            />
            <Chip
                label={t.text}
                variant="outlined"
                onClick={() => {
                    narrowDown(CONTENT_CATEGORY.TEXT);
                }}
            />
            <Chip
                label={t.music}
                variant="outlined"
                onClick={() => {
                    narrowDown(CONTENT_CATEGORY.MUSIC);
                }}
                disabled={true}
            />
            <Chip
                label={t.video}
                variant="outlined"
                onClick={() => {
                    narrowDown(CONTENT_CATEGORY.VIDEO);
                }}
                disabled={true}
            />
            <Chip
                label={t.space}
                variant="outlined"
                onClick={() => {
                    narrowDown(CONTENT_CATEGORY.SPACE);
                }}
                disabled={true}
            />
        </Toolbar>
    );
};

export default ToolbarMenu;
