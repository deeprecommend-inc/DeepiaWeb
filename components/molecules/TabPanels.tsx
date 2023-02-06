import React, { Fragment } from 'react';
import { useAppSelector } from '../../redux/hooks';
import Iframe from '../atoms/iframes/Iframe';
import TabPanel from '../atoms/TabPanel';
import IFrameTabs from '../organisms/IFrameTabs';
import Category from '../template/Category';
import LikeNatvie from '../template/LikeNative';
import Recommendation from '../template/Recommendation';
import EnhancedTable from './EnhancedTable';

export const TabPanels = () => {
    const tabNum = useAppSelector((state) => state.ui.tabNum);
    const iFrames = useAppSelector((state) => state.ui.iFrames);

    return (
        <>
            <TabPanel tabNum={tabNum} index={0}>
                <Category />
            </TabPanel>
            <TabPanel tabNum={tabNum} index={1}>
                <EnhancedTable />
            </TabPanel>
            <TabPanel tabNum={tabNum} index={2}>
                <LikeNatvie />
            </TabPanel>
            <TabPanel tabNum={tabNum} index={3}>
                <Recommendation />
            </TabPanel>
            <TabPanel tabNum={tabNum} index={4}>
                <IFrameTabs />
            </TabPanel>
        </>
    );
};

export default TabPanels;
