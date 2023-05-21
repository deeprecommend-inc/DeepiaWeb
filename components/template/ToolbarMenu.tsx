import { Avatar, Chip, Grid, Toolbar } from '@mui/material';
import { CONTENT_CATEGORY } from '../../general/constants/contentCategory';
import { useLocale } from '../../hooks/useLocale';
import { useAppSelector } from '../../redux/hooks';

const ToolbarMenu = () => {
    const { t, locale } = useLocale();
    const dark = useAppSelector((state) => state.ui.dark);

    const narrowDown = (num: number) => {
        // TODO: コンテンツ取得
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
                onClick={() => {
                    narrowDown(null);
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
