import React, { ReactElement, useState } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useAppSelector } from '../../../redux/hooks';
import { Divider, Menu, MenuItem, Typography } from '@mui/material';
import { fromAction } from '../../../general/utils/from.action';
import CurrencyYenIcon from '@mui/icons-material/CurrencyYen';
import { useLocale } from '../../../hooks/useLocale';

type Props = {
    text: string;
    link?: string;
    callback?: () => void;
    iconElement: ReactElement<any, any>;
};

const ListTipItem = (props: Props) => {
    const { text, callback, iconElement } = props;
    const dark = useAppSelector((state) => state.ui.dark);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenuState = Boolean(anchorEl);
    const { t } = useLocale();

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const windowOpen = (url: string) => {
        window.open(url);
    };

    return (
        <>
            <ListItem
                button
                key={text}
                onClick={(e) => {
                    openMenu(e);
                }}
            >
                <ListItemIcon>{iconElement}</ListItemIcon>
                <ListItemText
                    primary={text}
                    style={{ color: dark ? '#B8B8B8' : '#707070' }}
                />
            </ListItem>

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
                <Typography>{t.individual}</Typography>
                <MenuItem
                    onClick={() => {
                        windowOpen('https://buy.stripe.com/6oE9E6arGeYF6ukaEI');
                    }}
                >
                    <ListItemText>{t.menu.tipping.premium}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        windowOpen('https://buy.stripe.com/6oEbMeczO7wd2e45kp');
                    }}
                >
                    <ListItemText>{t.menu.tipping.special}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        windowOpen('https://buy.stripe.com/4gwg2u8jy9El05W6op');
                    }}
                >
                    <ListItemText>{t.menu.tipping.regular}</ListItemText>
                </MenuItem>
                <Divider />
                <Typography>{t.business}</Typography>
                <MenuItem
                    onClick={() => {
                        windowOpen('https://buy.stripe.com/eVag2u6bqcQx9GwcMP');
                    }}
                >
                    <ListItemText>{t.menu.tippingToB.premium}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        windowOpen('https://buy.stripe.com/eVadUm2ZeaIpdWMfZ0');
                    }}
                >
                    <ListItemText>{t.menu.tippingToB.special}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        windowOpen('https://buy.stripe.com/aEUaIaeHW9El1a06oo');
                    }}
                >
                    <ListItemText>{t.menu.tippingToB.regular}</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default ListTipItem;
