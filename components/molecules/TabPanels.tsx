import React, { Fragment } from 'react';
import { useAppSelector } from '../../redux/hooks';
import Iframe from '../atoms/iframes/Iframe';
import TabPanel from '../atoms/TabPanel';
import IFrameTabs from '../organisms/IFrameTabs';

export const TabPanels = () => {
    const tabNum = useAppSelector((state) => state.ui.tabNum);
    const iFrames = useAppSelector((state) => state.ui.iFrames);

    return (
        <>
            <TabPanel tabNum={tabNum} index={0}>
                <></>
            </TabPanel>
            <TabPanel tabNum={tabNum} index={1}>
                <></>
            </TabPanel>
            <TabPanel tabNum={tabNum} index={2}>
                <></>
            </TabPanel>
            <TabPanel tabNum={tabNum} index={3}>
                <></>
            </TabPanel>
            <TabPanel tabNum={tabNum} index={4}>
                <IFrameTabs />
            </TabPanel>
        </>
    );
};

export default TabPanels;
