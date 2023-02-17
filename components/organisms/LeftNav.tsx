import Toolbar from "@mui/material/Toolbar";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import React from "react";
import ListCommonItem from "../atoms/listItems/ListCommonItem";
import ListCreateLogItem from "../atoms/listItems/ListCreateLogItem";
import ListAccountItem from "../atoms/listItems/ListAccountItem";
import { List, ListItemText, Tab, Tabs, Typography } from "@mui/material";
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
import Logo from "../atoms/Logo";
import { CopyrightContent } from "../molecules/CopyrightContent";
import { useMenus } from "../../hooks/menu";

export const LeftNav = () => {
  const router = useRouter();
  const { t } = useLocale();
  const anotherServices = useAnotherServices();
  const menus = useMenus();
  const dark = useAppSelector((state) => state.ui.dark);

  const logout = async () => {
    await asyncLocalStorage.removeItem(accessTokenKey);
    router.push("login");
  };

  return (
    <div
      className="overflow-hidden"
      style={{ backgroundColor: dark ? "" : "#ffffff" }}
    >
      <Toolbar
        onClick={() => {
          router.push("/");
        }}
        style={{ minHeight: "64px" }}
      >
        <Logo />
        <Typography
          variant="h6"
          noWrap
          component="div"
          sx={{
            color: dark ? "#B8B8B8" : "#000000",
            display: "flex",
            justifyContent: "start",
            alignItems: "center",
            fontWeight: 600,
          }}
        >
          Deepia
        </Typography>
      </Toolbar>
      <Divider />
      {/* <ListCreateLogItem />
      <BasicTabs /> */}
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
      <List>
        {menus.map((menu) => {
          return (
            <div key={menu.title}>
              <ListCommonItem
                text={menu.title}
                iconElement={menu.iconElement}
                callback={() => {
                  router.push(menu.link);
                }}
              />
            </div>
          );
        })}
      </List>
      <Divider />

      <List>
        <div className="ml-4 font-semibold">{t.leftNav.following}</div>
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
      </List>

      <List
        sx={{
          position: "absolute",
          width: "100%",
          bottom: 0,
          left: 0,
        }}
      >
        <Divider />
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
        <CopyrightContent className="ml-4" />
      </List>
    </div>
  );
};

export default LeftNav;
