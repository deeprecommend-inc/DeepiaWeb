import React, { ReactElement } from 'react';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link } from '@mui/material';
import { useAppSelector } from '../../../redux/hooks';

type Props = {
    text: string;
    link?: string;
    callback?: () => void;
    iconElement: ReactElement<any, any>;
};

const ListCommonItem = (props: Props) => {
    const { text, link, callback, iconElement } = props;
    const dark = useAppSelector((state) => state.ui.dark);

    return (
        <ListItem button key={text} onClick={callback}>
            <ListItemIcon>{iconElement}</ListItemIcon>
            {link ? (
                <Link
                    href={link}
                    underline="none"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <ListItemText
                        primary={text}
                        style={{ color: dark ? '#B8B8B8' : '#707070' }}
                    />
                </Link>
            ) : (
                <ListItemText
                    primary={text}
                    style={{ color: dark ? '#B8B8B8' : '#707070' }}
                />
            )}
        </ListItem>
    );
};

export default ListCommonItem;
