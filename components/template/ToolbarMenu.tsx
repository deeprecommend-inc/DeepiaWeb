import { Avatar, Chip, Grid, Toolbar } from '@mui/material';
import { useLocale } from '../../hooks/useLocale';
import { useAppSelector } from '../../redux/hooks';

const ToolbarMenu = () => {
    const { t, locale } = useLocale();
    const dark = useAppSelector((state) => state.ui.dark);

    const narrowDown = (num: number) => {};

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
                    narrowDown(0);
                }}
            />
            <Chip
                label={t.image}
                variant="outlined"
                onClick={() => {
                    narrowDown(1);
                }}
            />
            <Chip
                label={t.text}
                variant="outlined"
                onClick={() => {
                    narrowDown(2);
                }}
            />
            <Chip
                label={t.music}
                variant="outlined"
                onClick={() => {
                    narrowDown(3);
                }}
            />
            {/* <Chip
              label={t.video}
              variant="outlined"
              onClick={() => {
                narrowDown(4);
              }}
            /> */}
        </Toolbar>
    );
};

export default ToolbarMenu;
