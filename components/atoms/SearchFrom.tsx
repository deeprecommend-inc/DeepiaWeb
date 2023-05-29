import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import DirectionsIcon from '@mui/icons-material/Directions';
import { useLocale } from '../../hooks/useLocale';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { contentUiController } from '../../libs/content/presentation/content.ui.controler';
import { setContentList } from '../../redux/reducers/contentSlice';

export const SearchForm = () => {
    const { t } = useLocale();
    const dispatch = useAppDispatch();
    const [searchWord, setSearchWord] = useState('');
    const dark = useAppSelector((state) => state.ui.dark);

    const narrowDown = async (searchWord: string) => {
        const contents = await contentUiController.find({ searchWord });
        dispatch(setContentList(contents));
    };

    const handleSearch = () => {
        narrowDown(searchWord);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        handleSearch();
    };

    return (
        <Paper
            component="form"
            sx={{
                p: '2px 4px',
                display: 'flex',
                alignItems: 'center',
                width: 400,
                border: '1px solid rgba(0, 0, 0, 0.12)',
                backgroundColor: dark ? '#2F2F2F' : '#f5f5f5',
                borderRadius: '24px',
            }}
            onSubmit={handleSubmit}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder={t.search}
                inputProps={{ 'aria-label': 'search' }}
                value={searchWord}
                onChange={(event) => setSearchWord(event.target.value)}
            />
            <IconButton
                type="button"
                sx={{ p: '10px' }}
                aria-label="search"
                onClick={handleSearch}
            >
                <SearchIcon />
            </IconButton>
        </Paper>
    );
};
