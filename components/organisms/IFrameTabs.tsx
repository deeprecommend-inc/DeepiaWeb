import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import Iframe from '../atoms/iframes/Iframe';
import TabPanel from '@mui/lab/TabPanel';
import { setIFrames } from '../../redux/reducers/uiSlice';
import { initialIFrames } from '../../general/constants/initialIFrames';
import Favicon from '../atoms/Favicon';
import { asyncLocalStorage } from '../../general/utils/asyncLocalStorage';
import { iFramesKey } from '../../general/constants/localStorageKey';

const IFrameTabs = () => {
    const dispatch = useAppDispatch();
    const [value, setValue] = useState('1');
    const iFrames = useAppSelector((state) => state.ui.iFrames);

    useEffect(() => {
        const init = async () => {
            const iFrames = JSON.parse(
                await asyncLocalStorage.getItem(iFramesKey),
            );
            const inputIFrames = iFrames ? iFrames : initialIFrames;
            dispatch(setIFrames(inputIFrames));
        };
        init();
    }, []);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '95%', margin: '32px auto 0', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList
                        onChange={handleChange}
                        aria-label="lab API tabs example"
                    >
                        {iFrames.map((val, i) => {
                            const url = iFrames[iFrames.length - (i + 1)];
                            return (
                                <Tab
                                    key={String(url + i)}
                                    icon={<Favicon url={url} />}
                                    iconPosition="start"
                                    label={String(url)}
                                    value={String(i + 1)}
                                />
                            );
                        })}
                    </TabList>
                </Box>

                {iFrames.map((val, i) => {
                    const url = iFrames[iFrames.length - (i + 1)];
                    return (
                        <TabPanel key={String(url + i)} value={String(i + 1)}>
                            <Iframe url={url} />
                        </TabPanel>
                    );
                })}
            </TabContext>
        </Box>
    );
};

export default IFrameTabs;
