import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import React from "react";
import ListCommonItem from "../atoms/listItems/ListCommonItem";
import ListCreateLogItem from "../atoms/listItems/ListCreateLogItem";
import ListAccountItem from "../atoms/listItems/ListAccountItem";
import { List, ListItemText, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import LogoutIcon from "@mui/icons-material/Logout";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { BasicTabs } from "../atoms/BasicTabs";
import Adsense from "../template/Adsence";
import InstallDesktopIcon from "@mui/icons-material/InstallDesktop";
import { asyncLocalStorage } from "../../general/utils/asyncLocalStorage";
import { accessTokenKey } from "../../general/constants/localStorageKey";
import ExtensionIcon from "@mui/icons-material/Extension";
import { spacing } from "@mui/system";
import { useLocale } from "../../hooks/useLocale";
import { useAnotherServices } from "../../hooks/anotherServices";
import { useAppSelector } from "../../redux/hooks";
import ListTipItem from "../atoms/listItems/ListTipItem";
import PaidIcon from "@mui/icons-material/Paid";

export const LeftNav = () => {
  const router = useRouter();
  const { t } = useLocale();
  const anotherServices = useAnotherServices();
  const dark = useAppSelector((state) => state.ui.dark);

  const logout = async () => {
    await asyncLocalStorage.removeItem(accessTokenKey);
    router.push("login");
  };

  return (
    <div
      className="overflow-hidden"
      style={{ backgroundColor: dark ? "" : "#FAFAFA" }}
    >
      <Toolbar />
      <Divider />
      <ListCreateLogItem />
      <BasicTabs />
      {/* <Divider />
          
            <ListCommonItem
                text={t.leftNav.desktopApp}
                link="/download"
                iconElement={<InstallDesktopIcon />}
            />
            <ListCommonItem
                text={t.leftNav.chromeExtension}
                link="https://chrome.google.com/webstore/detail/deepia/nmmfoalnbcllnnknfagnfmdmdkdgjgoi"
                iconElement={<ExtensionIcon />}
            /> */}
      {/* <ListTipItem text={t.leftNav.tipping} iconElement={<PaidIcon />} /> */}
      {/* <Divider />
            <List
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                }}
            >
                <ListItemText className="text-gray-500 ml-2">
                    Powered by DeepRecommend
                </ListItemText>
                {anotherServices.map((service) => {
                    return (
                        <div key={service.title}>
                            <ListCommonItem
                                text={service.title}
                                link={service.link}
                                iconElement={service.iconElement}
                            />
                        </div>
                    );
                })}
            </List> */}
      <Adsense />
    </div>
  );
};

export default LeftNav;
